import { useState } from 'react';
import { FileUploader, GenericForm, FieldType } from '@components/index';
import { getLocalUser, uploadFile } from '@services/index';

import { musicSubCategories, videoAndPhotographySubCategories } from '@config/index';

import { useCreateStudioMutation } from '@hooks/index';
import { Studio } from 'src/types/index';
import { toast } from 'sonner';

interface FormData {
  coverImage?: string;
  galleryImages?: string[];
  coverAudioFile?: string;
  galleryAudioFiles?: string[];
}

export const CreateStudioForm = () => {
  const user = getLocalUser();
  const createStudioMutation = useCreateStudioMutation();

  const [selectedCategory, setSelectedCategory] = useState<string>('Music / Podcast Studio');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryAudioFiles, setGalleryAudioFiles] = useState<string[]>([]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType },
    { name: 'description', label: 'Description', type: 'textarea' as FieldType },
    {
      name: 'category',
      label: 'Category',
      type: 'select' as FieldType,
      options: ['Music / Podcast Studio', 'Photo / Video Studio'],
      value: selectedCategory,
      onChange: handleCategoryChange
    },
    {
      name: 'subCategory',
      label: selectedCategory === 'Music / Podcast Studio' ? 'Music / Podcast Studio' : 'Photo / Video Studio ',
      type: 'select' as FieldType,
      options: selectedCategory === 'Music' ? musicSubCategories : videoAndPhotographySubCategories
    },
    { name: 'city', label: 'City', type: 'text' as FieldType },
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
    <>
      <FileUploader
        fileType="image"
        onFileUpload={handleFileUpload}
        galleryFiles={galleryImages}
        isCoverShown={false}
      />
      <FileUploader
        fileType="audio"
        onFileUpload={handleFileUpload}
        galleryFiles={galleryAudioFiles}
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
    </>
  );
};
