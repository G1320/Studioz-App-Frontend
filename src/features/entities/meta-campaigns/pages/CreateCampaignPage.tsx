import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useCreateCampaign, useCreateAdSet, useCreateAd } from '../hooks/useCampaignMutations';
import { WizardStepper } from '../components/wizard/WizardStepper';
import { CampaignObjectiveStep } from '../components/wizard/CampaignObjectiveStep';
import { AdSetConfigStep } from '../components/wizard/AdSetConfigStep';
import { AudienceTargetingStep } from '../components/wizard/AudienceTargetingStep';
import { AdCreativeStep } from '../components/wizard/AdCreativeStep';
import { ReviewStep } from '../components/wizard/ReviewStep';
import type { CampaignWizardState, MetaTargeting } from '../types/meta.types';

const STEPS = ['Objective', 'Ad Set', 'Audience', 'Creative', 'Review'];

const initialState: CampaignWizardState = {
  objective: 'OUTCOME_TRAFFIC',
  campaignName: '',
  adSetName: '',
  budgetType: 'daily',
  budget: 20,
  startDate: new Date().toISOString().split('T')[0],
  endDate: '',
  placements: 'automatic',
  manualPlacements: [],
  targeting: { geo_locations: { countries: ['IL'] }, age_min: 18, age_max: 65 },
  mediaType: 'image',
  mediaUrl: '',
  mediaId: '',
  headline: '',
  primaryText: '',
  description: '',
  ctaType: 'LEARN_MORE',
  destinationUrl: '',
  utmSource: 'facebook',
  utmMedium: 'paid',
  utmCampaign: ''
};

const CreateCampaignPage: React.FC = () => {
  const { t } = useTranslation('metaCampaigns');
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [state, setState] = useState<CampaignWizardState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const createCampaign = useCreateCampaign();
  const createAdSet = useCreateAdSet();
  const createAd = useCreateAd();

  const updateField = useCallback((field: string, value: unknown) => {
    setState(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateTargeting = useCallback((targeting: MetaTargeting) => {
    setState(prev => ({ ...prev, targeting }));
  }, []);

  const canProceed = () => {
    switch (step) {
      case 0: return !!state.campaignName.trim() && !!state.objective;
      case 1: return !!state.adSetName.trim() && state.budget > 0;
      case 2: return true;
      case 3: return !!state.headline.trim() && !!state.destinationUrl.trim();
      case 4: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      // 1. Create campaign
      const campaign = await createCampaign.mutateAsync({
        name: state.campaignName,
        objective: state.objective,
        status: 'PAUSED',
        special_ad_categories: ['NONE'],
        ...(state.budgetType === 'daily'
          ? { daily_budget: Math.round(state.budget * 100) }
          : { lifetime_budget: Math.round(state.budget * 100) })
      });

      // 2. Create ad set
      const adSet = await createAdSet.mutateAsync({
        name: state.adSetName,
        campaign_id: campaign.id,
        billing_event: 'IMPRESSIONS',
        optimization_goal: state.objective === 'OUTCOME_TRAFFIC' ? 'LINK_CLICKS' : 'IMPRESSIONS',
        targeting: state.targeting,
        status: 'PAUSED',
        ...(state.budgetType === 'daily'
          ? { daily_budget: Math.round(state.budget * 100) }
          : { lifetime_budget: Math.round(state.budget * 100) }),
        ...(state.startDate && { start_time: new Date(state.startDate).toISOString() }),
        ...(state.endDate && { end_time: new Date(state.endDate).toISOString() })
      });

      // 3. Create ad with creative
      await createAd.mutateAsync({
        name: `${state.campaignName} - Ad`,
        adset_id: adSet.id,
        creative: {
          object_story_spec: {
            link_data: {
              link: state.destinationUrl,
              message: state.primaryText,
              name: state.headline,
              description: state.description,
              call_to_action: { type: state.ctaType }
            }
          }
        },
        status: 'PAUSED'
      });

      navigate(-1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="meta-create-campaign">
      <div className="meta-create-campaign__header">
        <button className="meta-btn meta-btn--ghost" onClick={() => navigate(-1)}>
          &larr; {t('actions.back', 'Back')}
        </button>
        <h1>{t('wizard.title', 'Create Campaign')}</h1>
      </div>

      <WizardStepper steps={STEPS} currentStep={step} />

      {error && <div className="meta-error-banner">{error}</div>}

      <div className="meta-create-campaign__content">
        {step === 0 && (
          <CampaignObjectiveStep
            selectedObjective={state.objective}
            campaignName={state.campaignName}
            onObjectiveChange={(obj) => updateField('objective', obj)}
            onNameChange={(name) => updateField('campaignName', name)}
          />
        )}
        {step === 1 && (
          <AdSetConfigStep
            adSetName={state.adSetName}
            budgetType={state.budgetType}
            budget={state.budget}
            startDate={state.startDate}
            endDate={state.endDate}
            placements={state.placements}
            manualPlacements={state.manualPlacements}
            onUpdate={updateField}
          />
        )}
        {step === 2 && (
          <AudienceTargetingStep
            targeting={state.targeting}
            onUpdate={updateTargeting}
          />
        )}
        {step === 3 && (
          <AdCreativeStep
            mediaType={state.mediaType}
            mediaUrl={state.mediaUrl}
            headline={state.headline}
            primaryText={state.primaryText}
            description={state.description}
            ctaType={state.ctaType}
            destinationUrl={state.destinationUrl}
            utmSource={state.utmSource}
            utmMedium={state.utmMedium}
            utmCampaign={state.utmCampaign}
            onUpdate={updateField}
          />
        )}
        {step === 4 && <ReviewStep state={state} />}
      </div>

      <div className="meta-create-campaign__footer">
        {step > 0 && (
          <button className="meta-btn meta-btn--secondary" onClick={() => setStep(s => s - 1)}>
            {t('wizard.back', 'Back')}
          </button>
        )}
        <div className="meta-create-campaign__footer-right">
          {step < STEPS.length - 1 ? (
            <button
              className="meta-btn meta-btn--primary"
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
            >
              {t('wizard.next', 'Next')}
            </button>
          ) : (
            <button
              className="meta-btn meta-btn--primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? t('wizard.publishing', 'Creating...') : t('wizard.publish', 'Create Campaign')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
