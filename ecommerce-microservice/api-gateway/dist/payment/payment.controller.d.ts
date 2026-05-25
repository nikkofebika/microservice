import { PaymentService } from './payment.service';
export declare class PaymentController {
    private paymentService;
    constructor(paymentService: PaymentService);
    initiate(orderId: string, req: any): Promise<any>;
    uploadProof(id: string, req: any, file: Express.Multer.File): Promise<any>;
    findOne(id: string): Promise<any>;
    findAll(): Promise<any>;
    approve(id: string, req: any): Promise<any>;
    reject(id: string): Promise<any>;
}
