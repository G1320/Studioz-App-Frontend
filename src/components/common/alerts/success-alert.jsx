import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import useCustomDispatch from '../../../hooks/stateManagement/useCustomDispatch';
import Swal from 'sweetalert2';
import { clearSuccess } from '../../../slices/successSlice';

const SuccessAlert = () => {
  const dispatch = useCustomDispatch();
  const success = useSelector((state) => state.success.success);

  useEffect(() => {
    if (success) {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: success,
        customClass: {
          container: 'success-alert-container',
          title: 'success-alert-title',
          content: 'success-alert-content',
        },
      });
      dispatch(clearSuccess());
    }
  }, [success, dispatch]);

  return null;
};

export default SuccessAlert;
