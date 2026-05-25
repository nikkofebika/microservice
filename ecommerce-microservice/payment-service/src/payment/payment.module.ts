import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios';
import { ManualTransferProvider } from './providers/manual-transfer.provider';

@Module({
  imports: [HttpModule],
  controllers: [PaymentController],
  providers: [PaymentService, ManualTransferProvider],
})
export class PaymentModule {}
