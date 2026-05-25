import { Injectable } from '@nestjs/common';
import {
  PaymentInitiateResult,
  PaymentProvider,
} from './payment-provider.interface';

@Injectable()
export class ManualTransferProvider implements PaymentProvider {
  name = 'MANUAL_TRANSFER';

  async initiate(
    orderId: string,
    amount: number,
  ): Promise<PaymentInitiateResult> {
    return {
      instructions: `Transfer sejumlah Rp${amount} ke rekening BCA 1234567890 a/n Toko Kita`,
    };
  }

  async verify(paymentId: string): Promise<boolean> {
    // Manual = approve by admin, selalu return false di sini
    // Proses approve ada di controller
    return false;
  }
}
