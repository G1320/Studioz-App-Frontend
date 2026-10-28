import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/components';
import { useAuth0LoginHandler } from '@shared/hooks/auth/useAuth0LoginHandler';
import './styles/_project-access-denied.scss';

/** Shown instead of a project page when nobody is signed in. */
export const ProjectSignInRequired: React.FC = () => {
  const { t, i18n } = useTranslation('remoteProjects');
  const navigate = useNavigate();
  const { loginWithPopup } = useAuth0LoginHandler();

  return (
    <div className="project-access-denied">
      <div className="project-access-denied__card">
        <Lock className="project-access-denied__icon" aria-hidden />
        <h1 className="project-access-denied__title">{t('signInRequired.title')}</h1>
        <p className="project-access-denied__body">{t('signInRequired.body')}</p>
        <Button className="button--primary" onClick={() => void loginWithPopup().catch(() => undefined)}>
          {t('signInRequired.signIn')}
        </Button>
        <Button onClick={() => navigate(`/${i18n.language}/projects`)} className="button--secondary">
          {t('accessRequests.backToProjects')}
        </Button>
      </div>
    </div>
  );
};
