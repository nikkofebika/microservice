import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { page = 1, limit = 10, search = '' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
            { description: { contains: search, mode: 'insensitive' as Prisma.QueryMode } },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        include: { stock: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { stock: true },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    const { initialStock, ...productData } = dto;
    return this.prisma.product.create({
      data: {
        ...productData,
        stock: {
          create: { quantity: initialStock || 0 },
        },
      },
      include: { stock: true },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
      include: { stock: true },
    });
  }

  async validateStock(items: { productId: string; quantity: number }[]) {
    const results = await Promise.all(
      items.map(async (item) => {
        const product = await this.prisma.product.findUnique({
          where: { id: item.productId },
          include: { stock: true },
        });

        if (!product || !product.stock) {
          return {
            productId: item.productId,
            valid: false,
            message: 'Product or stock not found',
          };
        }

        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          availableStock: product.stock.quantity,
          valid: product.stock.quantity >= item.quantity,
        };
      }),
    );

    const allValid = results.every((r) => r.valid);
    return { valid: allValid, items: results };
  }
}
