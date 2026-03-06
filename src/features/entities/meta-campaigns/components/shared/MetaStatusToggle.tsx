import React from 'react';
import type { CampaignStatus } from '../../types/meta.types';

interface MetaStatusToggleProps {
  status: CampaignStatus | string;
  onToggle: (newStatus: string) => void;
  disabled?: boolean;
}

export const MetaStatusToggle: React.FC<MetaStatusToggleProps> = ({ status, onToggle, disabled }) => {
  const isActive = status === 'ACTIVE';
  return (
    <button
      className={`meta-status-toggle ${isActive ? 'meta-status-toggle--active' : 'meta-status-toggle--paused'}`}
      onClick={() => onToggle(isActive ? 'PAUSED' : 'ACTIVE')}
      disabled={disabled}
      title={isActive ? 'Pause' : 'Activate'}
    >
      <span className="meta-status-toggle__track">
        <span className="meta-status-toggle__thumb" />
      </span>
      <span className="meta-status-toggle__label">{isActive ? 'Active' : 'Paused'}</span>
    </button>
  );
};
