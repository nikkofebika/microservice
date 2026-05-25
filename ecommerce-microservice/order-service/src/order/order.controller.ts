import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { InternalSecretGuard } from '../common/guards/internal-secret.guard';
import { OrderStatus } from '@prisma/client';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  create(
    @Headers('x-user-id') userId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.orderService.create(userId, dto);
  }

  @Get()
  findAll(
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') role: string,
  ) {
    return this.orderService.findAll(userId, role);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @Headers('x-user-role') role: string,
  ) {
    return this.orderService.findOne(id, userId, role);
  }

  @Patch(':id/cancel')
  cancel(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.orderService.cancel(id, userId);
  }

  // Internal Endpoint
  @UseGuards(InternalSecretGuard)
  @Patch('internal/:id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: OrderStatus },
  ) {
    return this.orderService.updateStatus(id, body.status);
  }
}
