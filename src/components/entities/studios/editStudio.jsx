import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericForm from '../../common/forms/genericForm';
import { useUpdateStudioMutation } from '../../../hooks/mutations/studios/studioMutations';
import { useStudio } from '../../../hooks/dataFetching/useStudio';
import ImageUploader from '../../common/imageUploader/imageUploader';
import { uploadFile } from '../../../services/file-upload-service';
import { toast } from 'sonner';
import { getLocalUser } from '../../../services/user-service';
import { musicSubCategories, videoAndPhotographySubCategories } from '../../../config/config';

const EditStudio = () => {
  const user = getLocalUser();
  const navigate = useNavigate();
  const { studioId } = useParams();
  const { data } = useStudio(studioId);

  const studio = data?.currStudio;

  const updateStudioMutation = useUpdateStudioMutation(studioId);

  const [selectedCategory, setSelectedCategory] = useState('Music');
  const [galleryImages, setGalleryImages] = useState([]);
  const [coverImage, setCoverImage] = useState('');

  useEffect(() => {
    if (studio) {
      setSelectedCategory(studio.category);
      setGalleryImages(studio.galleryImages || []);
      setCoverImage(studio.coverImage || '');
    }
  }, [studio]);

  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text', value: studio?.name },
    { name: 'description', label: 'Description', type: 'textarea', value: studio?.description },
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
      label: selectedCategory === 'Music' ? 'Music Subcategory' : 'Photo / Video Subcategory',
      type: 'select',
      options: selectedCategory === 'Music' ? musicSubCategories : videoAndPhotographySubCategories,
      value: studio?.subCategory,
    },
    { name: 'city', label: 'City', type: 'text', value: studio?.city },
    { name: 'address', label: 'Address', type: 'text', value: studio?.address },
    { name: 'maxOccupancy', label: 'Max Occupancy', type: 'number', value: studio?.maxOccupancy },
    {
      name: 'isSmokingAllowed',
      label: 'Smoking Allowed',
      type: 'checkbox',
      value: studio?.isSmokingAllowed,
    },
    {
      name: 'isWheelchairAccessible',
      label: 'Wheelchair Accessible',
      type: 'checkbox',
      value: studio?.isWheelchairAccessible,
    },
    { name: 'isSelfService', label: 'Self Service', type: 'checkbox', value: studio?.isSelfService },
  ];

  const handleSubmit = async (formData) => {
    formData.galleryImages = galleryImages;
    formData.coverImage = coverImage;

    updateStudioMutation.mutate({ userId: user?._id, updatedStudio: formData });
    navigate(`/Studio/${studioId}`);
  };

  const handleImageUpload = async (files) => {
    const results = await Promise.all(files.map(async (file) => await uploadFile(file)));
    const imageUrls = results.map((result) => result.secure_url);

    if (files.length === 1) {
      setCoverImage(imageUrls[0]);
      return toast.success('Cover image uploaded successfully');
    }
    setGalleryImages(imageUrls);
    toast.success('Gallery images uploaded successfully');
  };

  return (
    <section className="edit-studio">
      <ImageUploader onImageUpload={handleImageUpload} multiple={false} isCoverShown={true} />
      <ImageUploader
        onImageUpload={handleImageUpload}
        multiple={true}
        galleryImages={galleryImages}
        isCoverShown={false}
      />
      <GenericForm
        title="Edit Studio"
        fields={fields}
        onSubmit={handleSubmit}
        onCategoryChange={handleCategoryChange}
      />
    </section>
  );
};

export default EditStudio;
