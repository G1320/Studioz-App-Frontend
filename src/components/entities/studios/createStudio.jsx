import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GenericForm from '../../common/forms/genericForm';
import { getLocalUser } from '../../../services/user-service';

import { useCreateStudioMutation } from '../../../hooks/mutations/studios/studioMutations';

const CreateStudio = () => {
  const user = getLocalUser();
  const createStudioMutation = useCreateStudioMutation();
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    createStudioMutation.mutate({ userId: user?._id, newStudio: formData });
    navigate('/');
  };

  const musicSubCategories = [
    'Music Production',
    'Podcast Recording',
    'Audio Engineering',
    'Film Sound',
    'Voiceover',
    'Live Recording',
    'Mastering',
    'Mixing',
    'Remote Collaboration',
    'Virtual Reality',
    'Live Streaming',
    'ADR (Automated Dialogue Replacement)',
    'Foley',
    'Sound Design',
    'Field Recording',
    'Post Production',
    'Audio Restoration',
    'Educational',
    'Commercial',
    'Personal Studio',
  ];

  const videoAndPhotographySubCategories = [
    'Film Production',
    'Photography Studio',
    'Video Editing',
    'Cinematography',
    'Commercial Photography',
    'Documentary Production',
    'Wedding Photography',
    'Portrait Photography',
    'Fashion Photography',
    'Event Videography',
    'Music Video Production',
    'Drone Photography/Videography',
    'Green Screen Studio',
    'Food Photography',
    'Product Photography',
    'Studio Rental',
    'Video Animation',
    'Virtual Tour Creation',
    '360° Photography/Videography',
    'Headshot Photography',
    'Real Estate Photography/Videography',
    'Corporate Videography',
    'Artistic Photography',
    'Educational Videos',
    'Travel Photography/Videography',
    'Video Game Streaming Setup',
    'Video Blogging',
    'Stock Photography/Videography',
    'Visual Effects',
    'Stop Motion Animation',
  ];

  const [selectedCategory, setSelectedCategory] = useState('Music');
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
    { name: 'imgUrl', label: 'Image URL', type: 'text' },
    { name: 'maxOccupancy', label: 'Max Occupancy', type: 'number' },
    { name: 'isSmokingAllowed', label: 'Smoking Allowed', type: 'checkbox' },
    { name: 'isWheelchairAccessible', label: 'Wheelchair Accessible', type: 'checkbox' },
    { name: 'isSelfService', label: 'Self service', type: 'checkbox' },
  ];

  return (
    <GenericForm
      title="Create Studio"
      fields={fields}
      onSubmit={handleSubmit}
      onCategoryChange={handleCategoryChange}
    />
  );
};

export default CreateStudio;
