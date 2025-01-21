export interface SumitPaymentMethod {
  ID: string;
  CustomerID: string | null;
  CreditCard_Number: string | null;
  CreditCard_LastDigits: string;
  CreditCard_ExpirationMonth: number;
  CreditCard_ExpirationYear: number;
  CreditCard_CVV: string | null;
  CreditCard_Track2: string | null;
  CreditCard_CitizenID: string;
  CreditCard_CardMask: string;
  CreditCard_Token: string;
  DirectDebit_Bank: string | null;
  DirectDebit_Branch: string | null;
  DirectDebit_Account: string | null;
  DirectDebit_ExpirationDate: string | null;
  DirectDebit_MaximumAmount: string | null;
  Type: number;
}

export interface SumitPayment {
  ID: string;
  CustomerID: string;
  Date: string;
  ValidPayment: boolean;
  Status: string;
  StatusDescription: string;
  Amount: number;
  Currency: number;
  PaymentMethod: SumitPaymentMethod;
  AuthNumber: string;
  FirstPaymentAmount: number | null;
  NonFirstPaymentAmount: number | null;
  RecurringCustomerItemIDs: string[];
}

export interface SumitPaymentDetails {
  Payment: SumitPayment;
  DocumentID: string;
  CustomerID: string;
  DocumentDownloadURL: string;
  RecurringCustomerItemIDs: string[];
}

export interface Subscription {
  _id: string;
  userId: string;
  planId: string;
  planName: string;
  customerName: string;
  customerEmail: string;
  sumitPaymentId: string;
  sumitCustomerId: string;
  sumitRecurringItemIds: string[];
  sumitPaymentDetails: SumitPaymentDetails;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'SUSPENDED' | 'PAYMENT_FAILED';
  startDate?: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  paypalDetails?: any;
}

export interface SubscriptionDocument extends Document, Omit<Subscription, '_id'> {}
