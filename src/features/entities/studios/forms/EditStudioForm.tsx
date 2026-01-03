import { useState, useMemo, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FileUploader, SteppedForm, FieldType, FormStep } from '@shared/components';
import { AmenitiesSelector } from '@shared/components/amenities-selector';
import { studioEditSchema, studioStepSchemasEdit } from '@shared/validation/schemas';
import { ZodError } from 'zod';
import { getStepFromUrl } from '@shared/components/forms/steppedForm/utils';
import WeekendIcon from '@mui/icons-material/Weekend';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CategoryIcon from '@mui/icons-material/Category';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
  useDays,
  useMusicCategories,
  usePhotoCategories,
  usePhotoSubCategories,
  useStudio,
  useUpdateStudioMutation,
  useCategories,
  useMusicGenres,
  useGenres,
  useStudioFileUpload,
  useFormAutoSaveUncontrolled,
  useControlledStateAutoSave
} from '@shared/hooks';
import { Studio } from 'src/types/index';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';

interface StudioFormData {
  coverImage?: string;
  galleryImages?: string[];
  coverAudioFile?: string;
  galleryAudioFiles?: string[];
  categories?: string[];
  subCategories?: string[];
  genres?: string[];
  amenities?: string[];
  equipment?: string[];
  studioAvailability?: StudioAvailability;
  lat?: number | string;
  lng?: number | string;
  city?: string;
  parking?: 'private' | 'street' | 'paid' | 'none';
  languageToggle?: string;
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
  const { getDisplayByEnglish: getGenreDisplayByEnglish, getEnglishByDisplay: getGenreEnglishByDisplay } = useGenres();

  const musicCategories = useMusicCategories();
  const photoCategories = usePhotoCategories();
  const photoSubCategories = usePhotoSubCategories();
  const genres = useMusicGenres();
  const updateStudioMutation = useUpdateStudioMutation(studioId || '');

  // Get the English values and their display translations
  const musicSubCategoriesDisplay = getMusicSubCategories().map((cat) => cat.value);

  // Convert stored English values to display values for initial state
  const initialDisplaySubCategories =
    studio?.subCategories?.map((englishValue) => getDisplayByEnglish(englishValue)) || [];
  const initialDisplayDays = studio?.studioAvailability?.days.map((day) => getDisplayByEnglish(day)) || [];
  const initialDisplayGenres = studio?.genres?.map((englishValue) => getGenreDisplayByEnglish(englishValue)) || [];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    studio?.categories && studio.categories.length > 0 ? [studio.categories[0]] : musicCategories
  );
  const [displaySubCategories, setDisplaySubCategories] = useState<string[]>(musicSubCategoriesDisplay);
  const [selectedDisplaySubCategories, setSelectedDisplaySubCategories] =
    useState<string[]>(initialDisplaySubCategories);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(initialDisplayGenres);
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
  const [equipmentList, setEquipmentList] = useState<string>(studio?.equipment?.join('\n') || '');
  const [selectedParking, setSelectedParking] = useState<'private' | 'street' | 'paid' | 'none'>(
    (studio?.parking as 'private' | 'street' | 'paid' | 'none') || 'street'
  );

  const { handleFileUpload } = useStudioFileUpload({
    galleryImages,
    setGalleryImages,
    galleryAudioFiles,
    setGalleryAudioFiles,
    coverImage,
    setCoverImage,
    handleCoverImageSeparately: true
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
    selectedGenres,
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
      setSelectedGenres(restored.selectedGenres || initialDisplayGenres);
      setSelectedDisplayDays(restored.selectedDisplayDays || initialDisplayDays);
      setStudioHours(restored.studioHours || {});
      setGalleryImages(restored.galleryImages || studio?.galleryImages || []);
      setCoverImage(restored.coverImage || studio?.coverImage || '');
      setGalleryAudioFiles(restored.galleryAudioFiles || studio?.galleryAudioFiles || []);
      setOpeningHour(restored.openingHour || studio?.studioAvailability?.times[0]?.start || '09:00');
      setClosingHour(restored.closingHour || studio?.studioAvailability?.times[0]?.end || '17:00');

      // Handle displaySubCategories - it's derived from selectedCategories
      const restoredCategories =
        restored.selectedCategories ||
        (studio?.categories && studio.categories.length > 0 ? [studio.categories[0]] : musicCategories);
      const newSubCategories = restoredCategories.includes(`${musicCategories}`)
        ? musicSubCategoriesDisplay
        : photoSubCategories;
      setDisplaySubCategories(newSubCategories);

      // Restore selectedDisplaySubCategories, but validate against available options
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
    setDisplaySubCategories(newSubCategories);
    setSelectedDisplaySubCategories(newSubCategories.length > 0 ? [newSubCategories[0]] : []);
  };

  const handleSubCategoryChange = (values: string[]) => {
    setSelectedDisplaySubCategories(values);
  };

  const handleGenreChange = (values: string[]) => {
    setSelectedGenres(values);
  };

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
        id: 'categories',
        title: t('form.steps.categories') || 'Categories & Genres',
        description: t('form.steps.categoriesDesc') || 'Select categories and genres',
        fieldNames: ['categoriesHeader', 'categories', 'subCategories', 'genresHeader', 'genres'],
        schema: studioStepSchemasEdit.categories
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
        fieldNames: ['studioAvailability'],
        schema: studioStepSchemasEdit.availability
      },
      {
        id: 'location',
        title: t('form.steps.location') || 'Location & Contact',
        description: t('form.steps.locationDesc') || 'Add address and contact information',
        fieldNames: [
          'locationHeader',
          'address',
          'phone',
          'specsHeader',
          'maxOccupancy',
          'size',
          'parking'
        ],
        schema: studioStepSchemasEdit.location
      },
      {
        id: 'files',
        title: t('form.steps.files') || 'Files & Media',
        description: t('form.steps.filesDesc') || 'Upload images for your studio',
        fieldNames: ['coverImage', 'galleryImages', 'coverAudioFile', 'galleryAudioFiles'],
        schema: studioStepSchemasEdit.files,
        customContent: (
          <>
            <div className="section-header">
              <div className="section-header__title-row">
                <PhotoLibraryIcon className="section-header__icon" />
                <h3 className="section-header__title">{t('form.sections.studioPhotos') || 'Studio Photos'}</h3>
              </div>
              <p className="section-header__subtitle">
                {t('form.sections.studioPhotosDesc') || 'Add high quality photos'}
              </p>
            </div>
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
          </>
        )
      }
    ],
    [t, galleryImages, handleFileUpload, handleRemoveImage, selectedAmenities, equipmentList]
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
      helperText: t('form.name.helperText')
    },
    {
      name: 'name.he',
      label: `${t('form.name.he')} 🇮🇱`,
      type: 'text' as FieldType,
      value: studio?.name.he,
      placeholder: t('form.name.placeholderHe', { defaultValue: 'לדוגמה: גן הצלילים' }),
      helperText: t('form.name.helperText')
    },
    {
      name: 'subtitle.en',
      label: `${t('form.subtitle.en')} 🇺🇸`,
      type: 'text' as FieldType,
      value: studio?.subtitle?.en,
      placeholder: t('form.subtitle.placeholder', { defaultValue: 'e.g. Professional Recording & Mixing' }),
      helperText: t('form.subtitle.helperText')
    },
    {
      name: 'subtitle.he',
      label: `${t('form.subtitle.he')} 🇮🇱`,
      type: 'text' as FieldType,
      value: studio?.subtitle?.he,
      placeholder: t('form.subtitle.placeholderHe', { defaultValue: 'לדוגמה: הקלטות ומיקס מקצועי' }),
      helperText: t('form.subtitle.helperText')
    },
    {
      name: 'description.en',
      label: `${t('form.description.en')} 🇺🇸`,
      type: 'textarea' as FieldType,
      value: studio?.description?.en,
      placeholder: t('form.description.placeholder', {
        defaultValue: "Describe your studio's vibe, equipment, and what makes it unique..."
      }),
      helperText: t('form.description.helperText')
    },
    {
      name: 'description.he',
      label: `${t('form.description.he')} 🇮🇱`,
      type: 'textarea' as FieldType,
      value: studio?.description?.he,
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
      name: 'categoriesHeader',
      label: t('form.sections.categories') || 'Categories',
      subtitle: t('form.sections.categoriesDesc') || 'Select all relevant categories for your studio.',
      type: 'sectionHeader' as FieldType,
      icon: CategoryIcon
    },
    {
      name: 'categories',
      label: t('form.categories.label'),
      type: 'select' as FieldType,
      options: [musicCategories, photoCategories],
      value: selectedCategories,
      onChange: handleCategoryChange
    },
    {
      name: 'subCategories',
      label: '',
      type: 'multiSelect' as FieldType,
      options: displaySubCategories,
      value: selectedDisplaySubCategories,
      onChange: handleSubCategoryChange,
      initialVisibleCount: 12,
      showAllLabel: t('form.subCategories.showAll', 'Show All'),
      showLessLabel: t('form.subCategories.showLess', 'Show Less'),
      className: 'subcategories-plain'
    },
    {
      name: 'genresHeader',
      label: t('form.sections.genres') || 'Genres',
      subtitle: t('form.sections.genresDesc') || 'Select the music styles you specialize in.',
      type: 'sectionHeader' as FieldType,
      icon: LibraryMusicIcon
    },
    {
      name: 'genres',
      label: '',
      type: 'multiSelect' as FieldType,
      options: genres,
      value: selectedGenres,
      onChange: handleGenreChange,
      bubbleStyle: true,
      initialVisibleCount: 14,
      showAllLabel: t('form.genres.showAll', { defaultValue: 'Show All' }),
      showLessLabel: t('form.genres.showLess', { defaultValue: 'Show Less' })
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
    const englishGenres = selectedGenres.map((genre) => getGenreEnglishByDisplay(genre));

    // Enrich form data with controlled state
    formData.coverImage = coverImage || studio?.coverImage || '';
    formData.galleryImages = galleryImages.length > 0 ? galleryImages : studio?.galleryImages || [];
    formData.categories = selectedCategories;
    formData.subCategories = englishSubCategories;
    formData.genres = englishGenres.length > 0 ? englishGenres : studio?.genres || [];
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
    // Convert equipment string to array (split by newlines, filter empty lines)
    formData.equipment = equipmentList
      ? equipmentList
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)
      : studio?.equipment || [];
    formData.parking = selectedParking;

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
