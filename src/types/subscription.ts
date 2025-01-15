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
