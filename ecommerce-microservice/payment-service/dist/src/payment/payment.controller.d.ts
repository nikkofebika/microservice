import { PaymentService } from './payment.service';
export declare class PaymentController {
    private paymentService;
    constructor(paymentService: PaymentService);
    initiate(orderId: string, userId: string): Promise<{
        externalId?: string;
        redirectUrl?: string;
        instructions?: string;
        metadata?: Record<string, any>;
        payment: {
            id: string;
            orderId: string;
            userId: string;
            amount: import("@prisma/client-runtime-utils").Decimal;
            method: import("@prisma/client").$Enums.PaymentMethod;
            status: import("@prisma/client").$Enums.PaymentStatus;
            proofImageUrl: string | null;
            approvedBy: string | null;
            approvedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    uploadProof(id: string, userId: string, file: Express.Multer.File): Promise<{
        id: string;
        orderId: string;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        method: import("@prisma/client").$Enums.PaymentMethod;
        status: import("@prisma/client").$Enums.PaymentStatus;
        proofImageUrl: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findOne(id: string): Promise<{
        id: string;
        orderId: string;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        method: import("@prisma/client").$Enums.PaymentMethod;
        status: import("@prisma/client").$Enums.PaymentStatus;
        proofImageUrl: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findAll(): Promise<{
        id: string;
        orderId: string;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        method: import("@prisma/client").$Enums.PaymentMethod;
        status: import("@prisma/client").$Enums.PaymentStatus;
        proofImageUrl: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    approve(id: string, adminId: string): Promise<{
        id: string;
        orderId: string;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        method: import("@prisma/client").$Enums.PaymentMethod;
        status: import("@prisma/client").$Enums.PaymentStatus;
        proofImageUrl: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    reject(id: string): Promise<{
        id: string;
        orderId: string;
        userId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        method: import("@prisma/client").$Enums.PaymentMethod;
        status: import("@prisma/client").$Enums.PaymentStatus;
        proofImageUrl: string | null;
        approvedBy: string | null;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
