import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '@prisma/client';
export declare class OrderController {
    private orderService;
    constructor(orderService: OrderService);
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
    updateStatus(id: string, body: {
        status: OrderStatus;
    }): Promise<{
        id: string;
        userId: string;
        totalAmount: import("@prisma/client-runtime-utils").Decimal;
        status: import("@prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
