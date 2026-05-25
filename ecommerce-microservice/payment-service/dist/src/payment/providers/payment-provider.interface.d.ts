export interface PaymentProvider {
    name: string;
    initiate(orderId: string, amount: number): Promise<PaymentInitiateResult>;
    verify(paymentId: string): Promise<boolean>;
}
export interface PaymentInitiateResult {
    externalId?: string;
    redirectUrl?: string;
    instructions?: string;
    metadata?: Record<string, any>;
}
