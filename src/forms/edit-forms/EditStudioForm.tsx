import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileUploader, GenericForm, FieldType } from '@components/index';
import {
  useDays,
  useMusicCategories,
  usePhotoCategories,
  usePhotoSubCategories,
  useStudio,
  useUpdateStudioMutation,
  useCategories
} from '@hooks/index';
import { uploadFile } from '@services/index';
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
}

export const EditStudioForm = () => {
  const { studioId } = useParams();
  const { data } = useStudio(studioId || '');
  const studio = data?.currStudio;
  const { getMusicSubCategories, getEnglishByDisplay, getDisplayByEnglish } = useCategories();

  const musicCategories = useMusicCategories();
  const photoCategories = usePhotoCategories();
  const photoSubCategories = usePhotoSubCategories();
  const daysOfWeek = useDays() as DayOfWeek[];

  const updateStudioMutation = useUpdateStudioMutation(studioId || '');

  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');

  // Get the English values and their display translations
  const musicSubCategoriesDisplay = getMusicSubCategories().map((cat) => cat.value);

  // Convert stored English values to display values for initial state
  const initialDisplaySubCategories =
    studio?.subCategories?.map((englishValue) => getDisplayByEnglish(englishValue)) || [];

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    studio?.categories && studio.categories.length > 0 ? [studio.categories[0]] : musicCategories
  );
  const [displaySubCategories, setDisplaySubCategories] = useState<string[]>(musicSubCategoriesDisplay);
  const [selectedDisplaySubCategories, setSelectedDisplaySubCategories] =
    useState<string[]>(initialDisplaySubCategories);

  const [openDays, setOpenDays] = useState<DayOfWeek[]>(studio?.studioAvailability?.days || daysOfWeek);
  const [openingHour, setOpeningHour] = useState<string>(studio?.studioAvailability?.times[0].start || '09:00');
  const [closingHour, setClosingHour] = useState<string>(studio?.studioAvailability?.times[0].end || '17:00');

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

  const handleDaysChange = (values: string[]) => {
    setOpenDays(values as DayOfWeek[]);
    console.log('values: ', values);
  };

  const handleOpeningHourChange = (values: string) => {
    setOpeningHour(values);
  };

  const handleClosingHourChange = (values: string) => {
    setClosingHour(values);
  };

  const fields = [
    { name: 'name.en', label: 'English Name', type: 'text' as FieldType, value: studio?.name.en },
    { name: 'name.he', label: 'Hebrew Name', type: 'text' as FieldType, value: studio?.name.he },
    { name: 'subtitle.en', label: 'English Subtitle', type: 'text' as FieldType, value: studio?.subtitle?.en },
    { name: 'subtitle.he', label: 'Hebrew Subtitle', type: 'text' as FieldType, value: studio?.subtitle?.he },
    {
      name: 'description.en',
      label: 'English Description',
      type: 'textarea' as FieldType,
      value: studio?.description?.en
    },
    {
      name: 'description.he',
      label: 'Hebrew Description',
      type: 'textarea' as FieldType,
      value: studio?.description?.he
    },
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
      name: 'openDays',
      label: 'Days of Operation',
      type: 'multiSelect' as FieldType,
      options: daysOfWeek,
      value: openDays,
      onChange: handleDaysChange
    },
    {
      name: 'openingHour',
      label: 'Opening Hour',
      type: 'select' as FieldType,
      options: hourOptions,
      value: openingHour,
      onChange: handleOpeningHourChange
    },
    {
      name: 'closingHour',
      label: 'Closing Hour',
      type: 'select' as FieldType,
      options: hourOptions,
      value: closingHour,
      onChange: handleClosingHourChange
    },
    { name: 'address', label: 'Address', type: 'text' as FieldType, value: studio?.address },
    { name: 'maxOccupancy', label: 'Max Occupancy', type: 'number' as FieldType, value: studio?.maxOccupancy },
    {
      name: 'isSmokingAllowed',
      label: 'Smoking Allowed',
      type: 'checkbox' as FieldType,
      value: studio?.isSmokingAllowed
    },
    {
      name: 'isWheelchairAccessible',
      label: 'Wheelchair Accessible',
      type: 'checkbox' as FieldType,
      value: studio?.isWheelchairAccessible
    },
    { name: 'isSelfService', label: 'Self Service', type: 'checkbox' as FieldType, value: studio?.isSelfService }
  ];

  const handleSubmit = async (formData: FormData) => {
    const englishSubCategories = selectedDisplaySubCategories.map((displayValue) => getEnglishByDisplay(displayValue));

    formData.coverImage = coverImage;
    formData.galleryImages = galleryImages;
    formData.categories = selectedCategories;
    formData.subCategories = englishSubCategories;
    formData.galleryAudioFiles = galleryAudioFiles;
    formData.studioAvailability = { days: openDays, times: [{ start: openingHour, end: closingHour }] };

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
