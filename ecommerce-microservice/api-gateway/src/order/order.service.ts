import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderService {
  private orderServiceUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.orderServiceUrl = this.configService.get('ORDER_SERVICE_URL') || '';
  }

  async create(user: any, data: any) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.orderServiceUrl}/orders`, data, {
        headers: {
          'x-user-id': user.sub,
          'x-user-role': user.role,
        },
      }),
    );
    return response.data;
  }

  async findAll(user: any) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.orderServiceUrl}/orders`, {
        headers: {
          'x-user-id': user.sub,
          'x-user-role': user.role,
        },
      }),
    );
    return response.data;
  }

  async findOne(id: string, user: any) {
    const response = await firstValueFrom(
      this.httpService.get(`${this.orderServiceUrl}/orders/${id}`, {
        headers: {
          'x-user-id': user.sub,
          'x-user-role': user.role,
        },
      }),
    );
    return response.data;
  }

  async cancel(id: string, user: any) {
    const response = await firstValueFrom(
      this.httpService.patch(
        `${this.orderServiceUrl}/orders/${id}/cancel`,
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
}
