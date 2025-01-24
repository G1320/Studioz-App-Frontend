// services/otpService.ts
import { httpService } from '@shared/services';

const otpEndpoint = '/otp';

interface VerificationResponse {
  success: boolean;
  verified: boolean;
  message: string;
}

export const sendOTP = async (phoneNumber: string): Promise<{ success: boolean; message: string }> => {
  try {
    return await httpService.post(`${otpEndpoint}/send`, { phoneNumber });
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const verifyOTP = async (phoneNumber: string, code: string): Promise<VerificationResponse> => {
  try {
    return await httpService.post(`${otpEndpoint}/verify`, { phoneNumber, code });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};
