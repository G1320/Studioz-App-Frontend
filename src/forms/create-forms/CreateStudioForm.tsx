import { useState } from 'react';
import { FileUploader, GenericForm, FieldType } from '@components/index';
import { getLocalUser, uploadFile } from '@services/index';

import {
  useCreateStudioMutation,
  useMusicCategories,
  useMusicSubCategories,
  usePhotoCategories,
  usePhotoSubCategories,
  useDays
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
}

export const CreateStudioForm = () => {
  const user = getLocalUser();
  const musicCategories = useMusicCategories();
  const musicSubCategories = useMusicSubCategories();
  const photoCategories = usePhotoCategories();
  const photoSubCategories = usePhotoSubCategories();
  const daysOfWeek = useDays() as DayOfWeek[];

  const createStudioMutation = useCreateStudioMutation();

  const [subCategories, setSubCategories] = useState<string[]>(musicSubCategories);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(musicCategories);
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([musicSubCategories[0]]);

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryAudioFiles, setGalleryAudioFiles] = useState<string[]>([]);

  const [openDays, setOpenDays] = useState<DayOfWeek[]>(daysOfWeek);
  const [openingHour, setOpeningHour] = useState<string>('08:00');
  const [closingHour, setClosingHour] = useState<string>('18:00');

  const hourOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
    const newSubCategories = values.includes(`${musicCategories}`) ? musicSubCategories : photoSubCategories;
    setSubCategories(newSubCategories);
    setSelectedSubCategories([newSubCategories[0]]);
  };

  const handleSubCategoryChange = (value: string[]) => {
    setSelectedSubCategories(value);
  };

  const handleDaysChange = (values: string[]) => {
    setOpenDays(values as DayOfWeek[]);
  };
  const handleOpeningHourChange = (values: string) => {
    setOpeningHour(values);
  };
  const handleClosingHourChange = (values: string) => {
    setClosingHour(values);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType },
    { name: 'description', label: 'Description', type: 'textarea' as FieldType },
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
      options: subCategories,
      value: selectedSubCategories,
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
    { name: 'address', label: 'Address', type: 'text' as FieldType },

    { name: 'maxOccupancy', label: 'Max Occupancy', type: 'number' as FieldType },
    { name: 'isSmokingAllowed', label: 'Smoking Allowed', type: 'checkbox' as FieldType },
    { name: 'isWheelchairAccessible', label: 'Wheelchair Accessible', type: 'checkbox' as FieldType },
    { name: 'isSelfService', label: 'Self service', type: 'checkbox' as FieldType }
  ];

  const handleSubmit = async (formData: FormData) => {
    formData.coverImage = galleryImages[0];
    formData.galleryImages = galleryImages;
    formData.coverAudioFile = galleryAudioFiles[0];
    formData.galleryAudioFiles = galleryAudioFiles;
    formData.categories = selectedCategories;
    formData.subCategories = selectedSubCategories;
    formData.studioAvailability = { days: openDays, times: [{ start: openingHour, end: closingHour }] };

    createStudioMutation.mutate({ userId: user?._id || '', newStudio: formData as Studio });
  };

  const handleFileUpload = async (files: File[], type: string) => {
    const results = await Promise.all(files.map(async (file) => await uploadFile(file)));

    const fileUrls = results.map((result) => result.secure_url);

    if (type === 'image') {
      if (files.length === 1) return toast.success('Cover image uploaded successfully');
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
