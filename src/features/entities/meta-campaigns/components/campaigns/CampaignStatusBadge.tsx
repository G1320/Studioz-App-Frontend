import React from 'react';
import type { EffectiveStatus } from '../../types/meta.types';

interface CampaignStatusBadgeProps {
  status: EffectiveStatus | string;
}

const STATUS_CONFIG: Record<string, { className: string; label: string }> = {
  ACTIVE: { className: 'meta-badge--active', label: 'Active' },
  PAUSED: { className: 'meta-badge--paused', label: 'Paused' },
  ARCHIVED: { className: 'meta-badge--archived', label: 'Archived' },
  DELETED: { className: 'meta-badge--deleted', label: 'Deleted' },
  IN_PROCESS: { className: 'meta-badge--processing', label: 'Processing' },
  WITH_ISSUES: { className: 'meta-badge--error', label: 'Issues' },
  CAMPAIGN_PAUSED: { className: 'meta-badge--paused', label: 'Campaign Paused' },
  ADSET_PAUSED: { className: 'meta-badge--paused', label: 'Ad Set Paused' }
};

export const CampaignStatusBadge: React.FC<CampaignStatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status] || { className: 'meta-badge--default', label: status };
  return (
    <span className={`meta-badge ${config.className}`}>
      <span className="meta-badge__dot" />
      {config.label}
    </span>
  );
};
