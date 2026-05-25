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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let StockService = class StockService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async updateStock(productId, quantity) {
        const stock = await this.prisma.stock.findUnique({
            where: { productId },
        });
        if (!stock) {
            throw new common_1.NotFoundException('Stock not found');
        }
        return this.prisma.stock.update({
            where: { productId },
            data: { quantity },
        });
    }
    async reduceStock(items) {
        return this.prisma.$transaction(async (tx) => {
            for (const item of items) {
                const stock = await tx.stock.findUnique({
                    where: { productId: item.productId },
                });
                if (!stock || stock.quantity < item.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for product ${item.productId}`);
                }
                await tx.stock.update({
                    where: { productId: item.productId },
                    data: { quantity: { decrement: item.quantity } },
                });
            }
            return { success: true };
        });
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StockService);
//# sourceMappingURL=stock.service.js.map