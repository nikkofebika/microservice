import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

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
  @SetMetadata('roles', ['ADMIN'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  create(@Body() data: any) {
    return this.productService.create(data);
  }

  @Put(':id')
  @SetMetadata('roles', ['ADMIN'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  update(@Param('id') id: string, @Body() data: any) {
    return this.productService.update(id, data);
  }

  @Put(':id/stock')
  @SetMetadata('roles', ['ADMIN'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  updateStock(@Param('id') id: string, @Body() data: any) {
    return this.productService.updateStock(id, data);
  }
}
