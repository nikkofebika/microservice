import { StockService } from './stock.service';
import { UpdateStockDto } from './dto/update-stock.dto';
export declare class StockController {
    private stockService;
    constructor(stockService: StockService);
    updateStock(productId: string, dto: UpdateStockDto): Promise<{
        id: string;
        updatedAt: Date;
        productId: string;
        quantity: number;
    }>;
    reduceStock(body: {
        items: {
            productId: string;
            quantity: number;
        }[];
    }): Promise<{
        success: boolean;
    }>;
}
