import { useTranslation } from 'react-i18next';
import { useNavigate, NavigateOptions } from 'react-router-dom';

export const useLanguageNavigate = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  return (path: string, options?: NavigateOptions) => {
    const currentLang = i18n.language || 'en';
    navigate(`/${currentLang}${path}`, options);
  };
};
