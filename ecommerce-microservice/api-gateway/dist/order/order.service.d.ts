import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class OrderService {
    private httpService;
    private configService;
    private orderServiceUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    create(user: any, data: any): Promise<any>;
    findAll(user: any): Promise<any>;
    findOne(id: string, user: any): Promise<any>;
    cancel(id: string, user: any): Promise<any>;
}
