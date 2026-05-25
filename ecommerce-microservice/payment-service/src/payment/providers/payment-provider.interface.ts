// payment-service/src/payment/providers/payment-provider.interface.ts
export interface PaymentProvider {
  name: string;
  initiate(orderId: string, amount: number): Promise<PaymentInitiateResult>;
  verify(paymentId: string): Promise<boolean>;
}

export interface PaymentInitiateResult {
  externalId?: string; // ID dari payment gateway (Midtrans, Xendit, dll)
  redirectUrl?: string; // URL redirect ke halaman payment gateway
  instructions?: string; // Instruksi manual (untuk transfer)
  metadata?: Record<string, any>;
}
