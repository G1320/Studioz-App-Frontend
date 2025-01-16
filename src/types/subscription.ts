// src/types/subscription.ts
export interface Subscription {
  _id: string;
  userId: string;
  planId: string;
  paypalSubscriptionId: string;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED' | 'EXPIRED';
  startDate?: Date;
  endDate?: Date;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  period: 'month' | 'year';
  features: string[];
  highlight?: string;
  paypalPlanId: string;
}

export interface PayPalSubscriptionResponse {
  id: string;
  status: 'APPROVAL_PENDING' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED' | 'EXPIRED';
  status_update_time: string;
  plan_id: string;
  start_time: string;
  quantity: string;
  billing_info: {
    outstanding_balance: {
      currency_code: string;
      value: string;
    };
    cycle_executions: Array<{
      tenure_type: string;
      sequence: number;
      cycles_completed: number;
      cycles_remaining: number;
      current_pricing_scheme_version: number;
    }>;
    next_billing_time: string;
    final_payment_time: string;
    failed_payments_count: number;
  };
}

export interface SubscriptionDetailsResponse {
  subscription: Subscription;
  paypalDetails: PayPalSubscriptionResponse;
}

export interface CancelSubscriptionResponse {
  _id: string;
  status: string;
  endDate: Date;
  [key: string]: any;
}
