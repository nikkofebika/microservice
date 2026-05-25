"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductService = class ProductService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { page = 1, limit = 10, search = '' } = query;
        const skip = (page - 1) * limit;
        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
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
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: { stock: true },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async create(dto) {
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
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.product.update({
            where: { id },
            data: dto,
            include: { stock: true },
        });
    }
    async validateStock(items) {
        const results = await Promise.all(items.map(async (item) => {
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
        }));
        const allValid = results.every((r) => r.valid);
        return { valid: allValid, items: results };
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductService);
//# sourceMappingURL=product.service.js.map