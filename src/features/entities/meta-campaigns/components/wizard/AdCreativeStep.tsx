import React from 'react';
import { CTA_TYPES } from '../../utils/campaignObjectives';

interface AdCreativeStepProps {
  mediaType: 'image' | 'video' | 'remotion';
  mediaUrl: string;
  headline: string;
  primaryText: string;
  description: string;
  ctaType: string;
  destinationUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  onUpdate: (field: string, value: string) => void;
}

export const AdCreativeStep: React.FC<AdCreativeStepProps> = ({
  mediaType,
  mediaUrl,
  headline,
  primaryText,
  description,
  ctaType,
  destinationUrl,
  utmSource,
  utmMedium,
  utmCampaign,
  onUpdate
}) => {
  return (
    <div className="meta-wizard-step">
      <div className="meta-form-field">
        <label>Media Source</label>
        <div className="meta-media-toggle">
          {(['image', 'video', 'remotion'] as const).map((type) => (
            <button
              key={type}
              type="button"
              className={`meta-btn ${mediaType === type ? 'meta-btn--primary' : 'meta-btn--ghost'}`}
              onClick={() => onUpdate('mediaType', type)}
            >
              {type === 'remotion' ? 'Remotion Ad' : type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {mediaType === 'remotion' ? (
        <div className="meta-form-field">
          <label>Remotion Ad</label>
          <p className="meta-form-hint">
            Select a rendered Remotion video ad from your projects to use as the creative.
            The video will be uploaded to Meta's media library.
          </p>
          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => onUpdate('mediaUrl', e.target.value)}
            className="meta-input"
            placeholder="Paste Remotion video URL or select from library"
          />
        </div>
      ) : (
        <div className="meta-form-field">
          <label>{mediaType === 'image' ? 'Image URL' : 'Video URL'}</label>
          <input
            type="text"
            value={mediaUrl}
            onChange={(e) => onUpdate('mediaUrl', e.target.value)}
            className="meta-input"
            placeholder={`Enter ${mediaType} URL or upload`}
          />
        </div>
      )}

      <div className="meta-form-field">
        <label>Headline</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => onUpdate('headline', e.target.value)}
          className="meta-input"
          placeholder="e.g., Book Your Studio Session"
          maxLength={40}
        />
        <span className="meta-form-counter">{headline.length}/40</span>
      </div>

      <div className="meta-form-field">
        <label>Primary Text</label>
        <textarea
          value={primaryText}
          onChange={(e) => onUpdate('primaryText', e.target.value)}
          className="meta-textarea"
          rows={3}
          placeholder="The main ad copy..."
          maxLength={125}
        />
        <span className="meta-form-counter">{primaryText.length}/125</span>
      </div>

      <div className="meta-form-field">
        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => onUpdate('description', e.target.value)}
          className="meta-input"
          placeholder="Optional description..."
        />
      </div>

      <div className="meta-form-row">
        <div className="meta-form-field">
          <label>Call to Action</label>
          <select
            value={ctaType}
            onChange={(e) => onUpdate('ctaType', e.target.value)}
            className="meta-select"
          >
            {CTA_TYPES.map((cta) => (
              <option key={cta.value} value={cta.value}>{cta.label}</option>
            ))}
          </select>
        </div>
        <div className="meta-form-field">
          <label>Destination URL</label>
          <input
            type="url"
            value={destinationUrl}
            onChange={(e) => onUpdate('destinationUrl', e.target.value)}
            className="meta-input"
            placeholder="https://studioz.co.il"
          />
        </div>
      </div>

      <div className="meta-form-field">
        <label>UTM Parameters</label>
        <div className="meta-utm-grid">
          <input
            type="text"
            value={utmSource}
            onChange={(e) => onUpdate('utmSource', e.target.value)}
            className="meta-input"
            placeholder="utm_source (e.g., facebook)"
          />
          <input
            type="text"
            value={utmMedium}
            onChange={(e) => onUpdate('utmMedium', e.target.value)}
            className="meta-input"
            placeholder="utm_medium (e.g., paid)"
          />
          <input
            type="text"
            value={utmCampaign}
            onChange={(e) => onUpdate('utmCampaign', e.target.value)}
            className="meta-input"
            placeholder="utm_campaign"
          />
        </div>
      </div>
    </div>
  );
};
