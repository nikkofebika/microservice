import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ManualTransferProvider } from './providers/manual-transfer.provider';
export declare class PaymentService {
    private prisma;
    private httpService;
    private configService;
    private manualProvider;
    private orderServiceUrl;
    private internalSecret;
    constructor(prisma: PrismaService, httpService: HttpService, configService: ConfigService, manualProvider: ManualTransferProvider);
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
    uploadProof(id: string, userId: string, filePath: string): Promise<{
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
}
