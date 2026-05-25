import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { StockService } from './stock.service';
import { UpdateStockDto } from './dto/update-stock.dto';
import { InternalSecretGuard } from '../common/guards/internal-secret.guard';

@Controller('stock')
export class StockController {
  constructor(private stockService: StockService) {}

  @Put(':productId')
  updateStock(
    @Param('productId') productId: string,
    @Body() dto: UpdateStockDto,
  ) {
    return this.stockService.updateStock(productId, dto.quantity);
  }

  // Internal Endpoint
  @UseGuards(InternalSecretGuard)
  @Post('internal/reduce')
  reduceStock(@Body() body: { items: { productId: string; quantity: number }[] }) {
    return this.stockService.reduceStock(body.items);
  }
}
