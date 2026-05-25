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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const client_1 = require("@prisma/client");
let OrderService = class OrderService {
    prisma;
    httpService;
    configService;
    productServiceUrl;
    internalSecret;
    constructor(prisma, httpService, configService) {
        this.prisma = prisma;
        this.httpService = httpService;
        this.configService = configService;
        this.productServiceUrl = this.configService.get('PRODUCT_SERVICE_URL') || '';
        this.internalSecret = this.configService.get('INTERNAL_SECRET') || '';
    }
    async create(userId, dto) {
        const validateResponse = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${this.productServiceUrl}/products/internal/validate-stock`, { items: dto.items }, { headers: { 'x-internal-secret': this.internalSecret } }));
        const { valid, items } = validateResponse.data;
        if (!valid) {
            const invalidItems = items
                .filter((i) => !i.valid)
                .map((i) => i.productId)
                .join(', ');
            throw new common_1.BadRequestException(`Stock insufficient for products: ${invalidItems}`);
        }
        let totalAmount = 0;
        const orderItemsData = dto.items.map((item) => {
            const productInfo = items.find((i) => i.productId === item.productId);
            const price = Number(productInfo.price);
            totalAmount += price * item.quantity;
            return {
                productId: item.productId,
                productName: productInfo.name,
                price: price,
                quantity: item.quantity,
            };
        });
        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    userId,
                    totalAmount,
                    items: {
                        create: orderItemsData,
                    },
                },
                include: { items: true },
            });
            await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${this.productServiceUrl}/stock/internal/reduce`, { items: dto.items }, { headers: { 'x-internal-secret': this.internalSecret } }));
            return newOrder;
        });
        return order;
    }
    async findAll(userId, role) {
        if (role === 'ADMIN') {
            return this.prisma.order.findMany({ include: { items: true } });
        }
        return this.prisma.order.findMany({
            where: { userId },
            include: { items: true },
        });
    }
    async findOne(id, userId, role) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        if (role !== 'ADMIN' && order.userId !== userId) {
            throw new common_1.BadRequestException('You do not have permission to view this order');
        }
        return order;
    }
    async cancel(id, userId) {
        const order = await this.findOne(id, userId, 'CUSTOMER');
        if (order.status !== client_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending orders can be cancelled');
        }
        return this.prisma.order.update({
            where: { id },
            data: { status: client_1.OrderStatus.CANCELLED },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.order.update({
            where: { id },
            data: { status },
        });
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        axios_1.HttpService,
        config_1.ConfigService])
], OrderService);
//# sourceMappingURL=order.service.js.map