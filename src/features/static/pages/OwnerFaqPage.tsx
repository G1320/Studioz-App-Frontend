import { FaqHelpCenter, type FaqEntry } from '../components/FaqHelpCenter';

const CATEGORIES = ['getting_started', 'fees', 'management', 'growth'] as const;

const ENTRIES: readonly FaqEntry[] = [
  { id: 'how_to_list', category: 'getting_started' },
  { id: 'cost_to_list', category: 'getting_started' },
  { id: 'multiple_studios', category: 'getting_started' },
  { id: 'how_fees_work', category: 'fees' },
  { id: 'when_get_paid', category: 'fees' },
  { id: 'invoicing', category: 'fees' },
  { id: 'calendar_sync', category: 'management' },
  { id: 'availability', category: 'management' },
  { id: 'remote_services', category: 'management' },
  { id: 'cancellation_policy', category: 'management' },
  { id: 'visibility', category: 'growth' },
  { id: 'support', category: 'growth' }
];

const OwnerFaqPage = () => (
  <FaqHelpCenter
    namespace="ownerFaq"
    entries={ENTRIES}
    categoryIds={CATEGORIES}
    alternateHref="/faq"
    ctaHref="/studio/create"
    showCta
  />
);

export default OwnerFaqPage;
