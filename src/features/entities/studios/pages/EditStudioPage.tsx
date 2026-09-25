import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/** Map legacy stepped-form step ids → manage hub sections. */
const STEP_TO_SECTION: Record<string, string> = {
  'basic-info': 'overview',
  'amenities-gear': 'amenities',
  availability: 'hours',
  location: 'location',
  files: 'media',
  portfolio: 'portfolio',
  policies: 'policies'
};

/**
 * Soft-migrate old /studio/:id/edit URLs into the manage hub.
 * Create flow remains on stepped forms; edit is fully hub-based.
 */
const EditStudioPage = () => {
  const { studioId } = useParams();
  const [searchParams] = useSearchParams();
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';
  const step = searchParams.get('step');
  const section = (step && STEP_TO_SECTION[step]) || undefined;

  const target = section
    ? `/${lang}/studio/${studioId}/manage?section=${section}`
    : `/${lang}/studio/${studioId}/manage`;

  return <Navigate to={target} replace />;
};

export default EditStudioPage;
