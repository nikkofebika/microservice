import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrderService {
  private productServiceUrl: string;
  private internalSecret: string;

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.productServiceUrl = this.configService.get('PRODUCT_SERVICE_URL') || '';
    this.internalSecret = this.configService.get('INTERNAL_SECRET') || '';
  }

  async create(userId: string, dto: CreateOrderDto) {
    // 1. Validate stock via Product Service
    const validateResponse = await lastValueFrom(
      this.httpService.post(
        `${this.productServiceUrl}/products/internal/validate-stock`,
        { items: dto.items },
        { headers: { 'x-internal-secret': this.internalSecret } },
      ),
    );

    const { valid, items } = validateResponse.data;

    if (!valid) {
      const invalidItems = items
        .filter((i: any) => !i.valid)
        .map((i: any) => i.productId)
        .join(', ');
      throw new BadRequestException(`Stock insufficient for products: ${invalidItems}`);
    }

    // 2. Calculate total and prepare snapshots
    let totalAmount = 0;
    const orderItemsData = dto.items.map((item) => {
      const productInfo = items.find((i: any) => i.productId === item.productId);
      const price = Number(productInfo.price);
      totalAmount += price * item.quantity;

      return {
        productId: item.productId,
        productName: productInfo.name,
        price: price,
        quantity: item.quantity,
      };
    });

    // 3. Create Order in transaction
    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount,
          items: {
            create: orderItemsData,
          },
        },
        include: { items: true },
      });

      // 4. Reduce stock via Product Service
      await lastValueFrom(
        this.httpService.post(
          `${this.productServiceUrl}/stock/internal/reduce`,
          { items: dto.items },
          { headers: { 'x-internal-secret': this.internalSecret } },
        ),
      );

      return newOrder;
    });

    return order;
  }

  async findAll(userId: string, role: string) {
    if (role === 'ADMIN') {
      return this.prisma.order.findMany({ include: { items: true } });
    }
    return this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
    });
  }

  async findOne(id: string, userId: string, role: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (role !== 'ADMIN' && order.userId !== userId) {
      throw new BadRequestException('You do not have permission to view this order');
    }

    return order;
  }

  async cancel(id: string, userId: string) {
    const order = await this.findOne(id, userId, 'CUSTOMER');

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Only pending orders can be cancelled');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
