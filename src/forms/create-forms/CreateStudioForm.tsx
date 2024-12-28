import { useState } from 'react';
import { FileUploader, GenericForm, FieldType } from '@components/index';
import { getLocalUser, uploadFile } from '@services/index';
import {
  useCreateStudioMutation,
  useMusicCategories,
  usePhotoCategories,
  usePhotoSubCategories,
  useDays,
  useCategories
} from '@hooks/index';
import { Studio } from 'src/types/index';
import { toast } from 'sonner';
import { arraysEqual } from '@utils/compareArrays';
import { DayOfWeek, StudioAvailability } from 'src/types/studio';

interface FormData {
  coverImage?: string;
  galleryImages?: string[];
  coverAudioFile?: string;
  galleryAudioFiles?: string[];
  categories?: string[];
  subCategories?: string[];
  studioAvailability?: StudioAvailability;
  paypalMerchantId?: string;
}

export const CreateStudioForm = () => {
  const user = getLocalUser();
  const { getMusicSubCategories, getEnglishByDisplay } = useCategories();
  const { getDays, getEnglishByDisplay: getDayEnglishByDisplay } = useDays();

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
    { name: 'name.en', label: 'English Name', type: 'text' as FieldType },
    { name: 'name.he', label: 'Hebrew Name', type: 'text' as FieldType },
    { name: 'subtitle.en', label: 'English Subtitle', type: 'text' as FieldType },
    { name: 'subtitle.he', label: 'Hebrew Subtitle', type: 'text' as FieldType },
    { name: 'description.en', label: 'English Description', type: 'textarea' as FieldType },
    { name: 'description.he', label: 'Hebrew Description', type: 'textarea' as FieldType },
    {
      name: 'categories',
      label: 'Category',
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
      label: 'Business Hours',
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
    { name: 'address', label: 'Address', type: 'text' as FieldType },
    { name: 'maxOccupancy', label: 'Max Occupancy', type: 'number' as FieldType },
    { name: 'isSmokingAllowed', label: 'Smoking Allowed', type: 'checkbox' as FieldType },
    { name: 'isWheelchairAccessible', label: 'Wheelchair Accessible', type: 'checkbox' as FieldType }
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
    formData.paypalMerchantId = user?.paypalMerchantId || '';

    if (!user?.paypalMerchantId || user?.paypalOnboardingStatus !== 'COMPLETED') {
      return toast.error('Please complete PayPal onboarding process before creating a studio');
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
