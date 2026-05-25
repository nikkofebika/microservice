import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('orders/:orderId')
  @UseGuards(JwtAuthGuard)
  initiate(@Param('orderId') orderId: string, @Req() req: any) {
    return this.paymentService.initiate(orderId, req.user);
  }

  @Post(':id/proof')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('proof'))
  uploadProof(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.paymentService.uploadProof(id, req.user, file);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Get()
  @SetMetadata('roles', ['ADMIN'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  findAll() {
    return this.paymentService.findAll();
  }

  @Post(':id/approve')
  @SetMetadata('roles', ['ADMIN'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  approve(@Param('id') id: string, @Req() req: any) {
    return this.paymentService.approve(id, req.user);
  }

  @Post(':id/reject')
  @SetMetadata('roles', ['ADMIN'])
  @UseGuards(JwtAuthGuard, RolesGuard)
  reject(@Param('id') id: string) {
    return this.paymentService.reject(id);
  }
}
