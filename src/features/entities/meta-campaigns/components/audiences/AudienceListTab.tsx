import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAudiences } from '../../hooks/useAudiences';
import { useDeleteAudience } from '../../hooks/useCampaignMutations';
import { AudienceCard } from './AudienceCard';
import { CreateAudienceModal } from './CreateAudienceModal';
import type { MetaAudience } from '../../types/meta.types';

export const AudienceListTab: React.FC = () => {
  const { t } = useTranslation('metaCampaigns');
  const { data: audiences = [], isLoading } = useAudiences();
  const deleteAudience = useDeleteAudience();
  const [showCreate, setShowCreate] = useState(false);

  const handleDelete = (id: string) => {
    if (window.confirm(t('audiences.confirmDelete', 'Delete this audience?'))) {
      deleteAudience.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="meta-tab__loader">{t('loading', 'Loading...')}</div>;
  }

  return (
    <div className="meta-audience-list">
      <div className="meta-audience-list__header">
        <h2 className="meta-audience-list__title">
          {t('audiences.title', 'Audiences')} ({audiences.length})
        </h2>
        <button className="meta-btn meta-btn--primary" onClick={() => setShowCreate(true)}>
          + {t('audiences.create', 'Create Audience')}
        </button>
      </div>

      {audiences.length === 0 ? (
        <div className="meta-empty-state">
          <p>{t('audiences.empty', 'No audiences created yet')}</p>
          <button className="meta-btn meta-btn--secondary" onClick={() => setShowCreate(true)}>
            {t('audiences.createFirst', 'Create your first audience')}
          </button>
        </div>
      ) : (
        <div className="meta-audience-list__grid">
          {audiences.map((audience: MetaAudience) => (
            <AudienceCard key={audience.id} audience={audience} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showCreate && <CreateAudienceModal onClose={() => setShowCreate(false)} />}
    </div>
  );
};
