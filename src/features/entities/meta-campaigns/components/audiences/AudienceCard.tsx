import React from 'react';
import { formatCompact, formatDate } from '../../utils/formatMetrics';
import type { MetaAudience } from '../../types/meta.types';

interface AudienceCardProps {
  audience: MetaAudience;
  onDelete: (id: string) => void;
}

export const AudienceCard: React.FC<AudienceCardProps> = ({ audience, onDelete }) => {
  return (
    <div className="meta-audience-card">
      <div className="meta-audience-card__header">
        <h4 className="meta-audience-card__name">{audience.name}</h4>
        <span className={`meta-badge meta-badge--${audience.subtype === 'LOOKALIKE' ? 'processing' : 'active'}`}>
          <span className="meta-badge__dot" />
          {audience.subtype}
        </span>
      </div>
      {audience.description && (
        <p className="meta-audience-card__desc">{audience.description}</p>
      )}
      <div className="meta-audience-card__details">
        <div className="meta-audience-card__detail">
          <span className="meta-audience-card__detail-label">Size</span>
          <span className="meta-audience-card__detail-value">
            {audience.approximate_count ? formatCompact(audience.approximate_count) : '—'}
          </span>
        </div>
        <div className="meta-audience-card__detail">
          <span className="meta-audience-card__detail-label">Created</span>
          <span className="meta-audience-card__detail-value">
            {audience.time_created ? formatDate(audience.time_created) : '—'}
          </span>
        </div>
      </div>
      <div className="meta-audience-card__actions">
        <button
          className="meta-btn meta-btn--danger meta-btn--small"
          onClick={() => onDelete(audience.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
