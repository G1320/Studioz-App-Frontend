import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PortfolioStep } from '@shared/components';
import { StudioPortfolioFiles } from '@features/entities/studios/components/StudioPortfolioFiles';
import { Studio } from 'src/types/index';
import { PortfolioItem, SocialLinks } from 'src/types/studio';
import { useStudioSectionSave } from '../useStudioSectionSave';
import { SectionChrome } from './SectionChrome';

interface PortfolioSectionProps {
  studio: Studio;
}

export const PortfolioSection = ({ studio }: PortfolioSectionProps) => {
  const { t } = useTranslation('forms');
  const { savePatch, isSaving } = useStudioSectionSave(studio, studio._id);

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(studio.portfolio || []);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(studio.socialLinks || {});

  useEffect(() => {
    setPortfolio(studio.portfolio || []);
    setSocialLinks(studio.socialLinks || {});
  }, [studio._id, studio.portfolio, studio.socialLinks]);

  const isDirty =
    JSON.stringify(portfolio) !== JSON.stringify(studio.portfolio || []) ||
    JSON.stringify(socialLinks) !== JSON.stringify(studio.socialLinks || {});

  const handleDiscard = () => {
    setPortfolio(studio.portfolio || []);
    setSocialLinks(studio.socialLinks || {});
  };

  const handleSave = () => {
    savePatch({
      portfolio,
      socialLinks
    });
  };

  return (
    <SectionChrome
      title={t('manage.sections.portfolio', 'Portfolio')}
      subtitle={t('manage.portfolio.subtitle', 'Work samples and social profiles.')}
      isDirty={isDirty}
      isSaving={isSaving}
      onDiscard={handleDiscard}
      onSave={handleSave}
    >
      <div className="studio-manage-panel">
        <div className="studio-manage-panel__body studio-manage-panel__body--embed">
          {studio._id && <StudioPortfolioFiles studioId={studio._id} canManage />}
          <PortfolioStep
            portfolio={portfolio}
            onPortfolioChange={setPortfolio}
            socialLinks={socialLinks}
            onSocialLinksChange={setSocialLinks}
          />
        </div>
      </div>
    </SectionChrome>
  );
};
