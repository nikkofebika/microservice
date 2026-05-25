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
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let ProductService = class ProductService {
    httpService;
    configService;
    productServiceUrl;
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.productServiceUrl = this.configService.get('PRODUCT_SERVICE_URL') || '';
    }
    async findAll(query) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${this.productServiceUrl}/products`, {
            params: query,
        }));
        return response.data;
    }
    async findOne(id) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.get(`${this.productServiceUrl}/products/${id}`));
        return response.data;
    }
    async create(data) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.post(`${this.productServiceUrl}/products`, data));
        return response.data;
    }
    async update(id, data) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.put(`${this.productServiceUrl}/products/${id}`, data));
        return response.data;
    }
    async updateStock(id, data) {
        const response = await (0, rxjs_1.lastValueFrom)(this.httpService.put(`${this.productServiceUrl}/stock/${id}`, data));
        return response.data;
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], ProductService);
//# sourceMappingURL=product.service.js.map