import '../styles/_index.scss';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { scrollToTop } from '@shared/utility-components/ScrollToTop';
import { useAnchorNavigate } from '@shared/hooks';
import type { User } from 'src/types/index';

interface HeaderNavbarProps {
  user?: User | null;
}

export function HeaderNavbar({ user }: HeaderNavbarProps) {
  const { t, i18n } = useTranslation('common');
  const location = useLocation();
  const anchorNavigate = useAnchorNavigate();

  const currentPath = location.pathname;
  const currLang = i18n.language || 'en';
  const isStudioOwner = user?.role === 'vendor' || user?.role === 'admin' || Boolean(user?.studios?.length);

  const isCurrentPage = (path: string) => {
    return currentPath === path || currentPath.startsWith(`${path}/`);
  };

  return (
    <nav id="main-navigation" className="navbar" aria-label={t('navigation.mainNavigation', 'Main Navigation')}>
      {user ? (
        <>
          {isStudioOwner && (
            <Link
              to={`/${currLang}/dashboard`}
              className="navbar-link"
              aria-current={isCurrentPage(`/${currLang}/dashboard`) ? 'page' : undefined}
              onClick={() => scrollToTop()}
            >
              {t('navigation.dashboard')}
            </Link>
          )}
          <Link
            to={`/${currLang}/reservations`}
            className="navbar-link"
            aria-current={isCurrentPage(`/${currLang}/reservations`) ? 'page' : undefined}
            onClick={() => scrollToTop()}
          >
            {t('navigation.reservations')}
          </Link>
          <Link
            to={`/${currLang}/projects`}
            className="navbar-link"
            aria-current={isCurrentPage(`/${currLang}/projects`) ? 'page' : undefined}
            onClick={() => scrollToTop()}
          >
            {t('navigation.myProjects')}
          </Link>
          {!isStudioOwner && (
            <Link
              to={`/${currLang}/wishlists`}
              className="navbar-link"
              aria-current={isCurrentPage(`/${currLang}/wishlists`) ? 'page' : undefined}
              onClick={() => scrollToTop()}
            >
              {t('navigation.wishlists')}
            </Link>
          )}
        </>
      ) : (
        <>
          <Link
            to={`/${currLang}/security`}
            className="navbar-link"
            aria-current={isCurrentPage(`/${currLang}/security`) ? 'page' : undefined}
            onClick={() => scrollToTop()}
          >
            {t('navigation.security')}
          </Link>
          <button type="button" className="navbar-link" onClick={() => anchorNavigate('', 'pricing')}>
            {t('navigation.pricing')}
          </button>
          <Link
            to={`/${currLang}/about`}
            className="navbar-link"
            aria-current={isCurrentPage(`/${currLang}/about`) ? 'page' : undefined}
            onClick={() => scrollToTop()}
          >
            {t('navigation.about')}
          </Link>
          <Link
            to={`/${currLang}/owner-faq`}
            className="navbar-link"
            aria-current={isCurrentPage(`/${currLang}/owner-faq`) ? 'page' : undefined}
            onClick={() => scrollToTop()}
          >
            {t('navigation.studioFaq')}
          </Link>
          <Link
            to={`/${currLang}/changelog`}
            className="navbar-link"
            aria-current={isCurrentPage(`/${currLang}/changelog`) ? 'page' : undefined}
            onClick={() => scrollToTop()}
          >
            {t('navigation.changelog')}
          </Link>
        </>
      )}
    </nav>
  );
}
