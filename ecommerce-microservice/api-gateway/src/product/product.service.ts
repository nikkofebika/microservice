import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ProductService {
  private productServiceUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.productServiceUrl = this.configService.get('PRODUCT_SERVICE_URL') || '';
  }

  async findAll(query: any) {
    const response = await lastValueFrom(
      this.httpService.get(`${this.productServiceUrl}/products`, {
        params: query,
      }),
    );
    return response.data;
  }

  async findOne(id: string) {
    const response = await lastValueFrom(
      this.httpService.get(`${this.productServiceUrl}/products/${id}`),
    );
    return response.data;
  }

  async create(data: any) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.productServiceUrl}/products`, data),
    );
    return response.data;
  }

  async update(id: string, data: any) {
    const response = await lastValueFrom(
      this.httpService.put(`${this.productServiceUrl}/products/${id}`, data),
    );
    return response.data;
  }

  async updateStock(id: string, data: any) {
    const response = await lastValueFrom(
      this.httpService.put(`${this.productServiceUrl}/stock/${id}`, data),
    );
    return response.data;
  }
}
