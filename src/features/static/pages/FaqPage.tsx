import { FaqHelpCenter, type FaqEntry } from '../components/FaqHelpCenter';

const CATEGORIES = ['general', 'booking', 'payments', 'account'] as const;

const ENTRIES: readonly FaqEntry[] = [
  { id: 'what_is_studioz', category: 'general' },
  { id: 'studio_types', category: 'general' },
  { id: 'remote_projects', category: 'general' },
  { id: 'how_to_book', category: 'booking' },
  { id: 'cancellation', category: 'booking' },
  { id: 'reviews', category: 'booking' },
  { id: 'contact_studio', category: 'booking' },
  { id: 'issue_with_booking', category: 'booking' },
  { id: 'is_it_free', category: 'payments' },
  { id: 'payment_methods', category: 'payments' },
  { id: 'payment_security', category: 'payments' },
  { id: 'wishlists', category: 'account' }
];

const FaqPage = () => (
  <FaqHelpCenter
    namespace="faq"
    entries={ENTRIES}
    categoryIds={CATEGORIES}
    alternateHref="/preview/landing#studio-faq"
    ctaHref="/search"
    showCta
  />
);

export default FaqPage;
