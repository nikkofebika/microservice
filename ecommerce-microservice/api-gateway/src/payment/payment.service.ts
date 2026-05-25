import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import FormData from 'form-data';

@Injectable()
export class PaymentService {
  private paymentServiceUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.paymentServiceUrl = this.configService.get('PAYMENT_SERVICE_URL') || '';
  }

  async initiate(orderId: string, user: any) {
    const response = await lastValueFrom(
      this.httpService.post(
        `${this.paymentServiceUrl}/payments/orders/${orderId}`,
        {},
        {
          headers: {
            'x-user-id': user.sub,
          },
        },
      ),
    );
    return response.data;
  }

  async uploadProof(id: string, user: any, file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('proof', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });

    const response = await lastValueFrom(
      this.httpService.post(`${this.paymentServiceUrl}/payments/${id}/proof`, formData, {
        headers: {
          ...formData.getHeaders(),
          'x-user-id': user.sub,
        },
      }),
    );
    return response.data;
  }

  async findOne(id: string) {
    const response = await lastValueFrom(
      this.httpService.get(`${this.paymentServiceUrl}/payments/${id}`),
    );
    return response.data;
  }

  async findAll() {
    const response = await lastValueFrom(
      this.httpService.get(`${this.paymentServiceUrl}/payments`),
    );
    return response.data;
  }

  async approve(id: string, user: any) {
    const response = await lastValueFrom(
      this.httpService.post(
        `${this.paymentServiceUrl}/payments/${id}/approve`,
        {},
        {
          headers: {
            'x-user-id': user.sub,
          },
        },
      ),
    );
    return response.data;
  }

  async reject(id: string) {
    const response = await lastValueFrom(
      this.httpService.post(`${this.paymentServiceUrl}/payments/${id}/reject`, {}),
    );
    return response.data;
  }
}
