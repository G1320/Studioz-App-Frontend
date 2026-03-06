import type { CampaignObjective } from '../types/meta.types';

export interface ObjectiveInfo {
  key: CampaignObjective;
  label: string;
  labelHe: string;
  description: string;
  descriptionHe: string;
}

export const CAMPAIGN_OBJECTIVES: ObjectiveInfo[] = [
  {
    key: 'OUTCOME_AWARENESS',
    label: 'Awareness',
    labelHe: 'מודעות',
    description: 'Reach people who are most likely to remember your ads',
    descriptionHe: 'הגיעו לאנשים שסביר שיזכרו את המודעות שלכם'
  },
  {
    key: 'OUTCOME_TRAFFIC',
    label: 'Traffic',
    labelHe: 'תנועה',
    description: 'Send people to a destination like your website or app',
    descriptionHe: 'שלחו אנשים ליעד כמו האתר או האפליקציה שלכם'
  },
  {
    key: 'OUTCOME_ENGAGEMENT',
    label: 'Engagement',
    labelHe: 'מעורבות',
    description: 'Get more messages, video views, post engagement, or Page likes',
    descriptionHe: 'קבלו יותר הודעות, צפיות בסרטון, מעורבות בפוסט או לייקים לדף'
  },
  {
    key: 'OUTCOME_LEADS',
    label: 'Leads',
    labelHe: 'לידים',
    description: 'Collect leads for your business via forms, calls, or chat',
    descriptionHe: 'אספו לידים לעסק שלכם דרך טפסים, שיחות או צ\'אט'
  },
  {
    key: 'OUTCOME_APP_PROMOTION',
    label: 'App Promotion',
    labelHe: 'קידום אפליקציה',
    description: 'Get people to install or take action in your app',
    descriptionHe: 'גרמו לאנשים להתקין או לפעול באפליקציה שלכם'
  },
  {
    key: 'OUTCOME_SALES',
    label: 'Sales',
    labelHe: 'מכירות',
    description: 'Find people likely to purchase your product or service',
    descriptionHe: 'מצאו אנשים שסביר שירכשו את המוצר או השירות שלכם'
  }
];

export const CTA_TYPES = [
  { value: 'LEARN_MORE', label: 'Learn More', labelHe: 'למידע נוסף' },
  { value: 'SHOP_NOW', label: 'Shop Now', labelHe: 'קנו עכשיו' },
  { value: 'SIGN_UP', label: 'Sign Up', labelHe: 'הירשמו' },
  { value: 'BOOK_TRAVEL', label: 'Book Now', labelHe: 'הזמינו עכשיו' },
  { value: 'CONTACT_US', label: 'Contact Us', labelHe: 'צרו קשר' },
  { value: 'GET_QUOTE', label: 'Get Quote', labelHe: 'קבלו הצעה' },
  { value: 'SUBSCRIBE', label: 'Subscribe', labelHe: 'הירשמו לניוזלטר' },
  { value: 'DOWNLOAD', label: 'Download', labelHe: 'הורידו' },
  { value: 'WATCH_MORE', label: 'Watch More', labelHe: 'צפו עוד' },
  { value: 'APPLY_NOW', label: 'Apply Now', labelHe: 'הגישו מועמדות' }
];

export const PLACEMENT_OPTIONS = [
  { value: 'facebook_feed', label: 'Facebook Feed', platform: 'facebook' },
  { value: 'facebook_stories', label: 'Facebook Stories', platform: 'facebook' },
  { value: 'facebook_reels', label: 'Facebook Reels', platform: 'facebook' },
  { value: 'instagram_feed', label: 'Instagram Feed', platform: 'instagram' },
  { value: 'instagram_stories', label: 'Instagram Stories', platform: 'instagram' },
  { value: 'instagram_reels', label: 'Instagram Reels', platform: 'instagram' },
  { value: 'instagram_explore', label: 'Instagram Explore', platform: 'instagram' },
  { value: 'audience_network', label: 'Audience Network', platform: 'audience_network' }
];
