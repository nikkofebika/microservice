import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from '@prisma/client';
export declare class OrderService {
    private prisma;
    private httpService;
    private configService;
    private productServiceUrl;
    private internalSecret;
    constructor(prisma: PrismaService, httpService: HttpService, configService: ConfigService);
    create(userId: string, dto: CreateOrderDto): Promise<{
        items: {
            productId: string;
            quantity: number;
            id: string;
            productName: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            orderId: string;
        }[];
    } & {
        id: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(userId: string, role: string): Promise<({
        items: {
            productId: string;
            quantity: number;
            id: string;
            productName: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            orderId: string;
        }[];
    } & {
        id: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: string, userId: string, role: string): Promise<{
        items: {
            productId: string;
            quantity: number;
            id: string;
            productName: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            orderId: string;
        }[];
    } & {
        id: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    cancel(id: string, userId: string): Promise<{
        id: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateStatus(id: string, status: OrderStatus): Promise<{
        id: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
