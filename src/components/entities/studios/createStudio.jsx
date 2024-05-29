import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericForm from '../../common/forms/genericForm';
import { getLocalUser } from '../../../services/user-service';

import { musicSubCategories, videoAndPhotographySubCategories } from '../../../config/config';

import { useCreateStudioMutation } from '../../../hooks/mutations/studios/studioMutations';
import ImageUploader from '../../common/imageUploader/imageUploader';
import { uploadFile } from '../../../services/file-upload-service';
import { toast } from 'sonner';
import AudioUploader from '../../common/audioUploader/audioUploader';

const CreateStudio = () => {
  const user = getLocalUser();
  const createStudioMutation = useCreateStudioMutation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('Music');
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryAudioFiles, setGalleryAudioFiles] = useState([]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' },
    { name: 'description', label: 'Description', type: 'textarea' },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: ['Music', 'Photo / Video Studio'],
      value: selectedCategory,
      onChange: handleCategoryChange,
    },
    {
      name: 'subCategory',
      label: selectedCategory === 'Music' ? 'Music' : 'Photo / Video ',
      type: 'select',
      options: selectedCategory === 'Music' ? musicSubCategories : videoAndPhotographySubCategories,
    },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'address', label: 'Address', type: 'text' },

    { name: 'maxOccupancy', label: 'Max Occupancy', type: 'number' },
    { name: 'isSmokingAllowed', label: 'Smoking Allowed', type: 'checkbox' },
    { name: 'isWheelchairAccessible', label: 'Wheelchair Accessible', type: 'checkbox' },
    { name: 'isSelfService', label: 'Self service', type: 'checkbox' },
  ];

  const handleSubmit = async (formData) => {
    formData.coverImage = galleryImages[0];
    formData.galleryImages = galleryImages;
    formData.coverAudioFile = galleryAudioFiles[0];
    formData.galleryAudioFiles = galleryAudioFiles;

    createStudioMutation.mutate({ userId: user?._id, newStudio: formData });
    navigate('/');
  };

  const handleFileUpload = async (files, type) => {
    const results = await Promise.all(files.map(async (file) => await uploadFile(file)));

    const fileUrls = results.map((result) => result.secure_url);

    if (type === 'image') {
      if (files.length === 1) {
        setCoverImage(fileUrls[0]);
        return toast.success('Cover image uploaded successfully');
      }
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
      <GenericForm
        title="Create Studio"
        fields={fields}
        onSubmit={handleSubmit}
        onCategoryChange={handleCategoryChange}
      />
    </section>
  );
};

export default CreateStudio;
