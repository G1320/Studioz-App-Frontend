import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileUploader, GenericForm, FieldType } from '@shared/components';
import {
  useDays,
  useMusicCategories,
  usePhotoCategories,
  usePhotoSubCategories,
  useStudio,
  useUpdateStudioMutation,
  useCategories,
  useMusicGenres,
  useGenres
} from '@shared/hooks';
import { uploadFile } from '@shared/services';
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
  genres?: string[];
  studioAvailability?: StudioAvailability;
  parking?: 'none' | 'free' | 'paid';
}

export const EditStudioForm = () => {
  const { studioId } = useParams();
  const { data } = useStudio(studioId || '');
  const { t } = useTranslation('forms');

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
  const [selectedParking, setSelectedParking] = useState<'none' | 'free' | 'paid'>(studio?.parking || 'none');
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

  const getParkingLabel = (value: string) => {
    return t(`form.parking.options.${value}`) || value.charAt(0).toUpperCase() + value.slice(1);
  };
  const fields = [
    {
      name: 'name.en',
      label: t('form.name.en'),
      type: 'text' as FieldType,
      value: studio?.name.en
    },
    {
      name: 'name.he',
      label: t('form.name.he'),
      type: 'text' as FieldType,
      value: studio?.name.he
    },
    {
      name: 'subtitle.en',
      label: t('form.subtitle.en'),
      type: 'text' as FieldType,
      value: studio?.subtitle?.en
    },
    {
      name: 'subtitle.he',
      label: t('form.subtitle.he'),
      type: 'text' as FieldType,
      value: studio?.subtitle?.he
    },
    {
      name: 'description.en',
      label: t('form.description.en'),
      type: 'textarea' as FieldType,
      value: studio?.description?.en
    },
    {
      name: 'description.he',
      label: t('form.description.he'),
      type: 'textarea' as FieldType,
      value: studio?.description?.he
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
      value: studio?.studioAvailability || { days: [], times: [{ start: '09:00', end: '17:00' }] },
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
      value: studio?.address,
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
      value: studio?.maxOccupancy,
      placeholder: t('form.maxOccupancy.placeholder')
    },
    {
      name: 'isSmokingAllowed',
      label: t('form.isSmokingAllowed.label'),
      type: 'checkbox' as FieldType,
      value: studio?.isSmokingAllowed
    },
    {
      name: 'isWheelchairAccessible',
      label: t('form.isWheelchairAccessible.label'),
      type: 'checkbox' as FieldType,
      value: studio?.isWheelchairAccessible
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
    }
  ];

  const handleSubmit = async (formData: FormData) => {
    const englishSubCategories = selectedDisplaySubCategories.map((displayValue) => getEnglishByDisplay(displayValue));
    const englishGenres = selectedGenres.map((genre) => getGenreEnglishByDisplay(genre));

    formData.coverImage = coverImage;
    formData.galleryImages = galleryImages;
    formData.categories = selectedCategories;
    formData.subCategories = englishSubCategories;
    formData.genres = englishGenres;
    formData.galleryAudioFiles = galleryAudioFiles;
    formData.studioAvailability = {
      days: selectedDisplayDays.map((day) => getDayEnglishByDisplay(day)) as DayOfWeek[],
      times: selectedDisplayDays.map((day) => studioHours[day])
    };
    formData.parking = selectedParking;
    updateStudioMutation.mutate(formData as Studio);
  };

  const handleFileUpload = async (files: File[], type: string) => {
    const results = await Promise.all(files.map((file) => uploadFile(file)));
    const urls = results.map((result) => result.secure_url);

    if (type === 'image') {
      if (files.length === 1) {
        setCoverImage(urls[0]);
        return toast.success('Cover image uploaded successfully');
      }
      setGalleryImages(urls);
      toast.success('Gallery images uploaded successfully');
    } else if (type === 'audio') {
      setGalleryAudioFiles(urls);
      toast.success('Audio files uploaded successfully');
    }
  };

  return (
    <section>
      <FileUploader fileType="image" onFileUpload={handleFileUpload} galleryFiles={galleryImages} isCoverShown={true} />
      <section className="form-wrapper edit-studio-form-wrapper">
        <GenericForm
          className="edit-studio-form"
          title="Edit Studio"
          fields={fields}
          onSubmit={handleSubmit}
          onCategoryChange={handleCategoryChange}
        />
      </section>
    </section>
  );
};
