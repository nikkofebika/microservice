import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
export declare class PaymentService {
    private httpService;
    private configService;
    private paymentServiceUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    initiate(orderId: string, user: any): Promise<any>;
    uploadProof(id: string, user: any, file: Express.Multer.File): Promise<any>;
    findOne(id: string): Promise<any>;
    findAll(): Promise<any>;
    approve(id: string, user: any): Promise<any>;
    reject(id: string): Promise<any>;
}
