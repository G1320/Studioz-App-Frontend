import { toast } from 'sonner';

const useErrorHandling = () => {
  const handleError = (error) => {
    console.error('Error:', error);
    toast.error(error?.response?.data || 'An error occurred');
  };

  return handleError;
};

export default useErrorHandling;
