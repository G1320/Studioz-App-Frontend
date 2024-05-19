import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericForm from '../../common/forms/genericForm';
import { useCreateItemMutation } from '../../../hooks/mutations/items/itemMutations';

const CreateItem = () => {
  const navigate = useNavigate();
  const { studioName, studioId } = useParams();
  const createItemMutation = useCreateItemMutation(studioId);

  const handleSubmit = async (formData) => {
    createItemMutation.mutate({ ...formData, studioId, studioName });
    navigate(`/studio/${studioId}`);
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
    { name: 'inStock', label: 'In Stock', type: 'checkbox' },
    { name: 'price', label: 'Price', type: 'number' },
    { name: 'imageUrl', label: 'Image URL', type: 'text' },
  ];

  return (
    <GenericForm
      title={studioName}
      fields={fields}
      onSubmit={handleSubmit}
      onCategoryChange={handleCategoryChange}
    />
  );
};

export default CreateItem;
