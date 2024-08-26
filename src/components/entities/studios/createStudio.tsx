import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericForm, { FieldType } from '../../common/forms/genericForm';
import { getLocalUser } from '../../../services/user-service';

import { musicSubCategories, videoAndPhotographySubCategories } from '../../../config/config';

import { useCreateStudioMutation } from '../../../hooks/mutations/studios/studioMutations';
import ImageUploader from '../../common/imageUploader/imageUploader';
import { uploadFile } from '../../../services/file-upload-service';
import { toast } from 'sonner';
import AudioUploader from '../../common/audioUploader/audioUploader';
import { Studio } from '../../../../../shared/types';

interface FormData {
  coverImage?: string;
  galleryImages?: string[];
  coverAudioFile?: string;
  galleryAudioFiles?: string[];
}

const CreateStudio = () => {
  const user = getLocalUser();
  const createStudioMutation = useCreateStudioMutation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string>('Music');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryAudioFiles, setGalleryAudioFiles] = useState<string[]>([]);

  const handleCategoryChange = (value:string) => {
    setSelectedCategory(value);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType },
    { name: 'description', label: 'Description', type: 'textarea' as FieldType },
    {
      name: 'category',
      label: 'Category',
      type: 'select' as FieldType,
      options: ['Music', 'Photo / Video Studio'],
      value: selectedCategory,
      onChange: handleCategoryChange,
    },
    {
      name: 'subCategory',
      label: selectedCategory === 'Music' ? 'Music' : 'Photo / Video ',
      type: 'select' as FieldType,
      options: selectedCategory === 'Music' ? musicSubCategories : videoAndPhotographySubCategories,
    },
    { name: 'city', label: 'City', type: 'text' as FieldType },
    { name: 'address', label: 'Address', type: 'text' as FieldType },

    { name: 'maxOccupancy', label: 'Max Occupancy', type: 'number' as FieldType },
    { name: 'isSmokingAllowed', label: 'Smoking Allowed', type: 'checkbox' as FieldType },
    { name: 'isWheelchairAccessible', label: 'Wheelchair Accessible', type: 'checkbox' as FieldType },
    { name: 'isSelfService', label: 'Self service', type: 'checkbox' as FieldType },
  ];

  const handleSubmit = async (formData: FormData) => {
    formData.coverImage = galleryImages[0];
    formData.galleryImages = galleryImages ;
    formData.coverAudioFile = galleryAudioFiles[0];
    formData.galleryAudioFiles = galleryAudioFiles;

    createStudioMutation.mutate({ userId: user?._id || '', newStudio: formData as Studio });
    navigate('/');
  };

  const handleFileUpload = async (files: File[], type: string) => {
    const results = await Promise.all(files.map(async (file) => await uploadFile(file)));

    const fileUrls = results.map((result) => result.secure_url);

    if (type === 'image') {
      // if (files.length === 1) {
      //   setCoverImage(fileUrls[0]);
      //   return toast.success('Cover image uploaded successfully');
      // }
      setGalleryImages(fileUrls);
      toast.success('Image files uploaded successfully');
    } else if (type === 'audio') {
      if (files.length === 1) {
        return toast.success('Cover audio uploaded successfully');
      }
      setGalleryAudioFiles(fileUrls);
      toast.success('Audio files uploaded successfully');
    }
  };

  return (
    <section className="create-studio">
      <h1>Create a new Studio</h1>
      <ImageUploader
        onImageUpload={handleFileUpload}
        galleryImages={galleryImages}
        isCoverShown={false}
        isGalleryShown={false}
      />
      <AudioUploader
        onAudioUpload={handleFileUpload}
        audioFiles={galleryAudioFiles}
        isCoverShown={false}
      />
      <GenericForm fields={fields} onSubmit={handleSubmit} onCategoryChange={handleCategoryChange} />
    </section>
  );
};

export default CreateStudio;
