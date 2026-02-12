import { Toaster } from 'sonner';
import './styles/_index.scss';

const StudiOzToaster = () => (
  <Toaster
    position="bottom-center"
    expand={false}
    richColors
    closeButton
    duration={5000}
    toastOptions={{
      className: 'studioz-toast'
    }}
  />
);

export default StudiOzToaster;
