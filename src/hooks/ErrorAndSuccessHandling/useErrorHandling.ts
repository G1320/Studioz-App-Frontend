import { toast } from 'sonner';

interface ErrorResponse {
  response?: {
    data?: string;
  };
}

export const useErrorHandling = () => {
  const handleError = (error: ErrorResponse | unknown) => { 
    console.error('Error:', error);
    
    if ((error as ErrorResponse)?.response?.data) {
      toast.error((error as ErrorResponse).response?.data);
    } else {
      toast.error('An error occurred');
    }
  };

  return handleError;
};
