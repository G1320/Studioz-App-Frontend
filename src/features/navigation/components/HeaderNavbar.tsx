import '../styles/_index.scss';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import { useAuth0LoginHandler } from '@shared/hooks';
import type { MouseEvent } from 'react';
import type { User } from 'src/types/index';

interface HeaderNavbarProps {
  user?: User | null;
}

export function HeaderNavbar({ user }: HeaderNavbarProps) {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const { loginWithPopup } = useAuth0LoginHandler();

  const currentPath = location.pathname;
  const currLang = i18n.language || 'en';

  const isCurrentPage = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  const handleDashboardClick = (e: MouseEvent) => {
    if (user) {
      scrollToTop();
      return;
    }
    e.preventDefault();
    void loginWithPopup();
  };

  return (
    <nav id="main-navigation" className="navbar" aria-label={t('navigation.mainNavigation', 'Main Navigation')}>
      {user ? (
        <Link
          to={`/${currLang}/dashboard`}
          className="navbar-link"
          aria-label={t('navigation.dashboard')}
          aria-current={isCurrentPage(`/${currLang}/dashboard`) ? 'page' : undefined}
          onClick={handleDashboardClick}
        >
          {t('navigation.dashboard')}
        </Link>
      ) : (
        <button
          type="button"
          className="navbar-link"
          aria-label={t('navigation.dashboard')}
          onClick={handleDashboardClick}
        >
          {t('navigation.dashboard')}
        </button>
      )}
      <Link
        to={`/${currLang}/reservations`}
        className="navbar-link"
        aria-label={t('navigation.reservations')}
        aria-current={isCurrentPage(`/${currLang}/reservations`) ? 'page' : undefined}
        onClick={() => scrollToTop()}
      >
        {t('navigation.reservations')}
      </Link>
      <Link
        to={`/${currLang}/projects`}
        className="navbar-link"
        aria-label={t('navigation.myProjects')}
        aria-current={isCurrentPage(`/${currLang}/projects`) ? 'page' : undefined}
        onClick={() => scrollToTop()}
      >
        {t('navigation.myProjects')}
      </Link>
    </nav>
  );
}
