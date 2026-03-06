import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateAudience } from '../../hooks/useCampaignMutations';
import type { CreateAudiencePayload } from '../../types/meta.types';

interface CreateAudienceModalProps {
  onClose: () => void;
}

export const CreateAudienceModal: React.FC<CreateAudienceModalProps> = ({ onClose }) => {
  const { t } = useTranslation('metaCampaigns');
  const createAudience = useCreateAudience();

  const [name, setName] = useState('');
  const [subtype, setSubtype] = useState<'CUSTOM' | 'LOOKALIKE' | 'WEBSITE'>('WEBSITE');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: CreateAudiencePayload = {
      name,
      subtype,
      description: description || undefined
    };
    if (subtype === 'WEBSITE') {
      payload.rule = {
        inclusions: {
          operator: 'or',
          rules: [{ event_sources: [{ type: 'pixel', id: 'auto' }], retention_seconds: 2592000 }]
        }
      };
    }
    createAudience.mutate(payload, {
      onSuccess: () => onClose()
    });
  };

  return (
    <div className="meta-modal-overlay" onClick={onClose}>
      <div className="meta-modal" onClick={(e) => e.stopPropagation()}>
        <div className="meta-modal__header">
          <h3>{t('audiences.create', 'Create Audience')}</h3>
          <button className="meta-modal__close" onClick={onClose}>&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="meta-modal__body">
          <div className="meta-form-field">
            <label>{t('audiences.name', 'Audience Name')}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="meta-input"
              placeholder="e.g., Website Visitors 30d"
            />
          </div>
          <div className="meta-form-field">
            <label>{t('audiences.type', 'Audience Type')}</label>
            <select
              value={subtype}
              onChange={(e) => setSubtype(e.target.value as 'CUSTOM' | 'LOOKALIKE' | 'WEBSITE')}
              className="meta-select"
            >
              <option value="WEBSITE">Website Visitors</option>
              <option value="CUSTOM">Customer List</option>
              <option value="LOOKALIKE">Lookalike</option>
            </select>
          </div>
          <div className="meta-form-field">
            <label>{t('audiences.description', 'Description')}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="meta-textarea"
              rows={3}
              placeholder="Optional description..."
            />
          </div>
          <div className="meta-modal__actions">
            <button type="button" className="meta-btn meta-btn--ghost" onClick={onClose}>
              {t('actions.cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="meta-btn meta-btn--primary"
              disabled={!name.trim() || createAudience.isPending}
            >
              {createAudience.isPending ? t('actions.creating', 'Creating...') : t('audiences.create', 'Create Audience')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
