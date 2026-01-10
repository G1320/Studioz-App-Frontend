import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCategories, useCities } from '@shared/hooks/utils';
import { cities } from '@core/config/cities/cities';
import { StudioCard } from '@features/entities';
import { Studio } from 'src/types/index';
import { getSubcategoryIcon, MusicProductionIcon } from '@shared/components/icons/CategoryIcons';
import StarIcon from '@mui/icons-material/Star';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import GroupsIcon from '@mui/icons-material/Groups';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

/**
 * Animation variants for Framer Motion
 */
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

const hoverLift = {
  whileHover: { y: -5 }
};

interface LandingPageProps {
  studios: Studio[];
}

/**
 * Main Landing Page Component for Studioz
 */
const LandingPage: React.FC<LandingPageProps> = ({ studios }) => {
  const { t, i18n } = useTranslation('landing');
  const navigate = useNavigate();
  const { getMusicSubCategories, getEnglishByDisplay } = useCategories();
  const { getOptions: getCityOptions, getEnglishByDisplay: getCityEnglishByDisplay } = useCities();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const musicSubCategories = useMemo(() => getMusicSubCategories(), [getMusicSubCategories]);
  const cityOptions = useMemo(() => getCityOptions(), [getCityOptions]);

  // Get top 3 studios (sorted by rating or just take first 3)
  const featuredStudios = useMemo(() => {
    return [...studios].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)).slice(0, 3);
  }, [studios]);

  const handleSearch = () => {
    const categoryEnglish = selectedCategory ? getEnglishByDisplay(selectedCategory) : '';
    const cityEnglish = selectedCity ? getCityEnglishByDisplay(selectedCity) : '';

    let path = `/${i18n.language}/studios`;

    const params = new URLSearchParams();
    if (categoryEnglish) {
      params.set('subcategory', categoryEnglish);
    }
    if (cityEnglish) {
      // Find the city name from the cities config
      const cityConfig = cities.find((c) => c.displayName === cityEnglish || c.name === cityEnglish);
      const cityName = cityConfig?.name || cityEnglish;
      params.set('city', cityName);
    }

    if (params.toString()) {
      path += `?${params.toString()}`;
    }

    navigate(path);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsCityOpen(false);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero__background">
          <img
            src="https://pquxfbbxflqvtidtlrhl.supabase.co/storage/v1/object/public/hmac-uploads/brand/91893494-7bbb-41d7-99cc-7cc9c8d44ebc/assets/17f74143-c16b-4ec8-9977-28fe1929edaf.jpg"
            alt="Studio Background"
            className="landing-hero__image"
          />
          <div className="landing-hero__overlay" />
        </div>

        <div className="landing-hero__content">
          <motion.h1 className="landing-hero__title" {...fadeInUp} transition={{ duration: 0.8 }}>
            {t('hero.title_part1')} <span className="landing-hero__accent">{t('hero.title_accent')}</span>
          </motion.h1>

          <motion.p className="landing-hero__description" {...fadeInUp} transition={{ duration: 0.8, delay: 0.2 }}>
            {t('hero.description')}
          </motion.p>

          <motion.div className="landing-hero__search" {...fadeInUp} transition={{ duration: 0.8, delay: 0.4 }}>
            {/* Category Dropdown */}
            <div className="landing-dropdown" ref={categoryDropdownRef}>
              <button
                className={`landing-dropdown__trigger ${isCategoryOpen ? 'landing-dropdown__trigger--open' : ''}`}
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsCityOpen(false);
                }}
                type="button"
              >
                {(() => {
                  const Icon = selectedCategory
                    ? getSubcategoryIcon(getEnglishByDisplay(selectedCategory))
                    : MusicProductionIcon;
                  return <Icon className="landing-dropdown__icon" />;
                })()}
                <span className="landing-dropdown__text">{selectedCategory || t('hero.category_placeholder')}</span>
                <KeyboardArrowDownIcon
                  className={`landing-dropdown__arrow ${isCategoryOpen ? 'landing-dropdown__arrow--open' : ''}`}
                />
              </button>
              {isCategoryOpen && (
                <div className="landing-dropdown__menu">
                  {musicSubCategories.map((category) => (
                    <button
                      key={category.key}
                      className={`landing-dropdown__option ${selectedCategory === category.value ? 'landing-dropdown__option--selected' : ''}`}
                      onClick={() => handleCategorySelect(category.value)}
                      type="button"
                    >
                      {(() => {
                        const Icon = getSubcategoryIcon(getEnglishByDisplay(category.value));
                        return <Icon className="landing-dropdown__option-icon" aria-hidden="true" focusable="false" />;
                      })()}
                      <span className="landing-dropdown__option-label">{category.value}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* City Dropdown */}
            <div className="landing-dropdown" ref={cityDropdownRef}>
              <button
                className={`landing-dropdown__trigger ${isCityOpen ? 'landing-dropdown__trigger--open' : ''}`}
                onClick={() => {
                  setIsCityOpen(!isCityOpen);
                  setIsCategoryOpen(false);
                }}
                type="button"
              >
                <LocationOnIcon className="landing-dropdown__icon" />
                <span className="landing-dropdown__text">{selectedCity || t('hero.city_placeholder')}</span>
                <KeyboardArrowDownIcon
                  className={`landing-dropdown__arrow ${isCityOpen ? 'landing-dropdown__arrow--open' : ''}`}
                />
              </button>
              {isCityOpen && (
                <div className="landing-dropdown__menu">
                  {cityOptions.map((city) => (
                    <button
                      key={city.key}
                      className={`landing-dropdown__option ${selectedCity === city.value ? 'landing-dropdown__option--selected' : ''}`}
                      onClick={() => handleCitySelect(city.value)}
                      type="button"
                    >
                      <span className="landing-dropdown__option-label">{city.value}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button className="landing-hero__search-btn" onClick={handleSearch} type="button">
              {t('hero.search_btn')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="landing-categories">
        <div className="landing-container">
          <div className="landing-categories__header">
            <div>
              <h2 className="landing-section-title">{t('categories.title')}</h2>
              <p className="landing-section-subtitle">{t('categories.subtitle')}</p>
            </div>
            <button className="landing-view-all" onClick={() => navigate(`/${i18n.language}/studios`)} type="button">
              {t('categories.view_all')} <ArrowForwardIcon />
            </button>
          </div>

          <div className="landing-categories__grid">
            {(() => {
              const MusicIcon = getSubcategoryIcon('Music Production');
              const PodcastIcon = getSubcategoryIcon('Podcast Recording');
              const MixingIcon = getSubcategoryIcon('Mixing');
              const MasteringIcon = getSubcategoryIcon('Mastering');
              const VocalIcon = getSubcategoryIcon('Vocal & Instrument Recording');
              const RehearsalIcon = getSubcategoryIcon('Band rehearsal');
              return (
                <>
                  <CategoryCard
                    icon={<MusicIcon />}
                    label={t('categories.music_production')}
                    onClick={() => navigate(`/${i18n.language}/studios?subcategory=Music%20Production`)}
                  />
                  <CategoryCard
                    icon={<PodcastIcon />}
                    label={t('categories.podcast')}
                    onClick={() => navigate(`/${i18n.language}/studios?subcategory=Podcast%20Recording`)}
                  />
                  {/* <CategoryCard
              icon={<CameraAltIcon />}
              label={t('categories.photography')}
              onClick={() => navigate(`/${i18n.language}/studios/photo`)}
            /> */}
                  {/* <CategoryCard
              icon={<VideocamIcon />}
              label={t('categories.video')}
              onClick={() => navigate(`/${i18n.language}/studios/photo`)}
            /> */}
                  <CategoryCard
                    icon={<MixingIcon />}
                    label={t('categories.mixing')}
                    onClick={() => navigate(`/${i18n.language}/studios?subcategory=Mixing`)}
                  />
                  <CategoryCard
                    icon={<MasteringIcon />}
                    label={t('categories.mastering')}
                    onClick={() => navigate(`/${i18n.language}/studios?subcategory=Mastering`)}
                  />
                  <CategoryCard
                    icon={<VocalIcon />}
                    label={t('categories.vocal_recording')}
                    onClick={() =>
                      navigate(`/${i18n.language}/studios?subcategory=Vocal%20%26%20Instrument%20Recording`)
                    }
                  />
                  <CategoryCard
                    icon={<RehearsalIcon />}
                    label={t('categories.rehearsal')}
                    onClick={() => navigate(`/${i18n.language}/studios?subcategory=Band%20rehearsal`)}
                  />
                </>
              );
            })()}
          </div>
        </div>
      </section>

      {/* Featured Studios Section */}
      <section className="landing-featured">
        <div className="landing-container">
          <h2 className="landing-section-title">{t('featured.title')}</h2>

          <div className="landing-featured__grid">
            {featuredStudios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        </div>
      </section>

      {/* Booking Preview Section */}
      <section className="landing-booking-preview">
        <div className="landing-container">
          <div className="landing-booking-preview__grid">
            {/* Text Content Column */}
            <div className="landing-booking-preview__content">
              <div className="landing-booking-preview__header">
                <motion.h2
                  className="landing-booking-preview__title"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  {t('booking_process.title')}
                </motion.h2>
                <motion.p
                  className="landing-booking-preview__subtitle"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  {t('booking_process.subtitle')}
                </motion.p>
              </div>

              <div className="landing-booking-preview__steps">
                {[1, 2, 3].map((step, index) => (
                  <motion.div
                    key={step}
                    className="landing-booking-preview__step"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="landing-booking-preview__step-icon-wrapper">
                      <div className="landing-booking-preview__step-glow" />
                      <div className="landing-booking-preview__step-number">{step}</div>
                    </div>
                    <span className="landing-booking-preview__step-text">
                      {t(`booking_process.step${step}` as any)}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Image Column */}
            <motion.div
              className="landing-booking-preview__image-wrapper"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="landing-booking-preview__image-container">
                <img
                  src="/images/Landing-Booking-Visual-2.png"
                  alt="Booking Process Preview"
                  className="landing-booking-preview__image"
                />
              </div>

              {/* Floating Badge */}
              <div className="landing-booking-preview__badge">
                <div className="landing-booking-preview__badge-dot" />
                <span className="landing-booking-preview__badge-text">
                  {t('booking_process.instant_badge', 'Available for instant booking')}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="landing-value-props">
        <div className="landing-value-props__line" />
        <div className="landing-container">
          <div className="landing-value-props__grid">
            <ValueProp
              icon={<StarIcon />}
              title={t('value_props.verified.title')}
              description={t('value_props.verified.description')}
            />
            <ValueProp
              icon={<CalendarMonthIcon />}
              title={t('value_props.instant.title')}
              description={t('value_props.instant.description')}
            />
            <ValueProp
              icon={<GroupsIcon />}
              title={t('value_props.community.title')}
              description={t('value_props.community.description')}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="landing-cta">
        <div className="landing-container">
          <div className="landing-cta__card">
            <div className="landing-cta__glow landing-cta__glow--primary" />
            <div className="landing-cta__glow landing-cta__glow--blue" />

            <h2 className="landing-cta__title">{t('cta.title')}</h2>
            <p className="landing-cta__description">{t('cta.description')}</p>

            <div className="landing-cta__buttons">
              <button
                className="landing-cta__btn landing-cta__btn--primary"
                onClick={() => navigate(`/${i18n.language}/studios`)}
                type="button"
              >
                {t('cta.find_studio')}
              </button>
              <button
                className="landing-cta__btn landing-cta__btn--secondary"
                onClick={() => navigate(`/${i18n.language}/for-owners`)}
                type="button"
              >
                {t('cta.list_space')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

/**
 * Category Card Component
 */
interface CategoryCardProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ icon, label, onClick }) => {
  return (
    <motion.div
      className="landing-category-card"
      {...hoverLift}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <div className="landing-category-card__icon">{icon}</div>
      <span className="landing-category-card__label">{label}</span>
    </motion.div>
  );
};

/**
 * Value Prop Component
 */
interface ValuePropProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueProp: React.FC<ValuePropProps> = ({ icon, title, description }) => {
  return (
    <div className="landing-value-prop">
      <div className="landing-value-prop__icon">{icon}</div>
      <h3 className="landing-value-prop__title">{title}</h3>
      <p className="landing-value-prop__description">{description}</p>
    </div>
  );
};

export default LandingPage;
