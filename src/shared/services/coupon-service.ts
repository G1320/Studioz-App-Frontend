import {httpService} from './http-service';

export interface CouponValidationResult {
  valid: boolean;
  coupon: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
  };
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxUses: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicablePlans: string[];
  minPurchaseAmount?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Validate a coupon code
 */
export const validateCoupon = async (
  code: string,
  planId?: string,
  amount?: number
): Promise<CouponValidationResult> => {
  const response = await httpService.post<CouponValidationResult>('/coupons/validate', {
    code,
    planId,
    amount
  });
  return response;
};

/**
 * Apply a coupon (mark as used)
 */
export const applyCoupon = async (code: string): Promise<{ success: boolean }> => {
  const response = await httpService.post<{ success: boolean }>('/coupons/apply', { code });
  return response;
};

// Admin functions

/**
 * Create a new coupon (admin only)
 */
export const createCoupon = async (couponData: Partial<Coupon>): Promise<Coupon> => {
  const response = await httpService.post<Coupon>('/coupons', couponData);
  return response;
};

/**
 * Get all coupons (admin only)
 */
export const getAllCoupons = async (): Promise<Coupon[]> => {
  const response = await httpService.get<Coupon[]>('/coupons');
  return response;
};

/**
 * Get a coupon by ID (admin only)
 */
export const getCouponById = async (id: string): Promise<Coupon> => {
  const response = await httpService.get<Coupon>(`/coupons/${id}`);
  return response;
};

/**
 * Update a coupon (admin only)
 */
export const updateCoupon = async (id: string, couponData: Partial<Coupon>): Promise<Coupon> => {
  const response = await httpService.put<Coupon>(`/coupons/${id}`, couponData);
  return response;
};

/**
 * Delete a coupon (admin only)
 */
export const deleteCoupon = async (id: string): Promise<{ message: string }> => {
  const response = await httpService.delete<{ message: string }>(`/coupons/${id}`);
  return response;
};

/**
 * Toggle coupon active status (admin only)
 */
export const toggleCouponStatus = async (id: string): Promise<Coupon> => {
  const response = await httpService.patch<Coupon>(`/coupons/${id}/toggle`);
  return response;
};

export const couponService = {
  validateCoupon,
  applyCoupon,
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus
};

export default couponService;
