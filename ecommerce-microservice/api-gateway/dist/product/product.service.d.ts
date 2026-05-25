import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class ProductService {
    private httpService;
    private configService;
    private productServiceUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    findAll(query: any): Promise<any>;
    findOne(id: string): Promise<any>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    updateStock(id: string, data: any): Promise<any>;
}
