import { httpService } from './http-service';

export interface StudioCouponValidationResult {
  valid: boolean;
  coupon: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
    description?: string;
  };
}

export interface StudioCoupon {
  _id: string;
  code: string;
  studioId: string;
  createdBy: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  usedCount: number;
  maxUsesPerCustomer: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableItems: string[];
  minBookingHours?: number;
  minPurchaseAmount?: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudioCouponStats {
  coupon: {
    code: string;
    usedCount: number;
    maxUses: number;
    isActive: boolean;
  };
  stats: {
    totalUsage: number;
    uniqueCustomers: number;
    totalDiscountGiven: number;
    remainingUses: number | 'unlimited';
  };
  recentUsage: Array<{
    customerId: {
      _id: string;
      name: string;
      email: string;
    };
    discountAmount: number;
    usedAt: string;
  }>;
}

export interface CreateStudioCouponData {
  code: string;
  studioId: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  validUntil: string;
  maxUses?: number;
  maxUsesPerCustomer?: number;
  validFrom?: string;
  applicableItems?: string[];
  minBookingHours?: number;
  minPurchaseAmount?: number;
  description?: string;
}

const ENDPOINT = '/studio-coupons';

/**
 * Validate a studio coupon for a booking
 */
export const validateStudioCoupon = async (
  code: string,
  studioId: string,
  itemId?: string,
  amount?: number,
  bookingHours?: number
): Promise<StudioCouponValidationResult> => {
  const response = await httpService.post<StudioCouponValidationResult>(`${ENDPOINT}/validate`, {
    code,
    studioId,
    itemId,
    amount,
    bookingHours
  });
  return response;
};

/**
 * Apply a studio coupon (mark as used)
 */
export const applyStudioCoupon = async (
  code: string,
  studioId: string,
  reservationId?: string,
  discountAmount?: number
): Promise<{ success: boolean }> => {
  const response = await httpService.post<{ success: boolean }>(`${ENDPOINT}/apply`, {
    code,
    studioId,
    reservationId,
    discountAmount
  });
  return response;
};

// Studio owner functions

/**
 * Create a new studio coupon
 */
export const createStudioCoupon = async (couponData: CreateStudioCouponData): Promise<StudioCoupon> => {
  const response = await httpService.post<StudioCoupon>(ENDPOINT, couponData);
  return response;
};

/**
 * Get all coupons for a studio
 */
export const getStudioCoupons = async (studioId: string): Promise<StudioCoupon[]> => {
  const response = await httpService.get<StudioCoupon[]>(`${ENDPOINT}/studio/${studioId}`);
  return response;
};

/**
 * Get a coupon by ID
 */
export const getStudioCouponById = async (id: string): Promise<StudioCoupon> => {
  const response = await httpService.get<StudioCoupon>(`${ENDPOINT}/${id}`);
  return response;
};

/**
 * Get coupon usage statistics
 */
export const getStudioCouponStats = async (id: string): Promise<StudioCouponStats> => {
  const response = await httpService.get<StudioCouponStats>(`${ENDPOINT}/${id}/stats`);
  return response;
};

/**
 * Update a studio coupon
 */
export const updateStudioCoupon = async (
  id: string,
  couponData: Partial<StudioCoupon>
): Promise<StudioCoupon> => {
  const response = await httpService.put<StudioCoupon>(`${ENDPOINT}/${id}`, couponData);
  return response;
};

/**
 * Delete a studio coupon
 */
export const deleteStudioCoupon = async (id: string): Promise<{ message: string }> => {
  const response = await httpService.delete<{ message: string }>(`${ENDPOINT}/${id}`);
  return response;
};

/**
 * Toggle coupon active status
 */
export const toggleStudioCouponStatus = async (id: string): Promise<StudioCoupon> => {
  const response = await httpService.patch<StudioCoupon>(`${ENDPOINT}/${id}/toggle`);
  return response;
};

export const studioCouponService = {
  validateStudioCoupon,
  applyStudioCoupon,
  createStudioCoupon,
  getStudioCoupons,
  getStudioCouponById,
  getStudioCouponStats,
  updateStudioCoupon,
  deleteStudioCoupon,
  toggleStudioCouponStatus
};

export default studioCouponService;
