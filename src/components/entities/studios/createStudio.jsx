import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericForm from '../../common/forms/genericForm';
import { getLocalUser } from '../../../services/user-service';

import { musicSubCategories, videoAndPhotographySubCategories } from '../../../config/config';

import { useCreateStudioMutation } from '../../../hooks/mutations/studios/studioMutations';
import ImageUploader from '../../common/imageUploader/imageUploader';
import { uploadImage } from '../../../services/image-upload-service';
import { toast } from 'sonner';
import { set } from 'react-hook-form';

const CreateStudio = () => {
  const user = getLocalUser();
  const createStudioMutation = useCreateStudioMutation();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('Music');
  const [galleryImages, setGalleryImages] = useState([]);
  const [coverImage, setCoverImage] = useState('');

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
    formData.galleryImages = galleryImages;
    formData.coverImage = coverImage;

    createStudioMutation.mutate({ userId: user?._id, newStudio: formData });
    navigate('/');
  };

  const handleImageUpload = async (files) => {
    const results = await Promise.all(files.map(async (file) => await uploadImage(file)));

    const imageUrls = results.map((result) => result.secure_url);

    if (files.length === 1) {
      setCoverImage(imageUrls[0]);
      return toast.success('Cover image uploaded successfully');
    }
    setGalleryImages(imageUrls);
    toast.success('Gallery images uploaded successfully');
  };

  return (
    <>
      {' '}
      <div className="preview">
        <div>
          <ImageUploader onImageUpload={handleImageUpload} />
          <ImageUploader onImageUpload={handleImageUpload} multiple={false} />
        </div>
      </div>
      <GenericForm
        title="Create Studio"
        fields={fields}
        onSubmit={handleSubmit}
        onCategoryChange={handleCategoryChange}
      />
    </>
  );
};

export default CreateStudio;
