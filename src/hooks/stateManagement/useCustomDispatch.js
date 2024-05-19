import { useDispatch } from 'react-redux';

const useCustomDispatch = () => {
  const dispatch = useDispatch();

  const dispatchWithLogging = (action) => {
    console.log('Dispatching action:', action);
    dispatch(action);
  };

  return dispatchWithLogging;
};

export default useCustomDispatch;
