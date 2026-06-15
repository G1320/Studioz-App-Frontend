import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GenericModal } from '@shared/components/modal/GenericModal';
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
    <GenericModal open onClose={onClose} className="meta-modal-wrapper">
      <div className="meta-modal">
        <div className="meta-modal__header">
          <h3>{t('audiences.create', 'Create Audience')}</h3>
          <button
            type="button"
            className="meta-modal__close"
            onClick={onClose}
            aria-label={t('common.close', 'Close')}
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="meta-modal__body">
          <div className="meta-form-field">
            <label htmlFor="audience-name">{t('audiences.name', 'Audience Name')}</label>
            <input
              id="audience-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="meta-input"
              placeholder="e.g., Website Visitors 30d"
            />
          </div>
          <div className="meta-form-field">
            <label htmlFor="audience-type">{t('audiences.type', 'Audience Type')}</label>
            <select
              id="audience-type"
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
            <label htmlFor="audience-description">{t('audiences.description', 'Description')}</label>
            <textarea
              id="audience-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="meta-textarea"
              rows={3}
              placeholder="Optional description..."
            />
          </div>
          <div className="meta-modal__actions">
            <button type="button" className="meta-btn meta-btn--ghost" onClick={onClose}>
              {t('common.cancel', 'Cancel')}
            </button>
            <button type="submit" className="meta-btn meta-btn--primary" disabled={createAudience.isPending}>
              {createAudience.isPending ? t('common.saving', 'Saving...') : t('audiences.create', 'Create Audience')}
            </button>
          </div>
        </form>
      </div>
    </GenericModal>
  );
};
