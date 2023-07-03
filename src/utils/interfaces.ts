export enum PaymentProvider {
  Stripe = "stripe",
  CheckoutDotCom = "checkout.com",
}

export interface IPaymentInformation {
  valid: boolean;
  message: string;
  paymentLinkExpiryDate: string;
  clientDetails: {
    name: string;
    returnUrlSuccess: string;
    returnUrlCancel: string;
    address: string;
    logo: string;
    bodyImage: string;
    website: string;
    termsAndConditions: string;
  };
  paymentDetails: {
    referenceNumber: string;
    transactionId: string;
    amount: number;
    currency: string;
    description: string;
    payer: {
      title: string;
      name: string;
      email: string;
    };
  };
  providerDetails: {
    provider: PaymentProvider;
    name: string;
    key: string;
  };
}
