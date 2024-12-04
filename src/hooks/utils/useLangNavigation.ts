import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const useLanguageNavigate = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  return (path: string) => {
    const currentLang = i18n.language || 'en';
    navigate(`/${currentLang}${path}`);
  };
};
