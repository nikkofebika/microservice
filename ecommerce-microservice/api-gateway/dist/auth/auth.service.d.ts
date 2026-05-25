import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private httpService;
    private configService;
    private userServiceUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    register(data: any): Promise<any>;
    login(data: any): Promise<any>;
}
