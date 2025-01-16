import { useState, useEffect } from 'react';

import { PAYPAL_CLIENT_ID } from '@config/paypal/paypalConfig';
import { useUserContext } from '@contexts/UserContext';
import { toast } from 'sonner';
import { activateSubscription, createSubscription } from '@services/subscription-service';
import { sendSubscriptionConfirmation } from '@services/email-service';
const isProduction = false;

const SubscriptionPage = () => {
  const { user, updateSubscription } = useUserContext();

  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [dbSubscription, setDbSubscription] = useState<any>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 79,
      period: 'month',
      highlight: 'Perfect for beginners',
      features: ['1 active listing', 'Booking confirmation and calendar', 'Standard support'],
      paypalPlanId: isProduction ? 'P-0RA498012A876754WM6DXMGI' : 'P-545211905R676864UM6DY3GA'
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 149,
      period: 'month',
      highlight: 'Most Popular',
      features: ['Unlimited active listings', 'Booking confirmation and calendar', 'Priority support'],
      paypalPlanId: isProduction ? 'P-5C8252008J501132RM6DXKBY' : 'P-7RT29383GF5387715M6DY4JI'
    }
  ];

  const handleSubscribe = async (plan: any) => {
    if (!user?._id) {
      toast.error('Please login to subscribe to a plan');
      return;
    }
    try {
      // Create subscription in our database first
      const subscription = await createSubscription({
        userId: user._id,
        planId: plan.id
      });
      setDbSubscription(subscription);
      setSelectedPlan(plan);
    } catch (error) {
      console.error('Error creating subscription:', error);
      toast.error('Failed to initiate subscription');
    }
  };

  useEffect(() => {
    if (selectedPlan?.paypalPlanId) {
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`;
      script.setAttribute('data-sdk-integration-source', 'button-factory');
      script.onload = () => {
        if (window.paypal && window.paypal.Buttons) {
          window.paypal
            .Buttons({
              style: {
                shape: 'rect',
                color: 'gold',
                layout: 'vertical',
                label: 'subscribe'
              },
              createSubscription: async function (_data: any, actions: any) {
                return actions.subscription.create({
                  plan_id: selectedPlan.paypalPlanId,
                  application_context: {
                    shipping_preference: 'GET_FROM_FILE'
                  }
                });
              },
              onApprove: async function (data, actions) {
                const subscriptionDetails = await actions.subscription?.get();

                await activateSubscription({
                  subscriptionId: dbSubscription._id,
                  paypalSubscriptionId: data.subscriptionID || '',
                  subscriptionDetails
                });

                await sendSubscriptionConfirmation(user?.email as string, {
                  customerName: user?.name as string,
                  planName: selectedPlan.name,
                  planPrice: selectedPlan.price,
                  subscriptionId: data.subscriptionID as string,
                  startDate: new Date()
                });

                updateSubscription(dbSubscription._id, 'ACTIVE');
                return Promise.resolve();
              }
            })
            .render('#paypal-button-container');
        }
      };
      document.body.appendChild(script);

      return () => {
        const buttonContainer = document.getElementById('paypal-button-container');
        if (buttonContainer) {
          buttonContainer.innerHTML = '';
        }
      };
    }
  }, [selectedPlan]);

  return (
    <div className="subscription-page">
      <header className="header">
        <h1>Choose Your Plan</h1>
        <p>Select the perfect plan for your business needs</p>
      </header>

      <div className="plans-container">
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card ${plan.id} ${selectedPlan?.id === plan.id ? 'selected' : ''}`}>
            {plan.highlight === 'Most Popular' && <div className="popular-badge">Most Popular</div>}

            <div className="plan-header">
              <h2>{plan.name}</h2>
              <p className="highlight">{plan.highlight}</p>
            </div>

            <div className="price">
              <span className="amount">₪{plan.price}</span>
              <span className="period">per {plan.period}</span>
            </div>

            <ul className="features">
              {plan.features.map((feature, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            <button className="subscribe-button" onClick={() => handleSubscribe(plan)}>
              Get Started
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div id="paypal-container">
          <h2>Subscribe to {selectedPlan.name} Plan</h2>
          <div id="paypal-button-container"></div>
        </div>
      )}

      <footer className="benefits">
        <h3>All plans include:</h3>
        <div className="benefit-items">
          <div className="benefit">
            <span className="check-icon">✓</span>
            14-day free trial
          </div>
          <div className="benefit">
            <span className="check-icon">✓</span>
            No credit card required
          </div>
          <div className="benefit">
            <span className="check-icon">✓</span>
            Cancel anytime
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SubscriptionPage;
