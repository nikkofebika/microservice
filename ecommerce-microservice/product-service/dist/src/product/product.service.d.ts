import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { Prisma } from '@prisma/client';
export declare class ProductService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: any): Promise<{
        data: ({
            stock: {
                id: string;
                updatedAt: Date;
                productId: string;
                quantity: number;
            } | null;
        } & {
            name: string;
            description: string | null;
            price: Prisma.Decimal;
            imageUrl: string | null;
            isActive: boolean;
            id: string;
            createdAt: Date;
            updatedAt: Date;
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<{
        stock: {
            id: string;
            updatedAt: Date;
            productId: string;
            quantity: number;
        } | null;
    } & {
        name: string;
        description: string | null;
        price: Prisma.Decimal;
        imageUrl: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(dto: CreateProductDto): Promise<{
        stock: {
            id: string;
            updatedAt: Date;
            productId: string;
            quantity: number;
        } | null;
    } & {
        name: string;
        description: string | null;
        price: Prisma.Decimal;
        imageUrl: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateProductDto): Promise<{
        stock: {
            id: string;
            updatedAt: Date;
            productId: string;
            quantity: number;
        } | null;
    } & {
        name: string;
        description: string | null;
        price: Prisma.Decimal;
        imageUrl: string | null;
        isActive: boolean;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    validateStock(items: {
        productId: string;
        quantity: number;
    }[]): Promise<{
        valid: boolean;
        items: ({
            productId: string;
            valid: boolean;
            message: string;
            name?: undefined;
            price?: undefined;
            availableStock?: undefined;
        } | {
            productId: string;
            name: string;
            price: Prisma.Decimal;
            availableStock: number;
            valid: boolean;
            message?: undefined;
        })[];
    }>;
}
