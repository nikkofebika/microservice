import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
  constructor(private prisma: PrismaService) {}

  async updateStock(productId: string, quantity: number) {
    const stock = await this.prisma.stock.findUnique({
      where: { productId },
    });

    if (!stock) {
      throw new NotFoundException('Stock not found');
    }

    return this.prisma.stock.update({
      where: { productId },
      data: { quantity },
    });
  }

  async reduceStock(items: { productId: string; quantity: number }[]) {
    return this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        const stock = await tx.stock.findUnique({
          where: { productId: item.productId },
        });

        if (!stock || stock.quantity < item.quantity) {
          throw new BadRequestException(`Insufficient stock for product ${item.productId}`);
        }

        await tx.stock.update({
          where: { productId: item.productId },
          data: { quantity: { decrement: item.quantity } },
        });
      }
      return { success: true };
    });
  }
}
