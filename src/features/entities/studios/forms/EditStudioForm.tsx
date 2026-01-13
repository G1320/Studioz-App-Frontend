import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileUploader, SteppedForm, FieldType, FormStep, PortfolioStep } from '@shared/components';
import type { CancellationPolicy } from '@shared/components';
import { AmenitiesSelector } from '@shared/components/amenities-selector';
import { studioEditSchema, studioStepSchemasEdit } from '@shared/validation/schemas';
import { ZodError } from 'zod';
import { getStepFromUrl } from '@shared/components/forms/steppedForm/utils';
import WeekendIcon from '@mui/icons-material/Weekend';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ShieldIcon from '@mui/icons-material/Shield';
import DescriptionIcon from '@mui/icons-material/Description';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import WorkIcon from '@mui/icons-material/Work';
import {
  useDays,
  useMusicCategories,
  usePhotoSubCategories,
  useStudio,
  useUpdateStudioMutation,
  useCategories,
  useStudioFileUpload,
  useFormAutoSaveUncontrolled,
  useControlledStateAutoSave
} from '@shared/hooks';
import { Studio } from 'src/types/index';
import { DayOfWeek, StudioAvailability, EquipmentCategory, PortfolioItem, SocialLinks } from 'src/types/studio';

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
  is24Hours?: boolean;
  lat?: number | string;
  lng?: number | string;
  city?: string;
  parking?: 'private' | 'street' | 'paid' | 'none';
  languageToggle?: string;
  cancellationPolicy?: CancellationPolicy;
  houseRules?: string;
  portfolio?: PortfolioItem[];
  socialLinks?: SocialLinks;
  [key: string]: any; // Allow additional properties from form
}

export const EditStudioForm = () => {
  const { studioId } = useParams();
  const { data } = useStudio(studioId || '');
  const { t } = useTranslation('forms');
  const [searchParams] = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'he'>('en');

  const studio = data?.currStudio;
  const { getMusicSubCategories, getEnglishByDisplay, getDisplayByEnglish } = useCategories();
  const { getEnglishByDisplay: getDayEnglishByDisplay } = useDays();

  const musicCategories = useMusicCategories();
  const photoSubCategories = usePhotoSubCategories();
  const updateStudioMutation = useUpdateStudioMutation(studioId || '');

  // Get the English values and their display translations
  const musicSubCategoriesDisplay = getMusicSubCategories().map((cat) => cat.value);

  // Convert stored English values to display values for initial state
  const initialDisplaySubCategories =
    studio?.subCategories?.map((englishValue) => getDisplayByEnglish(englishValue)) || [];
  const initialDisplayDays = studio?.studioAvailability?.days.map((day) => getDisplayByEnglish(day)) || [];
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    studio?.categories && studio.categories.length > 0 ? [studio.categories[0]] : musicCategories
  );
  const [selectedDisplaySubCategories, setSelectedDisplaySubCategories] =
    useState<string[]>(initialDisplaySubCategories);
  const [selectedDisplayDays, setSelectedDisplayDays] = useState<string[]>(initialDisplayDays);
  const [openingHour, setOpeningHour] = useState<string>(studio?.studioAvailability?.times[0].start || '09:00');
  const [closingHour, setClosingHour] = useState<string>(studio?.studioAvailability?.times[0].end || '17:00');

  const [studioHours, setStudioHours] = useState<Record<string, { start: string; end: string }>>(
    selectedDisplayDays.reduce(
      (acc, day) => {
        acc[day] = { start: openingHour, end: closingHour };
        return acc;
      },
      {} as Record<string, { start: string; end: string }>
    )
  );

  const [galleryImages, setGalleryImages] = useState<string[]>(studio?.galleryImages || []);
  const [coverImage, setCoverImage] = useState<string>(studio?.coverImage || '');
  const [galleryAudioFiles, setGalleryAudioFiles] = useState<string[]>(studio?.galleryAudioFiles || []);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(studio?.amenities || []);
  // Convert EquipmentCategory[] to Record for form state
  const [equipmentList, setEquipmentList] = useState<Record<string, string>>(() => {
    if (!studio?.equipment?.length) return {};
    // Handle new EquipmentCategory[] format
    if (typeof studio.equipment[0] === 'object') {
      return (studio.equipment as EquipmentCategory[]).reduce(
        (acc, cat) => {
          acc[cat.category] = cat.items;
          return acc;
        },
        {} as Record<string, string>
      );
    }
    // Backward compatibility: if it's still a flat array (old data)
    return { other: (studio.equipment as unknown as string[]).join('\n') };
  });
  const [selectedParking, setSelectedParking] = useState<'private' | 'street' | 'paid' | 'none'>(
    (studio?.parking as 'private' | 'street' | 'paid' | 'none') || 'street'
  );
  const [is24Hours] = useState<boolean>(studio?.is24Hours || false);

  // Policies State
  const [cancellationPolicy, setCancellationPolicy] = useState<CancellationPolicy>(
    (studio as any)?.cancellationPolicy || {}
  );
  const [houseRules, setHouseRules] = useState<string>((studio as any)?.houseRules || '');

  // Portfolio State
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(studio?.portfolio || []);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(studio?.socialLinks || {});

  const { handleFileUpload } = useStudioFileUpload({
    setGalleryImages,
    setGalleryAudioFiles
  });

  const FORM_ID = `edit-studio-${studioId}`;
  // Note: Uncontrolled auto-save is disabled for stepped forms
  // Controlled state auto-save handles categories, genres, etc.
  // Form field data is collected by SteppedForm on step changes
  const { clearSavedData } = useFormAutoSaveUncontrolled({
    formId: FORM_ID,
    formRef: FORM_ID,
    enabled: false // Disabled since SteppedForm handles data collection
  });

  // Controlled state object for auto-save
  const controlledState = {
    selectedCategories,
    selectedDisplaySubCategories,
    selectedDisplayDays,
    studioHours,
    galleryImages,
    coverImage,
    galleryAudioFiles,
    openingHour,
    closingHour
  };

  const handleRemoveImage = (image: string) => {
    setGalleryImages((prev) => prev.filter((url) => url !== image));
    if (coverImage === image) {
      setCoverImage('');
    }
  };

  // Auto-save controlled state
  const { clearSavedState } = useControlledStateAutoSave({
    formId: FORM_ID,
    state: controlledState,
    onRestore: (restored) => {
      // Only restore if we have saved data (don't overwrite initial studio data on first load)
      // Restore all state values, but use studio data as fallback
      setSelectedCategories(
        restored.selectedCategories ||
          (studio?.categories && studio.categories.length > 0 ? [studio.categories[0]] : musicCategories)
      );
      setSelectedDisplayDays(restored.selectedDisplayDays || initialDisplayDays);
      setStudioHours(restored.studioHours || {});
      setGalleryImages(restored.galleryImages || studio?.galleryImages || []);
      setCoverImage(restored.coverImage || studio?.coverImage || '');
      setGalleryAudioFiles(restored.galleryAudioFiles || studio?.galleryAudioFiles || []);
      setOpeningHour(restored.openingHour || studio?.studioAvailability?.times[0]?.start || '09:00');
      setClosingHour(restored.closingHour || studio?.studioAvailability?.times[0]?.end || '17:00');

      // Restore selectedDisplaySubCategories, but validate against available options
      const restoredCategories =
        restored.selectedCategories ||
        (studio?.categories && studio.categories.length > 0 ? [studio.categories[0]] : musicCategories);
      const newSubCategories = restoredCategories.includes(`${musicCategories}`)
        ? musicSubCategoriesDisplay
        : photoSubCategories;
      const restoredSubCategories = restored.selectedDisplaySubCategories || initialDisplaySubCategories;
      const validSubCategories = restoredSubCategories.filter((subCat) => newSubCategories.includes(subCat));
      setSelectedDisplaySubCategories(
        validSubCategories.length > 0
          ? validSubCategories
          : initialDisplaySubCategories.length > 0
            ? initialDisplaySubCategories
            : newSubCategories.length > 0
              ? [newSubCategories[0]]
              : []
      );
    }
  });

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
    const newSubCategories = values.includes(`${musicCategories}`) ? musicSubCategoriesDisplay : photoSubCategories;
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

  // Define form steps with Zod schemas (same structure as CreateStudioForm)
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
        schema: studioStepSchemasEdit['basic-info'],
        languageToggle: true
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
        fieldNames: ['availabilityHeader', 'is24Hours', 'studioAvailability'],
        schema: studioStepSchemasEdit.availability
      },
      {
        id: 'location',
        title: t('form.steps.location') || 'Location & Contact',
        description: t('form.steps.locationDesc') || 'Add address and contact information',
        fieldNames: ['locationHeader', 'address', 'phone', 'website', 'specsHeader', 'maxOccupancy', 'size', 'parking'],
        schema: studioStepSchemasEdit.location
      },
      {
        id: 'files',
        title: t('form.steps.files') || 'Files & Media',
        description: t('form.steps.filesDesc') || 'Upload images for your studio',
        fieldNames: ['coverImage', 'galleryImages', 'coverAudioFile', 'galleryAudioFiles'],
        schema: studioStepSchemasEdit.files,
        icon: PhotoLibraryIcon,
        customContent: (
          <FileUploader
            fileType="image"
            onFileUpload={async (files, type) => {
              await handleFileUpload(files, type);
            }}
            galleryFiles={galleryImages}
            isCoverShown={true}
            onRemoveImage={handleRemoveImage}
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
        schema: studioStepSchemasEdit.policies,
        icon: ShieldIcon,
        customContent: policiesContent
      }
    ],
    [
      t,
      galleryImages,
      handleFileUpload,
      handleRemoveImage,
      selectedAmenities,
      equipmentList,
      policiesContent,
      portfolio,
      socialLinks
    ]
  );

  // Initialize currentStepIndex from URL on mount (after steps are defined)
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

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
      value: studio?.name.en,
      placeholder: t('form.name.placeholder', { defaultValue: 'e.g. The Sound Garden' }),
      helperText: t('form.name.helperText'),
      maxLength: 50,
      showCharCounter: true
    },
    {
      name: 'name.he',
      label: `${t('form.name.he')} 🇮🇱`,
      type: 'text' as FieldType,
      value: studio?.name.he,
      placeholder: t('form.name.placeholderHe', { defaultValue: 'לדוגמה: גן הצלילים' }),
      helperText: t('form.name.helperText'),
      maxLength: 50,
      showCharCounter: true
    },
    {
      name: 'subtitle.en',
      label: `${t('form.subtitle.en')} 🇺🇸`,
      type: 'text' as FieldType,
      value: studio?.subtitle?.en,
      placeholder: t('form.subtitle.placeholder', { defaultValue: 'e.g. Professional Recording & Mixing' }),
      helperText: t('form.subtitle.helperText'),
      maxLength: 100,
      showCharCounter: true
    },
    {
      name: 'subtitle.he',
      label: `${t('form.subtitle.he')} 🇮🇱`,
      type: 'text' as FieldType,
      value: studio?.subtitle?.he,
      placeholder: t('form.subtitle.placeholderHe', { defaultValue: 'לדוגמה: הקלטות ומיקס מקצועי' }),
      helperText: t('form.subtitle.helperText'),
      maxLength: 100,
      showCharCounter: true
    },
    {
      name: 'description.en',
      label: `${t('form.description.en')} 🇺🇸`,
      type: 'textarea' as FieldType,
      value: studio?.description?.en,
      placeholder: t('form.description.placeholder', {
        defaultValue: "Describe your studio's vibe, equipment, and what makes it unique..."
      }),
      helperText: t('form.description.helperText'),
      maxLength: 1000,
      showCharCounter: true
    },
    {
      name: 'description.he',
      label: `${t('form.description.he')} 🇮🇱`,
      type: 'textarea' as FieldType,
      value: studio?.description?.he,
      placeholder: t('form.description.placeholderHe', {
        defaultValue: 'תארו את האווירה, הציוד ומה שמייחד את הסטודיו שלכם...'
      }),
      helperText: t('form.description.helperText'),
      maxLength: 1000,
      showCharCounter: true
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
      value: studio?.address,
      placeholder: t('form.address.placeholder')
    },
    {
      name: 'phone',
      label: t('form.customerDetails.phone.label'),
      type: 'text' as FieldType,
      value: studio?.phone,
      placeholder: t('form.customerDetails.phone.placeholder')
    },
    {
      name: 'website',
      label: t('form.website.label') || 'Website',
      type: 'text' as FieldType,
      value: studio?.website,
      placeholder: t('form.website.placeholder') || 'https://example.com'
    },
    {
      name: 'coverImage',
      label: 'Cover Image',
      type: 'text' as FieldType,
      value: coverImage || galleryImages[0] || undefined
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
      value: studio?.maxOccupancy,
      placeholder: t('form.maxOccupancy.placeholder')
    },
    {
      name: 'size',
      label: t('form.size.label') || 'Size (m²)',
      type: 'number' as FieldType,
      value: studio?.size,
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
    const englishSubCategories = selectedDisplaySubCategories.map((displayValue) => getEnglishByDisplay(displayValue));

    // Enrich form data with controlled state
    formData.coverImage = coverImage || studio?.coverImage || '';
    formData.galleryImages = galleryImages.length > 0 ? galleryImages : studio?.galleryImages || [];
    formData.categories = selectedCategories;
    formData.subCategories = englishSubCategories;
    formData.galleryAudioFiles = galleryAudioFiles;

    // Ensure studioAvailability has valid days and times
    const availabilityDays = selectedDisplayDays.map((day) => getDayEnglishByDisplay(day)) as DayOfWeek[];
    const availabilityTimes = selectedDisplayDays.map((day) => studioHours[day]).filter(Boolean);

    formData.studioAvailability = {
      days: availabilityDays.length > 0 ? availabilityDays : studio?.studioAvailability?.days || [],
      times:
        availabilityTimes.length > 0
          ? availabilityTimes
          : studio?.studioAvailability?.times || [{ start: '09:00', end: '17:00' }]
    };

    formData.amenities = selectedAmenities.length > 0 ? selectedAmenities : studio?.amenities || [];
    formData.is24Hours = is24Hours;
    // Convert categorized equipment to EquipmentCategory[] format
    const equipmentCategories = Object.entries(equipmentList)
      .filter(([, items]) => items.trim().length > 0)
      .map(([category, items]) => ({ category, items }));
    formData.equipment = equipmentCategories.length > 0 ? equipmentCategories : studio?.equipment || [];
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

    // Ensure non-controlled fields are preserved from existing studio if step wasn't visited
    // These fields are in steps that may not have been visited during editing
    if (formData.maxOccupancy === undefined || formData.maxOccupancy === null || formData.maxOccupancy === '') {
      formData.maxOccupancy = studio?.maxOccupancy;
    } else if (typeof formData.maxOccupancy === 'string') {
      formData.maxOccupancy = parseInt(formData.maxOccupancy, 10) || studio?.maxOccupancy;
    }

    if (formData.size === undefined || formData.size === null || formData.size === '') {
      formData.size = studio?.size;
    } else if (typeof formData.size === 'string') {
      formData.size = parseInt(formData.size, 10) || studio?.size;
    }

    if (!formData.address || formData.address === '') {
      formData.address = studio?.address || '';
    }

    if (!formData.phone || formData.phone === '') {
      formData.phone = studio?.phone || '';
    }

    if (!formData.website || formData.website === '') {
      formData.website = studio?.website || '';
    }

    // Fix type conversions
    // Convert lat/lng from strings to numbers (from GenericForm)
    if (formData.lat && typeof formData.lat === 'string') {
      formData.lat = parseFloat(formData.lat) || studio?.lat || undefined;
    } else if (!formData.lat) {
      formData.lat = studio?.lat;
    }

    if (formData.lng && typeof formData.lng === 'string') {
      formData.lng = parseFloat(formData.lng) || studio?.lng || undefined;
    } else if (!formData.lng) {
      formData.lng = studio?.lng;
    }

    // Ensure city is set (use existing studio city or extract from address if needed)
    if (!formData.city || formData.city === '') {
      formData.city = studio?.city || '';
    }

    // Ensure Hebrew fields are preserved from existing studio if not provided in formData
    // Merge name object to preserve both English and Hebrew
    formData.name = {
      en: formData.name?.en || studio?.name?.en || '',
      he: formData.name?.he || studio?.name?.he || ''
    };

    // Merge subtitle object to preserve both English and Hebrew
    formData.subtitle = {
      en: formData.subtitle?.en || studio?.subtitle?.en || '',
      he: formData.subtitle?.he || studio?.subtitle?.he || ''
    };

    // Merge description object to preserve both English and Hebrew
    formData.description = {
      en: formData.description?.en || studio?.description?.en || '',
      he: formData.description?.he || studio?.description?.he || ''
    };

    // Remove UI-only fields that shouldn't be sent to the API
    delete formData.languageToggle;

    // Validate enriched data
    try {
      studioEditSchema.parse(formData);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error('Validation failed:', error);
        console.error('Form data:', formData);
        // Errors will be shown by the form component
        return;
      }
      throw error;
    }

    updateStudioMutation.mutate(formData as Studio, {
      onSuccess: () => {
        // Clear saved form data and controlled state after successful submission
        clearSavedData();
        clearSavedState();
      }
    });
  };

  // Reset language when step changes
  useEffect(() => {
    setSelectedLanguage('en');
  }, [currentStepIndex]);

  // Guard: Don't render form until studio data is loaded
  // Must be after all hooks to maintain hook order
  if (!studio) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <section className="form-wrapper edit-studio-form-wrapper">
        <SteppedForm
          className="edit-studio-form"
          formId={FORM_ID}
          steps={steps}
          fields={fields}
          onSubmit={handleSubmit}
          onCategoryChange={handleCategoryChange}
          submitButtonText={t('form.submit.editStudio')}
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
