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
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const manual_transfer_provider_1 = require("./providers/manual-transfer.provider");
const client_1 = require("@prisma/client");
let PaymentService = class PaymentService {
    prisma;
    httpService;
    configService;
    manualProvider;
    orderServiceUrl;
    internalSecret;
    constructor(prisma, httpService, configService, manualProvider) {
        this.prisma = prisma;
        this.httpService = httpService;
        this.configService = configService;
        this.manualProvider = manualProvider;
        this.orderServiceUrl = this.configService.get('ORDER_SERVICE_URL') || '';
        this.internalSecret = this.configService.get('INTERNAL_SECRET') || '';
    }
    async initiate(orderId, userId) {
        const orderResponse = await firstValueFrom(this.httpService.get(`${this.orderServiceUrl}/orders/internal/${orderId}`, { headers: { 'x-internal-secret': this.internalSecret } }));
        const order = orderResponse.data;
        if (order.userId !== userId) {
            throw new common_1.BadRequestException('Order does not belong to user');
        }
        const payment = await this.prisma.payment.upsert({
            where: { orderId },
            update: {},
            create: {
                orderId,
                userId,
                amount: order.totalAmount,
                method: 'MANUAL_TRANSFER',
                status: client_1.PaymentStatus.PENDING,
            },
        });
        const result = await this.manualProvider.initiate(orderId, Number(order.totalAmount));
        await firstValueFrom(this.httpService.patch(`${this.orderServiceUrl}/orders/internal/${orderId}/status`, { status: 'WAITING_PAYMENT' }, { headers: { 'x-internal-secret': this.internalSecret } }));
        return { payment, ...result };
    }
    async uploadProof(id, userId, filePath) {
        const payment = await this.prisma.payment.findUnique({ where: { id } });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        if (payment.userId !== userId) {
            throw new common_1.BadRequestException('Not your payment');
        }
        return this.prisma.payment.update({
            where: { id },
            data: {
                proofImageUrl: filePath,
                status: client_1.PaymentStatus.SUBMITTED,
            },
        });
    }
    async approve(id, adminId) {
        const payment = await this.prisma.payment.findUnique({ where: { id } });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        const updatedPayment = await this.prisma.payment.update({
            where: { id },
            data: {
                status: client_1.PaymentStatus.APPROVED,
                approvedBy: adminId,
                approvedAt: new Date(),
            },
        });
        await firstValueFrom(this.httpService.patch(`${this.orderServiceUrl}/orders/internal/${payment.orderId}/status`, { status: 'PAID' }, { headers: { 'x-internal-secret': this.internalSecret } }));
        return updatedPayment;
    }
    async reject(id) {
        const payment = await this.prisma.payment.findUnique({ where: { id } });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return this.prisma.payment.update({
            where: { id },
            data: { status: client_1.PaymentStatus.REJECTED },
        });
    }
    async findAll() {
        return this.prisma.payment.findMany();
    }
    async findOne(id) {
        return this.prisma.payment.findUnique({ where: { id } });
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        axios_1.HttpService,
        config_1.ConfigService,
        manual_transfer_provider_1.ManualTransferProvider])
], PaymentService);
//# sourceMappingURL=payment.service.js.map