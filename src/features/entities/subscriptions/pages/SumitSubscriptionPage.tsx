import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  CheckIcon,
  CloseIcon,
  StarIcon,
  ExpandMoreIcon,
  ExpandLessIcon,
  ArrowForwardIcon
} from '@shared/components/icons';
import { SumitSubscriptionPaymentForm } from '@features/entities/payments/sumit/forms';
import { useSubscription } from '@shared/hooks';
import '../styles/_subscription-page.scss';

interface Plan {
  id: string;
  name: string;
  planId: string;
  price: number;
  period: string;
  highlight: string;
  features: string[];
  notIncluded?: string[];
  isPopular?: boolean;
  ctaText: string;
}

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="subscriptions-faq__item">
      <button onClick={() => setIsOpen(!isOpen)} className="subscriptions-faq__question" type="button">
        <span>{question}</span>
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="subscriptions-faq__answer-wrapper"
          >
            <div className="subscriptions-faq__answer">{answer}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SumitSubscriptionPage = () => {
  const { t } = useTranslation('subscriptions');
  const { isPro, isStarter } = useSubscription();

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const paymentFormRef = useRef<HTMLDivElement>(null);

  // Determine current plan
  const getCurrentPlanId = () => {
    if (isPro) return 'pro';
    if (isStarter) return 'starter';
    return 'free';
  };

  const currentPlanId = getCurrentPlanId();

  const handlePlanSelect = (plan: Plan) => {
    if (selectedPlan?.id === plan.id) {
      setSelectedPlan(null);
    } else {
      setSelectedPlan(plan);
    }
  };

  const scrollToPaymentForm = () => {
    setTimeout(() => {
      paymentFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleButtonClick = (e: React.MouseEvent, plan: Plan) => {
    e.stopPropagation();
    if (selectedPlan?.id !== plan.id) {
      setSelectedPlan(plan);
    }
    scrollToPaymentForm();
  };

  const plans: Plan[] = [
    {
      id: 'free',
      name: t('plans.free.name'),
      planId: 'free',
      price: 0,
      period: t('plans.period'),
      highlight: t('plans.free.highlight'),
      features: [t('plans.free.features.listing'), t('plans.free.features.booking'), t('plans.free.features.support')],
      notIncluded: [
        t('plans.free.notIncluded.calendar'),
        t('plans.free.notIncluded.googleCalendar'),
        t('plans.free.notIncluded.priority')
      ],
      ctaText: t('buttons.currentPlan')
    },
    {
      id: 'starter',
      name: t('plans.starter.name'),
      planId: 'starter',
      price: 49,
      period: t('plans.period'),
      highlight: t('plans.starter.highlight'),
      features: [
        t('plans.starter.features.listing'),
        t('plans.starter.features.booking'),
        t('plans.starter.features.calendar'),
        t('plans.starter.features.googleCalendar'),
        t('plans.starter.features.payment'),
        t('plans.starter.features.support'),
        t('plans.starter.features.cancel')
      ],
      notIncluded: [t('plans.starter.notIncluded.unlimited'), t('plans.starter.notIncluded.priority')],
      ctaText: t('buttons.getStarted')
    },
    {
      id: 'pro',
      name: t('plans.pro.name'),
      planId: 'pro',
      price: 99,
      period: t('plans.period'),
      highlight: t('plans.pro.highlight'),
      isPopular: true,
      features: [
        t('plans.pro.features.listing'),
        t('plans.pro.features.booking'),
        t('plans.pro.features.calendar'),
        t('plans.pro.features.googleCalendar'),
        t('plans.pro.features.support'),
        t('plans.pro.features.payment'),
        t('plans.pro.features.cancel')
      ],
      ctaText: t('buttons.getStarted')
    }
  ];

  const faqs = [
    {
      question: t('faq.switch.question'),
      answer: t('faq.switch.answer')
    },
    {
      question: t('faq.contract.question'),
      answer: t('faq.contract.answer')
    },
    {
      question: t('faq.payment.question'),
      answer: t('faq.payment.answer')
    },
    {
      question: t('faq.cancel.question'),
      answer: t('faq.cancel.answer')
    }
  ];

  return (
    <div className="subscriptions-page">
      {/* Background Decorations */}
      <div className="subscriptions-page__glow subscriptions-page__glow--primary" />
      <div className="subscriptions-page__glow subscriptions-page__glow--blue" />

      {/* Hero Section */}
      <section className="subscriptions-hero">
        <div className="subscriptions-container">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="subscriptions-hero__title"
          >
            {t('header.title_part1')} <span className="subscriptions-hero__accent">{t('header.title_accent')}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="subscriptions-hero__description"
          >
            {t('header.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="subscriptions-pricing">
        <div className="subscriptions-container">
          <div className="subscriptions-pricing__grid">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className={`subscriptions-card ${plan.isPopular ? 'subscriptions-card--popular' : ''} ${
                  selectedPlan?.id === plan.id ? 'subscriptions-card--selected' : ''
                }`}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.isPopular && (
                  <div className="subscriptions-card__badge">
                    <StarIcon /> {t('plans.popularBadge')}
                  </div>
                )}
                {currentPlanId === plan.id && (
                  <div className="subscriptions-card__current">{t('plans.currentPlan')}</div>
                )}

                <div className="subscriptions-card__header">
                  <h3 className="subscriptions-card__name">{plan.name}</h3>
                  <p className="subscriptions-card__highlight">{plan.highlight}</p>
                </div>

                <div className="subscriptions-card__price">
                  {plan.price === 0 ? (
                    <span className="subscriptions-card__amount">{t('plans.freeLabel')}</span>
                  ) : (
                    <>
                      <span className="subscriptions-card__amount">₪{plan.price}</span>
                      <span className="subscriptions-card__period">/{plan.period}</span>
                    </>
                  )}
                </div>

                {plan.id !== 'free' && (
                  <button
                    className={`subscriptions-card__cta ${plan.isPopular ? 'subscriptions-card__cta--primary' : ''}`}
                    onClick={(e) => handleButtonClick(e, plan)}
                    type="button"
                  >
                    {plan.ctaText}
                    <ArrowForwardIcon />
                  </button>
                )}

                <div className="subscriptions-card__features">
                  <p className="subscriptions-card__features-label">{t('plans.includes')}:</p>
                  {plan.features.map((feature, i) => (
                    <div key={i} className="subscriptions-card__feature">
                      <CheckIcon />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {plan.notIncluded?.map((feature, i) => (
                    <div key={i} className="subscriptions-card__feature subscriptions-card__feature--disabled">
                      <CloseIcon />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Form */}
      {selectedPlan && selectedPlan.id !== 'free' && (
        <section className="subscriptions-payment" ref={paymentFormRef}>
          <div className="subscriptions-container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="subscriptions-payment__wrapper"
            >
              <SumitSubscriptionPaymentForm plan={selectedPlan} />
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="subscriptions-faq">
        <div className="subscriptions-container">
          <div className="subscriptions-faq__header">
            <h2 className="subscriptions-section-title">{t('faq.title')}</h2>
            <p className="subscriptions-section-subtitle">{t('faq.subtitle')}</p>
          </div>

          <div className="subscriptions-faq__list">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="subscriptions-cta">
        <div className="subscriptions-cta__overlay" />
        <div className="subscriptions-container">
          <div className="subscriptions-cta__content">
            <h2 className="subscriptions-cta__title">{t('cta.title')}</h2>
            <p className="subscriptions-cta__description">{t('cta.description')}</p>
            <a href="mailto:support@studioz.co.il" className="subscriptions-btn subscriptions-btn--primary">
              {t('cta.button')}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SumitSubscriptionPage;
