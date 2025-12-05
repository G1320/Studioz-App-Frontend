import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { Studio } from 'src/types/index';
import { StudioCard } from '@features/entities/studios';

interface MyStudiosProps {
  studios: Studio[];
}

export const MyStudios: React.FC<MyStudiosProps> = ({ studios }) => {
  const { t } = useTranslation('dashboard');
  const langNavigate = useLanguageNavigate();

  if (studios.length === 0) {
    return (
      <div className="dashboard-my-studios">
        <h2 className="dashboard-section-title">{t('myStudios.title')}</h2>
        <div className="empty-state">
          <p>{t('myStudios.empty')}</p>
          <button
            className="primary-button"
            onClick={() => langNavigate('/create-studio')}
          >
            {t('myStudios.createStudio')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-my-studios">
      <div className="section-header">
        <h2 className="dashboard-section-title">{t('myStudios.title')}</h2>
        <button
          className="secondary-button"
          onClick={() => langNavigate('/create-studio')}
        >
          {t('myStudios.addStudio')}
        </button>
      </div>
      <div className="studios-grid">
        {studios.map((studio) => (
          <StudioCard key={studio._id} studio={studio} navActive={true} />
        ))}
      </div>
    </div>
  );
};

