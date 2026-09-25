import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ClearIcon, ExpandMoreIcon, SearchIcon } from '@shared/components/icons';
import { useLanguageNavigate } from '@shared/hooks/utils';
import { isFeatureEnabled } from '@core/config/featureFlags';
import '../styles/_faq-page.scss';

export interface FaqEntry {
  id: string;
  category: string;
}

export interface FaqHelpCenterProps {
  namespace: 'faq' | 'ownerFaq';
  entries: readonly FaqEntry[];
  categoryIds: readonly string[];
  alternateHref?: string;
  alternateLabelKey?: string;
  ctaHref?: string;
  showCta?: boolean;
}

export const FaqHelpCenter = ({
  namespace,
  entries,
  categoryIds,
  alternateHref,
  alternateLabelKey = 'switch.link',
  ctaHref,
  showCta = false
}: FaqHelpCenterProps) => {
  const { t, i18n } = useTranslation(namespace);
  const isRtl = i18n.language === 'he';
  const navigate = useLanguageNavigate();

  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>(entries[0]?.id ?? null);

  const progressiveFees = isFeatureEnabled('progressivePlatformFees');

  const answerFor = (entryId: string) => {
    if (entryId === 'how_fees_work' && progressiveFees) {
      return t(`questions.${entryId}.aProgressive`);
    }
    return t(`questions.${entryId}.a`);
  };

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    return entries.filter((entry) => {
      if (activeCategory !== 'all' && entry.category !== activeCategory) return false;
      if (!normalizedQuery) return true;
      const q = t(`questions.${entry.id}.q`, '').toLowerCase();
      const a = answerFor(entry.id).toLowerCase();
      return q.includes(normalizedQuery) || a.includes(normalizedQuery);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- answerFor depends on progressiveFees + t
  }, [entries, activeCategory, normalizedQuery, t, progressiveFees]);

  const grouped = useMemo(() => {
    const byCategory = new Map<string, FaqEntry[]>();
    for (const entry of filtered) {
      const list = byCategory.get(entry.category) || [];
      list.push(entry);
      byCategory.set(entry.category, list);
    }
    return categoryIds
      .map((id) => ({ id, items: byCategory.get(id) || [] }))
      .filter((group) => group.items.length > 0);
  }, [filtered, categoryIds]);

  const resultCount = filtered.length;

  return (
    <div className="faq-page" dir={isRtl ? 'rtl' : 'ltr'}>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <header className="faq-page__header">
        <div className="faq-page__container">
          <div className="faq-page__header-row">
            <div className="faq-page__intro">
              <p className="faq-page__kicker">{t('hero.kicker', 'Help Center')}</p>
              <h1 className="faq-page__title">
                {t('hero.title')}{' '}
                <span className="faq-page__title-accent">{t('hero.titleAccent')}</span>
              </h1>
              <p className="faq-page__subtitle">{t('hero.subtitle')}</p>
            </div>

            {alternateHref && (
              <button
                type="button"
                className="faq-page__switch"
                onClick={() => navigate(alternateHref)}
              >
                {t(alternateLabelKey)}
              </button>
            )}
          </div>

          <div className="faq-page__toolbar">
            <label className="faq-page__search">
              <SearchIcon className="faq-page__search-icon" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('search.placeholder', 'Search questions…')}
                aria-label={t('search.placeholder', 'Search questions…')}
              />
              {query && (
                <button
                  type="button"
                  className="faq-page__search-clear"
                  onClick={() => setQuery('')}
                  aria-label={t('search.clear', 'Clear search')}
                >
                  <ClearIcon fontSize="inherit" />
                </button>
              )}
            </label>

            <div className="faq-page__meta" aria-live="polite">
              {t('search.results', {
                count: resultCount,
                defaultValue: '{{count}} results'
              })}
            </div>
          </div>

          <div className="faq-page__filters" role="tablist" aria-label={t('categories.label', 'Topics')}>
            <button
              type="button"
              role="tab"
              aria-selected={activeCategory === 'all'}
              className={`faq-page__filter ${activeCategory === 'all' ? 'is-active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              {t('categories.all', 'All')}
            </button>
            {categoryIds.map((id) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={activeCategory === id}
                className={`faq-page__filter ${activeCategory === id ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(id)}
              >
                {t(`categories.${id}`)}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="faq-page__main">
        <div className="faq-page__container">
          {resultCount === 0 ? (
            <div className="faq-page__empty">
              <p className="faq-page__empty-title">{t('search.emptyTitle', 'No matching questions')}</p>
              <p className="faq-page__empty-text">
                {t(
                  'search.emptyDescription',
                  'Try a different keyword, or clear filters to browse all topics.'
                )}
              </p>
              <button
                type="button"
                className="faq-page__empty-action"
                onClick={() => {
                  setQuery('');
                  setActiveCategory('all');
                }}
              >
                {t('search.reset', 'Reset filters')}
              </button>
            </div>
          ) : (
            <div className="faq-page__groups">
              {grouped.map((group) => (
                <section key={group.id} className="faq-page__group">
                  {(activeCategory === 'all' || grouped.length > 1) && (
                    <h2 className="faq-page__group-title">{t(`categories.${group.id}`)}</h2>
                  )}
                  <div className="faq-page__list">
                    {group.items.map((entry) => {
                      const isOpen = openId === entry.id;
                      return (
                        <div
                          key={entry.id}
                          className={`faq-page__item ${isOpen ? 'is-open' : ''}`}
                        >
                          <button
                            type="button"
                            className="faq-page__trigger"
                            aria-expanded={isOpen}
                            onClick={() => setOpenId(isOpen ? null : entry.id)}
                          >
                            <span className="faq-page__question">
                              {t(`questions.${entry.id}.q`)}
                            </span>
                            <ExpandMoreIcon
                              className={`faq-page__chevron ${isOpen ? 'is-open' : ''}`}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.div
                                className="faq-page__panel"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: 'easeInOut' }}
                              >
                                <p className="faq-page__answer">{answerFor(entry.id)}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}

          {showCta && ctaHref && (
            <aside className="faq-page__cta">
              <div className="faq-page__cta-copy">
                <h2 className="faq-page__cta-title">{t('cta.title')}</h2>
                <p className="faq-page__cta-text">{t('cta.description')}</p>
              </div>
              <button
                type="button"
                className="faq-page__cta-button"
                onClick={() => navigate(ctaHref)}
              >
                {t('cta.button')}
              </button>
            </aside>
          )}

          <p className="faq-page__contact">
            {t('contact.prefix', 'Still need help?')}{' '}
            <a href="mailto:admin@studioz.co.il">{t('contact.email', 'admin@studioz.co.il')}</a>
          </p>
        </div>
      </main>
    </div>
  );
};
