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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const form_data_1 = __importDefault(require("form-data"));
let PaymentService = class PaymentService {
    httpService;
    configService;
    paymentServiceUrl;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.paymentServiceUrl = this.configService.get('PAYMENT_SERVICE_URL') || '';
    }
    async initiate(orderId, user) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${this.paymentServiceUrl}/payments/orders/${orderId}`, {}, {
            headers: {
                'x-user-id': user.sub,
            },
        }));
        return response.data;
    }
    async uploadProof(id, user, file) {
        const formData = new form_data_1.default();
        formData.append('proof', file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${this.paymentServiceUrl}/payments/${id}/proof`, formData, {
            headers: {
                ...formData.getHeaders(),
                'x-user-id': user.sub,
            },
        }));
        return response.data;
    }
    async findOne(id) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${this.paymentServiceUrl}/payments/${id}`));
        return response.data;
    }
    async findAll() {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${this.paymentServiceUrl}/payments`));
        return response.data;
    }
    async approve(id, user) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${this.paymentServiceUrl}/payments/${id}/approve`, {}, {
            headers: {
                'x-user-id': user.sub,
            },
        }));
        return response.data;
    }
    async reject(id) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${this.paymentServiceUrl}/payments/${id}/reject`, {}));
        return response.data;
    }
};
exports.PaymentService = PaymentService;
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map