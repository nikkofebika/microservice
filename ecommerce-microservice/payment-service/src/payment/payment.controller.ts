import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('orders/:orderId')
  initiate(
    @Param('orderId') orderId: string,
    @Headers('x-user-id') userId: string,
  ) {
    return this.paymentService.initiate(orderId, userId);
  }

  @Post(':id/proof')
  @UseInterceptors(
    FileInterceptor('proof', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadProof(
    @Param('id') id: string,
    @Headers('x-user-id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.paymentService.uploadProof(id, userId, file.path);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  @Post(':id/approve')
  approve(
    @Param('id') id: string,
    @Headers('x-user-id') adminId: string,
  ) {
    return this.paymentService.approve(id, adminId);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.paymentService.reject(id);
  }
}
