import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  private userServiceUrl: string;
  private internalSecret: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.userServiceUrl = this.configService.get('USER_SERVICE_URL') || '';
    this.internalSecret = this.configService.get('INTERNAL_SECRET') || '';
  }

  async getMe(user: any) {
    const response = await lastValueFrom(
      this.httpService.get(`${this.userServiceUrl}/users/me`, {
        headers: {
          'x-user-id': user.sub,
          'x-user-role': user.role,
          'x-user-email': user.email,
          'x-internal-secret': this.internalSecret,
        },
      }),
    );
    return response.data;
  }
}
