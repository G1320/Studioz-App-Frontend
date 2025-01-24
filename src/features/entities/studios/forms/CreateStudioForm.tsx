import { useState } from 'react';
import { FileUploader, GenericForm, FieldType } from '@shared/components';
import { getLocalUser, uploadFile } from '@shared/services';
import {
  useCreateStudioMutation,
  useMusicCategories,
  usePhotoCategories,
  usePhotoSubCategories,
  useDays,
  useCategories
} from '@shared/hooks';
import { Studio } from 'src/types/index';
import { toast } from 'sonner';
import { arraysEqual } from '@shared/utils';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';
import { useTranslation } from 'react-i18next';

interface FormData {
  coverImage?: string;
  galleryImages?: string[];
  coverAudioFile?: string;
  galleryAudioFiles?: string[];
  categories?: string[];
  subCategories?: string[];
  studioAvailability?: StudioAvailability;
}

export const CreateStudioForm = () => {
  const user = getLocalUser();
  const { getMusicSubCategories, getEnglishByDisplay } = useCategories();
  const { getDays, getEnglishByDisplay: getDayEnglishByDisplay } = useDays();

  const { t } = useTranslation('forms');

  const musicCategories = useMusicCategories();
  const photoCategories = usePhotoCategories();
  const photoSubCategories = usePhotoSubCategories();
  // const daysDisplay = getDays().map((day) => day.value);
  const firstDay = getDays()[0];

  // Get the display values and English values for music subcategories
  const musicSubCategoriesDisplay = getMusicSubCategories().map((cat) => cat.value);
  const firstSubCategory = getMusicSubCategories()[0];

  const createStudioMutation = useCreateStudioMutation();

  // States for form fields
  const [selectedCategories, setSelectedCategories] = useState<string[]>(musicCategories);
  const [displaySubCategories, setDisplaySubCategories] = useState<string[]>(musicSubCategoriesDisplay);
  const [selectedDisplaySubCategories, setSelectedDisplaySubCategories] = useState<string[]>(
    firstSubCategory ? [firstSubCategory.value] : []
  );
  const [selectedDisplayDays, setSelectedDisplayDays] = useState<string[]>(firstDay ? [firstDay.value] : []);

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryAudioFiles, setGalleryAudioFiles] = useState<string[]>([]);
  const [openingHour, setOpeningHour] = useState<string>('08:00');
  const [closingHour, setClosingHour] = useState<string>('18:00');

  const [studioHours, setStudioHours] = useState<Record<string, { start: string; end: string }>>(
    selectedDisplayDays.reduce(
      (acc, day) => {
        acc[day] = { start: openingHour, end: closingHour };
        return acc;
      },
      {} as Record<string, { start: string; end: string }>
    )
  );

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
    const newSubCategories = values.includes(`${musicCategories}`) ? musicSubCategoriesDisplay : photoSubCategories;
    setDisplaySubCategories(newSubCategories);
    setSelectedDisplaySubCategories(newSubCategories.length > 0 ? [newSubCategories[0]] : []);
  };

  const handleSubCategoryChange = (values: string[]) => {
    setSelectedDisplaySubCategories(values);
  };

  const fields = [
    {
      name: 'name.en',
      label: t('form.name.en'),
      type: 'text' as FieldType
    },
    {
      name: 'name.he',
      label: t('form.name.he'),
      type: 'text' as FieldType
    },
    {
      name: 'subtitle.en',
      label: t('form.subtitle.en'),
      type: 'text' as FieldType
    },
    {
      name: 'subtitle.he',
      label: t('form.subtitle.he'),
      type: 'text' as FieldType
    },
    {
      name: 'description.en',
      label: t('form.description.en'),
      type: 'textarea' as FieldType
    },
    {
      name: 'description.he',
      label: t('form.description.he'),
      type: 'textarea' as FieldType
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
      label: arraysEqual(selectedCategories, musicCategories) ? [musicCategories] : [photoCategories],
      type: 'multiSelect' as FieldType,
      options: displaySubCategories,
      value: selectedDisplaySubCategories,
      onChange: handleSubCategoryChange
    },
    {
      name: 'studioAvailability',
      type: 'businessHours' as const,
      label: t('form.studioAvailability.label'),
      value: { days: [], times: [{ start: '09:00', end: '17:00' }] },
      onChange: (value: StudioAvailability) => {
        setSelectedDisplayDays(value.days);
        setStudioHours((prev) => {
          const newHours = { ...prev };
          value.days.forEach((day, index) => {
            newHours[day] = value.times[index];
          });
          return newHours;
        });

        setOpeningHour(value.times[0]?.start);
        setClosingHour(value.times[0]?.end);
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
    }
  ];

  const handleSubmit = async (formData: FormData) => {
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

    if (!user?.subscriptionId || user?.subscriptionStatus !== 'ACTIVE') {
      return toast.error('Please purchase a subscription before creating a studio');
    }

    createStudioMutation.mutate({
      userId: user?._id || '',
      newStudio: formData as Studio
    });
  };

  const handleFileUpload = async (files: File[], type: string) => {
    const results = await Promise.all(files.map(async (file) => await uploadFile(file)));
    const fileUrls = results.map((result) => result.secure_url);

    if (type === 'image') {
      if (files.length === 1) {
        return toast.success('Cover image uploaded successfully');
      }
      setGalleryImages(fileUrls);
      toast.success('Gallery images uploaded successfully');
    } else if (type === 'audio') {
      setGalleryAudioFiles(fileUrls);
      toast.success('Audio files uploaded successfully');
    }
  };

  return (
    <section>
      <h1>{t('form.AddStudioTitle')}</h1>

      <FileUploader
        fileType="image"
        onFileUpload={handleFileUpload}
        galleryFiles={galleryImages}
        isCoverShown={false}
      />
      <section className="form-wrapper create-studio-form-wrapper">
        <GenericForm
          className="create-studio-form"
          fields={fields}
          onSubmit={handleSubmit}
          onCategoryChange={handleCategoryChange}
        />
      </section>
    </section>
  );
};
