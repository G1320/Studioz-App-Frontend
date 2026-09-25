import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Studio } from 'src/types/index';
import { CancellationPolicy } from 'src/types/studio';
import { useStudioSectionSave } from '../useStudioSectionSave';
import { SectionChrome } from './SectionChrome';

type PolicyType = NonNullable<CancellationPolicy['type']>;

interface PoliciesSectionProps {
  studio: Studio;
}

export const PoliciesSection = ({ studio }: PoliciesSectionProps) => {
  const { t } = useTranslation('forms');
  const { savePatch, isSaving } = useStudioSectionSave(studio, studio._id);

  const baselineType = studio.cancellationPolicy?.type;
  const baselineRules =
    studio.cancellationPolicy?.houseRules?.en ||
    studio.cancellationPolicy?.houseRules?.he ||
    '';

  const [policyType, setPolicyType] = useState<PolicyType | undefined>(baselineType);
  const [houseRules, setHouseRules] = useState(baselineRules);

  useEffect(() => {
    setPolicyType(studio.cancellationPolicy?.type);
    setHouseRules(
      studio.cancellationPolicy?.houseRules?.en ||
        studio.cancellationPolicy?.houseRules?.he ||
        ''
    );
  }, [studio._id, studio.cancellationPolicy]);

  const isDirty = policyType !== baselineType || houseRules !== baselineRules;

  const policies = useMemo(
    () =>
      (
        [
          {
            id: 'flexible' as const,
            label: t('form.policies.flexible.label', 'Flexible'),
            description: t(
              'form.policies.flexible.description',
              'Full refund up to 24 hours before session start time.'
            )
          },
          {
            id: 'moderate' as const,
            label: t('form.policies.moderate.label', 'Moderate'),
            description: t(
              'form.policies.moderate.description',
              'Full refund up to 5 days before session. 50% refund up to 24h before.'
            )
          },
          {
            id: 'strict' as const,
            label: t('form.policies.strict.label', 'Strict'),
            description: t(
              'form.policies.strict.description',
              '50% refund up to 7 days before session. No refund within 7 days.'
            )
          }
        ] as const
      ),
    [t]
  );

  const handleDiscard = () => {
    setPolicyType(baselineType);
    setHouseRules(baselineRules);
  };

  const handleSave = () => {
    const next: CancellationPolicy = {
      type: policyType || 'flexible',
      ...(houseRules.trim()
        ? { houseRules: { en: houseRules.trim(), he: houseRules.trim() } }
        : {})
    };
    savePatch({ cancellationPolicy: next });
  };

  return (
    <SectionChrome
      title={t('manage.sections.policies', 'Policies')}
      subtitle={t('manage.policies.subtitle', 'Cancellation terms and house rules.')}
      isDirty={isDirty}
      isSaving={isSaving}
      onDiscard={handleDiscard}
      onSave={handleSave}
    >
      <div className="studio-manage-panel">
        <div className="studio-manage-panel__body">
          <div className="studio-manage-field">
            <span className="studio-manage-label">
              {t('form.policies.cancellation.label', 'Cancellation Policy')}
            </span>
            <div className="studio-manage-policy-list">
              {policies.map((policy) => {
                const selected = policyType === policy.id;
                return (
                  <button
                    key={policy.id}
                    type="button"
                    className={`studio-manage-policy ${selected ? 'is-selected' : ''}`}
                    onClick={() => setPolicyType(policy.id)}
                  >
                    <span className={`studio-manage-policy__radio ${selected ? 'is-on' : ''}`} />
                    <span className="studio-manage-policy__copy">
                      <span className="studio-manage-policy__title">{policy.label}</span>
                      <span className="studio-manage-policy__desc">{policy.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="studio-manage-field">
            <label className="studio-manage-label" htmlFor="sm-house-rules">
              {t('form.policies.houseRules.label', 'Studio Rules')}
            </label>
            <textarea
              id="sm-house-rules"
              className="studio-manage-textarea"
              rows={4}
              value={houseRules}
              onChange={(e) => setHouseRules(e.target.value)}
              placeholder={t(
                'form.policies.houseRules.placeholder',
                'e.g. No smoking inside, No food near the console…'
              )}
            />
            <p className="studio-manage-hint">
              {t(
                'form.policies.houseRules.note',
                'Guests must agree to these rules before booking.'
              )}
            </p>
          </div>
        </div>
      </div>
    </SectionChrome>
  );
};
