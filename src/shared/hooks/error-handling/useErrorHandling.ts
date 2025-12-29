import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

interface ErrorResponse {
  response?: {
    data?: string;
  };
}

export const useErrorHandling = () => {
  const { t } = useTranslation('common');

  const handleError = (error: ErrorResponse | unknown) => {
    console.error('Error:', error);

    if ((error as ErrorResponse)?.response?.data) {
      toast.error((error as ErrorResponse).response?.data);
    } else {
      toast.error(t('toasts.error.genericError'));
    }
  };

  return handleError;
};
