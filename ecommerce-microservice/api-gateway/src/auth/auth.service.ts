import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  private userServiceUrl: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.userServiceUrl = this.configService.get('USER_SERVICE_URL') || '';
  }

  async register(data: any) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.userServiceUrl}/auth/register`, data),
    );
    return response.data;
  }

  async login(data: any) {
    const response = await firstValueFrom(
      this.httpService.post(`${this.userServiceUrl}/auth/login`, data),
    );
    return response.data;
  }
}
