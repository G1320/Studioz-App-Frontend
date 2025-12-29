import { useState } from 'react';
import { sendOTP, verifyOTP } from '@shared/services/otp-service';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface UsePhoneVerificationProps {
  onVerificationSuccess?: () => void;
  onVerificationFail?: (error: string) => void;
}

export const usePhoneVerification = ({ onVerificationSuccess, onVerificationFail }: UsePhoneVerificationProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const { t } = useTranslation('common');

  const sendVerificationCode = async (phoneNumber: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendOTP(phoneNumber);
      return response.success;
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to send verification code';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (phoneNumber: string, code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await verifyOTP(phoneNumber, code);

      setIsVerified(response.verified);
      if (response.verified) {
        onVerificationSuccess?.();
      }
      return response.verified;
    } catch (err: any) {
      toast.error(t('toasts.error.verificationFailed'));
      const errorMessage = err.response?.data?.error || 'Invalid verification code';
      setError(errorMessage);
      onVerificationFail?.(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendVerificationCode,
    verifyCode,
    isLoading,
    error,
    isVerified,
    clearError: () => setError(null)
  };
};
