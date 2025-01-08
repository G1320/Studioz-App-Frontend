import { useState } from 'react';

const SubscriptionPage = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: 75,
      period: 'month',
      highlight: 'Perfect for beginners',
      features: [' 1 active listing', 'Booking confirmation and calendar', 'Standard support']
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 150,
      period: 'month',
      highlight: 'Most Popular',
      features: ['Unlimited active listings', 'Booking confirmation and calendar', 'Priority support']
    }
  ];

  const handleSubscribe = (plan: any) => {
    setSelectedPlan(plan);
    // Add subscription logic here
  };

  return (
    <div className="subscription-page">
      <header className="header">
        <h1>Choose Your Plan</h1>
        <p>Select the perfect plan for your business needs</p>
      </header>

      <div className="plans-container">
        {plans.map((plan) => (
          <div key={plan.id} className={`plan-card ${plan.id} ${selectedPlan === plan ? 'selected' : ''}`}>
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
