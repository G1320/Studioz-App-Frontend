import { useDispatch } from 'react-redux';
import { AnyAction } from 'redux';

const useCustomDispatch = () => {
  const dispatch = useDispatch();

  const dispatchWithLogging = (action:AnyAction) => {
    console.log('Dispatching action:', action);
    dispatch(action);
  };

  return dispatchWithLogging;
};

export default useCustomDispatch;
