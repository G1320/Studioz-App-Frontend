// import { useTranslation } from 'react-i18next';

// interface PlanProps {
//   plan: {
//     id: string;
//     name: string;
//     price: number;
//     period: string;
//     highlight: string;
//     features: string[];
//   };
//   isSelected: boolean;
//   onSubscribe: (plan: any) => void;
// }

// const PlanCard: React.FC<PlanProps> = ({ plan, isSelected, onSubscribe }) => {
//   const { t } = useTranslation();
//   const currency = import.meta.env.VITE_NODE_ENV === 'production' ? '₪' : '$';

//   return (
//     <div className={`plan-card ${plan.id} ${isSelected ? 'selected' : ''}`}>
//       {plan.highlight === 'Most Popular' && <div className="popular-badge">{t('subscription.mostPopular')}</div>}

//       <div className="plan-header">
//         <h2>{t(`subscription.plans.${plan.id}.name`)}</h2>
//         <p className="highlight">{t(`subscription.plans.${plan.id}.highlight`)}</p>
//       </div>

//       <div className="price">
//         <span className="amount">
//           {currency}
//           {plan.price}
//         </span>
//         <span className="period">{t('subscription.perMonth')}</span>
//       </div>

//       <ul className="features">
//         {plan.features.map((feature, index) => (
//           <li key={index}>
//             <span className="check-icon">✓</span>
//             {t(`subscription.plans.${plan.id}.features.${index}`)}
//           </li>
//         ))}
//       </ul>

//       <button className="subscribe-button" onClick={() => onSubscribe(plan)}>
//         {t('subscription.getStarted')}
//       </button>
//     </div>
//   );
// };

// export default PlanCard;
