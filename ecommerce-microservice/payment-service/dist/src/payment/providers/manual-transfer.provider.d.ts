import { PaymentInitiateResult, PaymentProvider } from './payment-provider.interface';
export declare class ManualTransferProvider implements PaymentProvider {
    name: string;
    initiate(orderId: string, amount: number): Promise<PaymentInitiateResult>;
    verify(paymentId: string): Promise<boolean>;
}
