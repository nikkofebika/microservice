import { OrderService } from './order.service';
export declare class OrderController {
    private orderService;
    constructor(orderService: OrderService);
    create(req: any, data: any): Promise<any>;
    findAll(req: any): Promise<any>;
    findAllAdmin(req: any): Promise<any>;
    findOne(id: string, req: any): Promise<any>;
    cancel(id: string, req: any): Promise<any>;
}
