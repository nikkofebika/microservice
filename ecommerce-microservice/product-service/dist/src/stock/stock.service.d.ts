import { PrismaService } from '../prisma/prisma.service';
export declare class StockService {
    private prisma;
    constructor(prisma: PrismaService);
    updateStock(productId: string, quantity: number): Promise<{
        id: string;
        updatedAt: Date;
        productId: string;
        quantity: number;
    }>;
    reduceStock(items: {
        productId: string;
        quantity: number;
    }[]): Promise<{
        success: boolean;
    }>;
}
