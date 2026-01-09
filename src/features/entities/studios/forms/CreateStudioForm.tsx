import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { FileUploader, SteppedForm, FieldType, FormStep, PortfolioStep } from '@shared/components';
import type { CancellationPolicy } from '@shared/components';
import { AmenitiesSelector } from '@shared/components/amenities-selector';
import { getLocalUser } from '@shared/services';
import { studioStepSchemas } from '@shared/validation/schemas';
import { getStepFromUrl } from '@shared/components/forms/steppedForm/utils';
// Step icons
import TextFieldsIcon from '@mui/icons-material/TextFields';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import WeekendIcon from '@mui/icons-material/Weekend';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import ShieldIcon from '@mui/icons-material/Shield';
import DescriptionIcon from '@mui/icons-material/Description';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WorkIcon from '@mui/icons-material/Work';
import { ProTip } from '@shared/components/pro-tip';
import {
  useCreateStudioMutation,
  useMusicCategories,
  usePhotoCategories,
  usePhotoSubCategories,
  useDays,
  useCategories,
  useStudioFileUpload,
  useFormAutoSaveUncontrolled,
  useControlledStateAutoSave,
  useSubscription,
  useStudios,
  useAuth0LoginHandler
} from '@shared/hooks';
import { useUserContext } from '@core/contexts';
import { Studio } from 'src/types/index';
import { toast } from 'sonner';
import { DayOfWeek, StudioAvailability, EquipmentCategory, PortfolioItem, SocialLinks } from 'src/types/studio';
import { loadFormState } from '@shared/utils/formAutoSaveUtils';

interface StudioFormData {
  coverImage?: string;
  galleryImages?: string[];
  coverAudioFile?: string;
  galleryAudioFiles?: string[];
  categories?: string[];
  subCategories?: string[];
  genres?: string[];
  amenities?: string[];
  equipment?: EquipmentCategory[];
  studioAvailability?: StudioAvailability;
  website?: string;
  parking?: 'private' | 'street' | 'paid' | 'none';
  languageToggle?: string;
  cancellationPolicy?: CancellationPolicy;
  houseRules?: string;
  portfolio?: PortfolioItem[];
  socialLinks?: SocialLinks;
  [key: string]: any; // Allow additional properties from form
}

export const CreateStudioForm = () => {
  const { user: contextUser } = useUserContext();
  const user = contextUser || getLocalUser();
  const { loginWithPopup } = useAuth0LoginHandler();
  const [searchParams] = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'he'>('en');
  const { getMusicSubCategories, getEnglishByDisplay } = useCategories();
  const { getDays, getEnglishByDisplay: getDayEnglishByDisplay } = useDays();
  const { isPro, isStarter } = useSubscription();
  const { data: allStudios = [] } = useStudios();

  const { t, i18n } = useTranslation('forms');

  const musicCategories = useMusicCategories();
  const photoCategories = usePhotoCategories();
  const photoSubCategories = usePhotoSubCategories();
  // const daysDisplay = getDays().map((day) => day.value);
  const firstDay = getDays()[0];

  // Get the display values and English values for music subcategories
  const musicSubCategoriesDisplay = getMusicSubCategories().map((cat) => cat.value);
  const firstSubCategory = getMusicSubCategories()[0];

  const createStudioMutation = useCreateStudioMutation();

  const FORM_ID = 'create-studio';

  // Count user's existing studios
  const userStudioCount = useMemo(() => {
    if (!user?._id) return 0;
    return allStudios.filter((studio) => studio.createdBy === user._id).length;
  }, [allStudios, user?._id]);

  // Check if user has paid subscription (Starter or Pro)
  const hasPaidSubscription = isPro || isStarter;

  // Load saved state on mount (before initializing useState)
  const savedState = loadFormState<{
    selectedCategories?: string[];
    selectedDisplaySubCategories?: string[];
    selectedDisplayDays?: string[];
    studioHours?: Record<string, { start: string; end: string }>;
    galleryImages?: string[];
    galleryAudioFiles?: string[];
    openingHour?: string;
    closingHour?: string;
    selectedAmenities?: string[];
    equipmentList?: Record<string, string>;
    selectedParking?: 'private' | 'street' | 'paid' | 'none';
  }>(FORM_ID);

  // States for form fields - initialize from saved state if available
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    savedState?.selectedCategories || musicCategories
  );
  const [selectedDisplaySubCategories, setSelectedDisplaySubCategories] = useState<string[]>(
    savedState?.selectedDisplaySubCategories || (firstSubCategory ? [firstSubCategory.value] : [])
  );
  const [selectedDisplayDays, setSelectedDisplayDays] = useState<string[]>(
    savedState?.selectedDisplayDays || (firstDay ? [firstDay.value] : [])
  );

  const [galleryImages, setGalleryImages] = useState<string[]>(savedState?.galleryImages || []);
  const [galleryAudioFiles, setGalleryAudioFiles] = useState<string[]>(savedState?.galleryAudioFiles || []);
  const [openingHour, setOpeningHour] = useState<string>(savedState?.openingHour || '08:00');
  const [closingHour, setClosingHour] = useState<string>(savedState?.closingHour || '18:00');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(savedState?.selectedAmenities || []);
  const [equipmentList, setEquipmentList] = useState<Record<string, string>>(savedState?.equipmentList || {});
  const [selectedParking, setSelectedParking] = useState<'private' | 'street' | 'paid' | 'none'>(
    savedState?.selectedParking || 'street'
  );

  // Policies State
  const [cancellationPolicy, setCancellationPolicy] = useState<CancellationPolicy>({});
  const [houseRules, setHouseRules] = useState<string>('');

  // Portfolio State
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});

  const { handleFileUpload } = useStudioFileUpload({
    setGalleryImages,
    setGalleryAudioFiles
  });

  // Note: Uncontrolled auto-save is disabled for stepped forms
  // Controlled state auto-save handles categories, genres, etc.
  // Form field data is collected by SteppedForm on step changes
  const { clearSavedData } = useFormAutoSaveUncontrolled({
    formId: FORM_ID,
    formRef: FORM_ID,
    enabled: false // Disabled since SteppedForm handles data collection
  });

  const [studioHours, setStudioHours] = useState<Record<string, { start: string; end: string }>>(
    savedState?.studioHours ||
      selectedDisplayDays.reduce(
        (acc, day) => {
          acc[day] = { start: openingHour, end: closingHour };
          return acc;
        },
        {} as Record<string, { start: string; end: string }>
      )
  );

  // Get English category values for comparison (language-agnostic)
  const musicCategoryEnglish = 'Music / Podcast Studio';
  const photoCategoryEnglish = 'Photo / Video Studio';
  const musicCategoryHebrew = 'סטודיו מוזיקה / פודקאסט';
  const photoCategoryHebrew = 'סטודיו צילום / וידאו';

  // Helper to check if category is music (works with both English and Hebrew)
  const isMusicCategory = (category: string): boolean => {
    return category === musicCategories[0] || category === musicCategoryEnglish || category === musicCategoryHebrew;
  };

  // Helper to convert category to current language
  const convertCategoryToCurrentLanguage = (cat: string): string => {
    // If it's the English music category, return current language's music category
    if (cat === musicCategoryEnglish || cat === 'Music / Podcast Studio') {
      return musicCategories[0];
    }
    // If it's the English photo category, return current language's photo category
    if (cat === photoCategoryEnglish || cat === 'Photo / Video Studio') {
      return photoCategories[0];
    }
    // If it's the Hebrew music category, return current language's music category
    if (cat === musicCategoryHebrew || cat === 'סטודיו מוזיקה / פודקאסט') {
      return musicCategories[0];
    }
    // If it's the Hebrew photo category, return current language's photo category
    if (cat === photoCategoryHebrew || cat === 'סטודיו צילום / וידאו') {
      return photoCategories[0];
    }
    // If it's already in current language, keep it
    if (cat === musicCategories[0] || cat === photoCategories[0]) {
      return cat;
    }
    // Fallback: keep as is
    return cat;
  };

  // Track previous language to detect actual language changes
  const previousLanguageRef = useRef(i18n.language);

  // Restore displaySubCategories based on saved categories (if saved state exists)
  // Only run once on mount
  useEffect(() => {
    if (savedState?.selectedCategories) {
      const restoredCategories = savedState.selectedCategories;

      // Convert saved categories to current language
      const updatedCategories = restoredCategories.map(convertCategoryToCurrentLanguage);

      // Update selectedCategories to current language
      setSelectedCategories(updatedCategories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update selectedCategories when i18n language actually changes (for existing selections)
  useEffect(() => {
    // Only update if language actually changed
    if (previousLanguageRef.current === i18n.language) {
      return;
    }

    setSelectedCategories((prevCategories) => {
      if (prevCategories.length === 0) {
        previousLanguageRef.current = i18n.language;
        return prevCategories;
      }

      const updatedCategories = prevCategories.map(convertCategoryToCurrentLanguage);

      // Only update if categories actually changed
      if (JSON.stringify(updatedCategories) !== JSON.stringify(prevCategories)) {
        previousLanguageRef.current = i18n.language;
        return updatedCategories;
      }

      previousLanguageRef.current = i18n.language;
      return prevCategories;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]); // Only depend on language, not category arrays

  // Controlled state object for auto-save (memoized to prevent unnecessary re-renders)
  const controlledState = useMemo(
    () => ({
      selectedCategories,
      selectedDisplaySubCategories,
      selectedDisplayDays,
      studioHours,
      galleryImages,
      galleryAudioFiles,
      openingHour,
      closingHour,
      selectedAmenities,
      equipmentList,
      selectedParking
    }),
    [
      selectedCategories,
      selectedDisplaySubCategories,
      selectedDisplayDays,
      studioHours,
      galleryImages,
      galleryAudioFiles,
      openingHour,
      closingHour,
      selectedAmenities,
      equipmentList,
      selectedParking
    ]
  );

  // Auto-save controlled state (restoreOnMount is false since we're initializing from saved state directly)
  const { clearSavedState } = useControlledStateAutoSave({
    formId: FORM_ID,
    state: controlledState,
    restoreOnMount: false // We already initialized from saved state above
  });

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
    const newSubCategories = isMusicCategory(values[0]) ? musicSubCategoriesDisplay : photoSubCategories;
    setSelectedDisplaySubCategories(newSubCategories.length > 0 ? [newSubCategories[0]] : []);
  };

  // Policies step content
  const POLICIES = [
    {
      id: 'flexible' as const,
      label: t('form.policies.flexible.label', { defaultValue: 'Flexible' }),
      description: t('form.policies.flexible.description', {
        defaultValue: 'Full refund up to 24 hours before session start time.'
      }),
      colorClass: 'policies-step__policy-card--flexible'
    },
    {
      id: 'moderate' as const,
      label: t('form.policies.moderate.label', { defaultValue: 'Moderate' }),
      description: t('form.policies.moderate.description', {
        defaultValue: 'Full refund up to 5 days before session. 50% refund up to 24h before.'
      }),
      colorClass: 'policies-step__policy-card--moderate'
    },
    {
      id: 'strict' as const,
      label: t('form.policies.strict.label', { defaultValue: 'Strict' }),
      description: t('form.policies.strict.description', {
        defaultValue: '50% refund up to 7 days before session. No refund within 7 days.'
      }),
      colorClass: 'policies-step__policy-card--strict'
    }
  ];

  const policiesContent = useMemo(
    () => (
      <div className="policies-step">
        {/* Cancellation Policy */}
        <div className="policies-step__section">
          <label className="policies-step__section-label">
            {t('form.policies.cancellation.label', { defaultValue: 'Cancellation Policy' })}
          </label>
          <div className="policies-step__policy-grid">
            {POLICIES.map((policy) => {
              const isSelected = cancellationPolicy.type === policy.id;
              return (
                <button
                  key={policy.id}
                  type="button"
                  onClick={() => setCancellationPolicy({ ...cancellationPolicy, type: policy.id })}
                  className={`policies-step__policy-card ${policy.colorClass} ${isSelected ? 'policies-step__policy-card--selected' : ''}`}
                >
                  <div className={`policies-step__radio ${isSelected ? 'policies-step__radio--selected' : ''}`}>
                    {isSelected && <div className="policies-step__radio-dot" />}
                  </div>
                  <div className="policies-step__policy-content">
                    <h3
                      className={`policies-step__policy-label ${isSelected ? 'policies-step__policy-label--selected' : ''}`}
                    >
                      {policy.label}
                    </h3>
                    <p className="policies-step__policy-description">{policy.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* House Rules */}
        <div className="policies-step__section">
          <label className="policies-step__section-label policies-step__section-label--with-icon">
            <DescriptionIcon className="policies-step__section-icon" />
            {t('form.policies.houseRules.label', { defaultValue: 'Studio Rules' })}
          </label>
          <div className="policies-step__textarea-wrapper">
            <textarea
              value={houseRules}
              onChange={(e) => setHouseRules(e.target.value)}
              placeholder={t('form.policies.houseRules.placeholder', {
                defaultValue: 'e.g. No smoking inside, No food near the console, Maximum 5 guests...'
              })}
              className="policies-step__textarea"
              rows={5}
            />
          </div>
          <div className="policies-step__info-note">
            <ErrorOutlineIcon className="policies-step__info-note-icon" />
            <p>
              {t('form.policies.houseRules.note', { defaultValue: 'Guests must agree to these rules before booking.' })}
            </p>
          </div>
        </div>
      </div>
    ),
    [t, cancellationPolicy, houseRules]
  );

  // Define form steps with Zod schemas and icons
  const steps: FormStep[] = useMemo(
    () => [
      {
        id: 'basic-info',
        title: t('form.steps.basicInfo') || 'Basic Information',
        description: t('form.steps.basicInfoDesc') || 'Enter your studio name and description',
        fieldNames: [
          'basicInfoHeader',
          'languageToggle',
          'name.en',
          'name.he',
          'subtitle.en',
          'subtitle.he',
          'description.en',
          'description.he'
        ],
        schema: studioStepSchemas['basic-info'],
        languageToggle: true,
        icon: TextFieldsIcon,
        proTip: (
          <ProTip dangerouslySetInnerHTML>
            {t('form.proTips.basicInfo', {
              defaultValue:
                "Studios with detailed descriptions in both English and Hebrew get <strong>2x more bookings</strong>. Don't forget to switch languages and fill out both!"
            })}
          </ProTip>
        )
      },
      {
        id: 'amenities-gear',
        title: t('form.steps.amenitiesGear') || 'Amenities & Gear',
        description: t('form.steps.amenitiesGearDesc') || 'Select amenities and list equipment',
        fieldNames: ['amenities', 'equipment'],
        icon: WeekendIcon,
        customContent: (
          <AmenitiesSelector
            selectedAmenities={selectedAmenities}
            onAmenitiesChange={setSelectedAmenities}
            equipment={equipmentList}
            onEquipmentChange={setEquipmentList}
          />
        )
      },
      {
        id: 'availability',
        title: t('form.steps.availability') || 'Availability',
        description: t('form.steps.availabilityDesc') || 'Set your studio hours',
        fieldNames: ['availabilityHeader', 'studioAvailability'],
        schema: studioStepSchemas.availability,
        icon: ScheduleIcon
      },
      {
        id: 'location',
        title: t('form.steps.location') || 'Location & Contact',
        description: t('form.steps.locationDesc') || 'Add address and contact information',
        fieldNames: ['locationHeader', 'address', 'phone', 'website', 'specsHeader', 'maxOccupancy', 'size', 'parking'],
        schema: studioStepSchemas.location,
        icon: LocationOnIcon
      },
      {
        id: 'files',
        title: t('form.steps.files') || 'Files & Media',
        description: t('form.steps.filesDesc') || 'Upload images for your studio',
        fieldNames: ['coverImage', 'galleryImages', 'coverAudioFile', 'galleryAudioFiles'],
        schema: studioStepSchemas.files,
        icon: PhotoLibraryIcon,
        customContent: (
          <FileUploader
            fileType="image"
            onFileUpload={async (files, type) => {
              await handleFileUpload(files, type);
            }}
            galleryFiles={galleryImages}
            isCoverShown={false}
            showPreviewBeforeUpload={false}
            onRemoveImage={(image) => {
              setGalleryImages((prev) => prev.filter((url) => url !== image));
            }}
            onReorderImages={setGalleryImages}
          />
        )
      },
      {
        id: 'portfolio',
        title: t('form.steps.portfolio') || 'Portfolio',
        description: t('form.steps.portfolioDesc') || 'Showcase your best work and social profiles',
        fieldNames: ['portfolio', 'socialLinks'],
        icon: WorkIcon,
        customContent: (
          <PortfolioStep
            portfolio={portfolio}
            onPortfolioChange={setPortfolio}
            socialLinks={socialLinks}
            onSocialLinksChange={setSocialLinks}
          />
        )
      },
      {
        id: 'policies',
        title: t('form.steps.policies') || 'Policies',
        description: t('form.steps.policiesDesc') || 'Define cancellation and booking policies',
        fieldNames: ['cancellationPolicy', 'houseRules'],
        schema: studioStepSchemas.policies,
        icon: ShieldIcon,
        customContent: policiesContent
      }
    ],
    [
      t,
      galleryImages,
      galleryAudioFiles,
      handleFileUpload,
      selectedAmenities,
      equipmentList,
      policiesContent,
      portfolio,
      socialLinks
    ]
  );

  // Initialize currentStepIndex from URL on mount (after steps are defined)
  const [currentStepIndex, setCurrentStepIndex] = useState(() => getStepFromUrl(searchParams, steps));

  // Sync currentStepIndex with URL on refresh or URL change
  useEffect(() => {
    const urlStepIndex = getStepFromUrl(searchParams, steps);
    if (urlStepIndex !== currentStepIndex) {
      setCurrentStepIndex(urlStepIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Only sync when URL changes, not when currentStepIndex changes

  const fields = [
    {
      name: 'basicInfoHeader',
      label: t('form.sections.basicInfo') || 'Basic Information',
      subtitle:
        t('form.sections.basicInfoDesc') ||
        'Give your studio a clear name and description so users know what to expect.',
      type: 'sectionHeader' as FieldType,
      icon: InfoOutlinedIcon
    },
    {
      name: 'name.en',
      label: `${t('form.name.en')} 🇺🇸`,
      type: 'text' as FieldType,
      placeholder: t('form.name.placeholder', { defaultValue: 'e.g. The Sound Garden' }),
      helperText: t('form.name.helperText')
    },
    {
      name: 'name.he',
      label: `${t('form.name.he')} 🇮🇱`,
      type: 'text' as FieldType,
      placeholder: t('form.name.placeholderHe', { defaultValue: 'לדוגמה: גן הצלילים' }),
      helperText: t('form.name.helperText')
    },
    {
      name: 'subtitle.en',
      label: `${t('form.subtitle.en')} 🇺🇸`,
      type: 'text' as FieldType,
      placeholder: t('form.subtitle.placeholder', { defaultValue: 'e.g. Professional Recording & Mixing' }),
      helperText: t('form.subtitle.helperText')
    },
    {
      name: 'subtitle.he',
      label: `${t('form.subtitle.he')} 🇮🇱`,
      type: 'text' as FieldType,
      placeholder: t('form.subtitle.placeholderHe', { defaultValue: 'לדוגמה: הקלטות ומיקס מקצועי' }),
      helperText: t('form.subtitle.helperText')
    },
    {
      name: 'description.en',
      label: `${t('form.description.en')} 🇺🇸`,
      type: 'textarea' as FieldType,
      placeholder: t('form.description.placeholder', {
        defaultValue: "Describe your studio's vibe, equipment, and what makes it unique..."
      }),
      helperText: t('form.description.helperText')
    },
    {
      name: 'description.he',
      label: `${t('form.description.he')} 🇮🇱`,
      type: 'textarea' as FieldType,
      placeholder: t('form.description.placeholderHe', {
        defaultValue: 'תארו את האווירה, הציוד ומה שמייחד את הסטודיו שלכם...'
      }),
      helperText: t('form.description.helperText')
    },
    {
      name: 'languageToggle',
      label: t('form.languageToggle.label') || 'Select language for editing',
      type: 'languageToggle' as FieldType,
      value: selectedLanguage,
      onChange: setSelectedLanguage
    },
    {
      name: 'availabilityHeader',
      label: t('form.sections.weeklySchedule') || 'Weekly Schedule',
      subtitle: t('form.sections.weeklyScheduleDesc') || 'Set your studio availability for each day.',
      type: 'sectionHeader' as FieldType,
      icon: ScheduleIcon
    },
    {
      name: 'studioAvailability',
      type: 'businessHours' as const,
      label: t('form.studioAvailability.label'),
      value: {
        days: selectedDisplayDays,
        times: selectedDisplayDays.map((day) => studioHours[day] || { start: openingHour, end: closingHour })
      },
      onChange: (value: StudioAvailability) => {
        setSelectedDisplayDays(value.days);
        setStudioHours((prev) => {
          const newHours = { ...prev };
          value.days.forEach((day, index) => {
            newHours[day] = value.times[index];
          });
          return newHours;
        });

        setOpeningHour(value.times[0]?.start || openingHour);
        setClosingHour(value.times[0]?.end || closingHour);
      }
    },
    {
      name: 'locationHeader',
      label: t('form.sections.locationContact') || 'Location & Contact',
      subtitle: t('form.sections.locationContactDesc') || 'Where can clients find and reach you?',
      type: 'sectionHeader' as FieldType,
      icon: LocationOnIcon
    },
    {
      name: 'address',
      label: t('form.address.label'),
      type: 'text' as FieldType,
      placeholder: t('form.address.placeholder')
    },
    {
      name: 'phone',
      label: t('form.customerDetails.phone.label'),
      type: 'text' as FieldType,
      placeholder: t('form.customerDetails.phone.placeholder')
    },
    {
      name: 'website',
      label: t('form.website.label') || 'Website',
      type: 'text' as FieldType,
      placeholder: t('form.website.placeholder') || 'https://example.com'
    },
    {
      name: 'specsHeader',
      label: t('form.sections.specs') || 'Specs',
      subtitle: t('form.sections.specsDesc') || 'Size and capacity details',
      type: 'sectionHeader' as FieldType,
      icon: SquareFootIcon
    },
    {
      name: 'maxOccupancy',
      label: t('form.maxOccupancy.label'),
      type: 'number' as FieldType,
      placeholder: t('form.maxOccupancy.placeholder')
    },
    {
      name: 'size',
      label: t('form.size.label') || 'Size (m²)',
      type: 'number' as FieldType,
      placeholder: t('form.size.placeholder') || 'e.g. 50'
    },
    {
      name: 'parking',
      label: t('form.parking.label') || 'Parking',
      type: 'parkingSelect' as FieldType,
      value: selectedParking,
      onChange: setSelectedParking,
      options: ['private', 'street', 'paid', 'none']
    },
    {
      name: 'coverImage',
      label: 'Cover Image',
      type: 'text' as FieldType,
      value: galleryImages[0] || undefined
    },
    {
      name: 'galleryImages',
      label: 'Gallery Images',
      type: 'text' as FieldType,
      value: galleryImages
    },
    {
      name: 'coverAudioFile',
      label: 'Cover Audio File',
      type: 'text' as FieldType,
      value: galleryAudioFiles[0] || undefined
    },
    {
      name: 'galleryAudioFiles',
      label: 'Gallery Audio Files',
      type: 'text' as FieldType,
      value: galleryAudioFiles
    },
    {
      name: 'amenities',
      label: t('form.amenities.label') || 'Amenities',
      type: 'text' as FieldType,
      value: selectedAmenities
    },
    {
      name: 'equipment',
      label: t('form.equipment.label') || 'Equipment',
      type: 'text' as FieldType,
      value: equipmentList
    }
  ];

  const handleSubmit = async (formData: StudioFormData) => {
    // Check if user is logged in
    if (!user || !user._id) {
      return toast.error(t('form.errors.loginRequired', { defaultValue: 'Please log in to create a studio.' }), {
        action: {
          label: t('buttons.log_in', { defaultValue: 'Log In' }),
          onClick: () => {
            loginWithPopup();
          }
        },
        duration: 5000
      });
    }

    const englishSubCategories = selectedDisplaySubCategories.map((subCat) => getEnglishByDisplay(subCat));

    formData.coverImage = galleryImages[0];
    formData.galleryImages = galleryImages;
    formData.coverAudioFile = galleryAudioFiles[0];
    formData.galleryAudioFiles = galleryAudioFiles;
    formData.categories = selectedCategories;
    formData.subCategories = englishSubCategories;

    formData.studioAvailability = {
      days: selectedDisplayDays.map((day) => getDayEnglishByDisplay(day)) as DayOfWeek[],
      times: selectedDisplayDays.map((day) => studioHours[day])
    };
    formData.amenities = selectedAmenities;
    // Convert categorized equipment to EquipmentCategory[] format
    formData.equipment = Object.entries(equipmentList)
      .filter(([, items]) => items.trim().length > 0)
      .map(([category, items]) => ({ category, items }));
    formData.parking = selectedParking;

    // Add cancellation policy (only include if type is selected)
    if (cancellationPolicy.type) {
      formData.cancellationPolicy = cancellationPolicy;
    }

    // Add house rules if provided
    if (houseRules.trim()) {
      formData.houseRules = houseRules.trim();
    }

    // Add portfolio if not empty
    if (portfolio.length > 0) {
      formData.portfolio = portfolio;
    }

    // Add social links if any are provided
    if (Object.values(socialLinks).some((link) => link?.trim())) {
      formData.socialLinks = socialLinks;
    }

    // Remove UI-only fields that shouldn't be sent to the API
    delete formData.languageToggle;

    // Check if user can create a studio
    // Free users (without paid subscription) are limited to 1 studio
    if (!hasPaidSubscription && userStudioCount >= 1) {
      return toast.error(
        t('form.errors.studioLimitReached', {
          defaultValue: 'Free accounts are limited to 1 studio. Please upgrade to a paid plan to create more studios.'
        })
      );
    }

    createStudioMutation.mutate(
      {
        userId: user?._id || '',
        newStudio: formData as Studio
      },
      {
        onSuccess: () => {
          // Clear saved form data and controlled state after successful submission
          clearSavedData();
          clearSavedState();
        }
      }
    );
  };

  // Reset language when step changes
  useEffect(() => {
    setSelectedLanguage('en');
  }, [currentStepIndex]);

  return (
    <section>
      {/* <h1>{t('form.AddStudioTitle')}</h1> */}

      <section className="form-wrapper create-studio-form-wrapper">
        <SteppedForm
          className="create-studio-form"
          formId={FORM_ID}
          steps={steps}
          fields={fields}
          onSubmit={handleSubmit}
          onCategoryChange={handleCategoryChange}
          submitButtonText={t('form.submit.createStudio')}
          nextButtonText={t('form.buttons.next') || 'Next'}
          previousButtonText={t('form.buttons.previous') || 'Previous'}
          selectedLanguage={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
          onStepChange={(current) => setCurrentStepIndex(current)}
        />
      </section>
    </section>
  );
};
