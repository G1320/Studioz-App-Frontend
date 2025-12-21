import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { FileUploader, SteppedForm, FieldType, FormStep } from '@shared/components';
import { getLocalUser } from '@shared/services';
import { studioStepSchemas } from '@shared/validation/schemas';
import { getStepFromUrl } from '@shared/components/forms/steppedForm/utils';
import {
  useCreateStudioMutation,
  useMusicCategories,
  usePhotoCategories,
  usePhotoSubCategories,
  useDays,
  useCategories,
  useMusicGenres,
  useGenres,
  useStudioFileUpload,
  useFormAutoSaveUncontrolled,
  useControlledStateAutoSave,
  useSubscription,
  useStudios
} from '@shared/hooks';
import { Studio } from 'src/types/index';
import { toast } from 'sonner';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';
import { loadFormState } from '@shared/utils/formAutoSaveUtils';

interface FormData {
  coverImage?: string;
  galleryImages?: string[];
  coverAudioFile?: string;
  galleryAudioFiles?: string[];
  categories?: string[];
  subCategories?: string[];
  genres?: string[];
  studioAvailability?: StudioAvailability;
  parking?: 'none' | 'free' | 'paid';
}

export const CreateStudioForm = () => {
  const user = getLocalUser();
  const { loginWithPopup } = useAuth0();
  const [searchParams] = useSearchParams();
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'he'>('en');
  const { getMusicSubCategories, getEnglishByDisplay } = useCategories();
  const { getDays, getEnglishByDisplay: getDayEnglishByDisplay } = useDays();
  const { getEnglishByDisplay: getGenreEnglishByDisplay } = useGenres();
  const { isPro, isStarter } = useSubscription();
  const { data: allStudios = [] } = useStudios();

  const { t, i18n } = useTranslation('forms');

  const musicCategories = useMusicCategories();
  const photoCategories = usePhotoCategories();
  const photoSubCategories = usePhotoSubCategories();
  const genres = useMusicGenres();
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
    selectedGenres?: string[];
    selectedDisplayDays?: string[];
    selectedParking?: 'none' | 'free' | 'paid';
    studioHours?: Record<string, { start: string; end: string }>;
    galleryImages?: string[];
    galleryAudioFiles?: string[];
    openingHour?: string;
    closingHour?: string;
  }>(FORM_ID);

  // States for form fields - initialize from saved state if available
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    savedState?.selectedCategories || musicCategories
  );
  const [displaySubCategories, setDisplaySubCategories] = useState<string[]>(musicSubCategoriesDisplay);
  const [selectedDisplaySubCategories, setSelectedDisplaySubCategories] = useState<string[]>(
    savedState?.selectedDisplaySubCategories || (firstSubCategory ? [firstSubCategory.value] : [])
  );
  const [selectedGenres, setSelectedGenres] = useState<string[]>(savedState?.selectedGenres || []);
  const [selectedDisplayDays, setSelectedDisplayDays] = useState<string[]>(
    savedState?.selectedDisplayDays || (firstDay ? [firstDay.value] : [])
  );
  const [selectedParking, setSelectedParking] = useState<'none' | 'free' | 'paid'>(
    savedState?.selectedParking || 'none'
  );

  const [galleryImages, setGalleryImages] = useState<string[]>(savedState?.galleryImages || []);
  const [galleryAudioFiles, setGalleryAudioFiles] = useState<string[]>(savedState?.galleryAudioFiles || []);
  const [openingHour, setOpeningHour] = useState<string>(savedState?.openingHour || '08:00');
  const [closingHour, setClosingHour] = useState<string>(savedState?.closingHour || '18:00');

  const { handleFileUpload } = useStudioFileUpload({
    galleryImages,
    setGalleryImages,
    galleryAudioFiles,
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

      // Set subcategories based on category
      const newSubCategories = isMusicCategory(updatedCategories[0]) ? musicSubCategoriesDisplay : photoSubCategories;
      setDisplaySubCategories(newSubCategories);
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
        // Update subcategories based on updated category
        const newSubCategories = isMusicCategory(updatedCategories[0]) ? musicSubCategoriesDisplay : photoSubCategories;
        setDisplaySubCategories(newSubCategories);

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
      selectedGenres,
      selectedDisplayDays,
      selectedParking,
      studioHours,
      galleryImages,
      galleryAudioFiles,
      openingHour,
      closingHour
    }),
    [
      selectedCategories,
      selectedDisplaySubCategories,
      selectedGenres,
      selectedDisplayDays,
      selectedParking,
      studioHours,
      galleryImages,
      galleryAudioFiles,
      openingHour,
      closingHour
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
    setDisplaySubCategories(newSubCategories);
    setSelectedDisplaySubCategories(newSubCategories.length > 0 ? [newSubCategories[0]] : []);
  };

  const handleSubCategoryChange = (values: string[]) => {
    setSelectedDisplaySubCategories(values);
  };

  const handleGenreChange = (values: string[]) => {
    setSelectedGenres(values);
  };

  const getParkingLabel = (value: string) => {
    return t(`form.parking.options.${value}`) || value.charAt(0).toUpperCase() + value.slice(1);
  };

  // Define form steps with Zod schemas
  const steps: FormStep[] = useMemo(
    () => [
      {
        id: 'basic-info',
        title: t('form.steps.basicInfo') || 'Basic Information',
        description: t('form.steps.basicInfoDesc') || 'Enter your studio name and description',
        fieldNames: [
          'name.en',
          'name.he',
          'subtitle.en',
          'subtitle.he',
          'description.en',
          'description.he',
          'languageToggle'
        ],
        schema: studioStepSchemas['basic-info'],
        languageToggle: true
      },
      {
        id: 'categories',
        title: t('form.steps.categories') || 'Categories & Genres',
        description: t('form.steps.categoriesDesc') || 'Select categories and genres',
        fieldNames: ['categories', 'subCategories', 'genres'],
        schema: studioStepSchemas.categories
      },
      {
        id: 'availability',
        title: t('form.steps.availability') || 'Availability',
        description: t('form.steps.availabilityDesc') || 'Set your studio hours',
        fieldNames: ['studioAvailability'],
        schema: studioStepSchemas.availability
      },
      {
        id: 'location',
        title: t('form.steps.location') || 'Location & Contact',
        description: t('form.steps.locationDesc') || 'Add address and contact information',
        fieldNames: ['address', 'phone'],
        schema: studioStepSchemas.location
      },
      {
        id: 'files',
        title: t('form.steps.files') || 'Files & Media',
        description: t('form.steps.filesDesc') || 'Upload images for your studio',
        fieldNames: ['coverImage', 'galleryImages', 'coverAudioFile', 'galleryAudioFiles'],
        schema: studioStepSchemas.files,
        customContent: (
          <FileUploader
            fileType="image"
            onFileUpload={handleFileUpload}
            galleryFiles={galleryImages}
            isCoverShown={false}
            showPreviewBeforeUpload={false}
          />
        )
      },
      {
        id: 'details',
        title: t('form.steps.details') || 'Details',
        description: t('form.steps.detailsDesc') || 'Set capacity and amenities',
        fieldNames: ['maxOccupancy', 'isSmokingAllowed', 'isWheelchairAccessible', 'parking'],
        schema: studioStepSchemas.details
      }
    ],
    [t, galleryImages, galleryAudioFiles, handleFileUpload]
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
      name: 'name.en',
      label: `${t('form.name.en')} 🇺🇸`,
      type: 'text' as FieldType
    },
    {
      name: 'name.he',
      label: `${t('form.name.he')} 🇮🇱`,
      type: 'text' as FieldType
    },
    {
      name: 'subtitle.en',
      label: `${t('form.subtitle.en')} 🇺🇸`,
      type: 'text' as FieldType
    },
    {
      name: 'subtitle.he',
      label: `${t('form.subtitle.he')} 🇮🇱`,
      type: 'text' as FieldType
    },
    {
      name: 'description.en',
      label: `${t('form.description.en')} 🇺🇸`,
      type: 'textarea' as FieldType
    },
    {
      name: 'description.he',
      label: `${t('form.description.he')} 🇮🇱`,
      type: 'textarea' as FieldType
    },
    {
      name: 'languageToggle',
      label: t('form.languageToggle.label') || 'Select language for editing',
      type: 'languageToggle' as FieldType,
      value: selectedLanguage,
      onChange: setSelectedLanguage
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
      label: t('form.subCategories.label') || 'Sub Categories',
      type: 'multiSelect' as FieldType,
      options: displaySubCategories,
      value: selectedDisplaySubCategories,
      onChange: handleSubCategoryChange
    },
    {
      name: 'genres',
      label: t('form.genres.label') || 'Genres',
      type: 'multiSelect' as FieldType,
      options: genres,
      value: selectedGenres,
      onChange: handleGenreChange,
      bubbleStyle: true
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
      name: 'maxOccupancy',
      label: t('form.maxOccupancy.label'),
      type: 'number' as FieldType,
      placeholder: t('form.maxOccupancy.placeholder')
    },
    {
      name: 'isSmokingAllowed',
      label: t('form.isSmokingAllowed.label'),
      type: 'checkbox' as FieldType
    },
    {
      name: 'isWheelchairAccessible',
      label: t('form.isWheelchairAccessible.label'),
      type: 'checkbox' as FieldType
    },
    {
      name: 'parking',
      label: t('form.parking.label') || 'Parking',
      type: 'select' as FieldType,
      value: selectedParking,
      onChange: setSelectedParking,
      options: ['none', 'free', 'paid'],
      displayValue: getParkingLabel(selectedParking),
      getOptionLabel: getParkingLabel
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
    }
  ];

  const handleSubmit = async (formData: FormData) => {
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
    const englishGenres = selectedGenres.map((genre) => getGenreEnglishByDisplay(genre));

    formData.coverImage = galleryImages[0];
    formData.galleryImages = galleryImages;
    formData.coverAudioFile = galleryAudioFiles[0];
    formData.galleryAudioFiles = galleryAudioFiles;
    formData.categories = selectedCategories;
    formData.subCategories = englishSubCategories;
    formData.genres = englishGenres;

    formData.studioAvailability = {
      days: selectedDisplayDays.map((day) => getDayEnglishByDisplay(day)) as DayOfWeek[],
      times: selectedDisplayDays.map((day) => studioHours[day])
    };
    formData.parking = selectedParking;

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
