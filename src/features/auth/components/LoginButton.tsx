import '../styles/_index.scss';
import { useAuth0LoginHandler } from '@shared/hooks';
import { useTranslation } from 'react-i18next';

export const LoginButton = () => {
  const { loginWithPopup } = useAuth0LoginHandler();
  const { t } = useTranslation('common');

  const handleClick = async () => {
    loginWithPopup();
  };

  return (
    <div role="button" onClick={handleClick} className="button login-button">
      {t('buttons.log_in')}
    </div>
  );
};
