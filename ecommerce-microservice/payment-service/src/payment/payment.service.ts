import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { ManualTransferProvider } from './providers/manual-transfer.provider';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
  private orderServiceUrl: string;
  private internalSecret: string;

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private configService: ConfigService,
    private manualProvider: ManualTransferProvider,
  ) {
    this.orderServiceUrl = this.configService.get('ORDER_SERVICE_URL') || '';
    this.internalSecret = this.configService.get('INTERNAL_SECRET') || '';
  }

  async initiate(orderId: string, userId: string) {
    // 1. Fetch order details from Order Service
    const orderResponse = await firstValueFrom(
      this.httpService.get(
        `${this.orderServiceUrl}/orders/internal/${orderId}`,
        { headers: { 'x-internal-secret': this.internalSecret } },
      ),
    );

    const order = orderResponse.data;

    if (order.userId !== userId) {
      throw new BadRequestException('Order does not belong to user');
    }

    // 2. Create payment record
    const payment = await this.prisma.payment.upsert({
      where: { orderId },
      update: {},
      create: {
        orderId,
        userId,
        amount: order.totalAmount,
        method: 'MANUAL_TRANSFER',
        status: PaymentStatus.PENDING,
      },
    });

    // 3. Initiate via provider
    const result = await this.manualProvider.initiate(
      orderId,
      Number(order.totalAmount),
    );

    // 4. Update Order status to WAITING_PAYMENT
    await firstValueFrom(
      this.httpService.patch(
        `${this.orderServiceUrl}/orders/internal/${orderId}/status`,
        { status: 'WAITING_PAYMENT' },
        { headers: { 'x-internal-secret': this.internalSecret } },
      ),
    );

    return { payment, ...result };
  }

  async uploadProof(id: string, userId: string, filePath: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.userId !== userId) {
      throw new BadRequestException('Not your payment');
    }

    return this.prisma.payment.update({
      where: { id },
      data: {
        proofImageUrl: filePath,
        status: PaymentStatus.SUBMITTED,
      },
    });
  }

  async approve(id: string, adminId: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const updatedPayment = await this.prisma.payment.update({
      where: { id },
      data: {
        status: PaymentStatus.APPROVED,
        approvedBy: adminId,
        approvedAt: new Date(),
      },
    });

    // Notify Order Service
    await firstValueFrom(
      this.httpService.patch(
        `${this.orderServiceUrl}/orders/internal/${payment.orderId}/status`,
        { status: 'PAID' },
        { headers: { 'x-internal-secret': this.internalSecret } },
      ),
    );

    return updatedPayment;
  }

  async reject(id: string) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return this.prisma.payment.update({
      where: { id },
      data: { status: PaymentStatus.REJECTED },
    });
  }

  async findAll() {
    return this.prisma.payment.findMany();
  }

  async findOne(id: string) {
    return this.prisma.payment.findUnique({ where: { id } });
  }
}
