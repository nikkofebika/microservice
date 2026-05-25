import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';
import { InternalSecretGuard } from '../common/guards/internal-secret.guard';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  findAll(@Query() query: any) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  // Internal Endpoints
  @UseGuards(InternalSecretGuard)
  @Get('internal/:id')
  findOneInternal(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @UseGuards(InternalSecretGuard)
  @Post('internal/validate-stock')
  validateStock(@Body() body: { items: { productId: string; quantity: number }[] }) {
    return this.productService.validateStock(body.items);
  }
}
