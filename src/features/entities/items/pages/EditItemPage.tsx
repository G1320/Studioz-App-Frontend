import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ITEM_STEP_TO_SECTION } from '../manage/constants';

/**
 * Soft-migrate old /item/:id/edit URLs into the manage hub.
 */
const EditItemPage = () => {
  const { itemId } = useParams();
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const step = searchParams.get('step');
  const section = (step && ITEM_STEP_TO_SECTION[step]) || undefined;

  const target = section
    ? `/${lang}/item/${itemId}/manage?section=${section}`
    : `/${lang}/item/${itemId}/manage`;

  return <Navigate to={target} replace />;
};

export default EditItemPage;
