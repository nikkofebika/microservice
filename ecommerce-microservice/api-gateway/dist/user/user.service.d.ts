import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class UserService {
    private httpService;
    private configService;
    private userServiceUrl;
    private internalSecret;
    constructor(httpService: HttpService, configService: ConfigService);
    getMe(user: any): Promise<any>;
}
