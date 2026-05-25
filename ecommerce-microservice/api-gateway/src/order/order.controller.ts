import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Req() req: any, @Body() data: any) {
    return this.orderService.create(req.user, data);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Req() req: any) {
    return this.orderService.findAll(req.user);
  }

  @Get('all')
  @SetMetadata('roles', ['ADMIN'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAllAdmin(@Req() req: any) {
    return this.orderService.findAll(req.user);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.orderService.findOne(id, req.user);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.orderService.cancel(id, req.user);
  }
}
