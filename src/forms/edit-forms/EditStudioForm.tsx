import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileUploader, GenericForm, FieldType } from '@components/index';
import { useMusicSubCategories, usePhotoSubCategories, useStudio, useUpdateStudioMutation } from '@hooks/index';
import { uploadFile } from '@services/index';
import { Studio } from 'src/types/index';
import { toast } from 'sonner';

export const EditStudioForm = () => {
  const { studioId } = useParams();
  const { data } = useStudio(studioId || '');
  const musicSubCategories = useMusicSubCategories();
  const photoSubCategories = usePhotoSubCategories();

  const studio = data?.currStudio;

  const updateStudioMutation = useUpdateStudioMutation(studioId || '');

  const [selectedCategory, setSelectedCategory] = useState<string>(studio?.category || 'Music');
  const [subCategories, setSubCategories] = useState(studio?.subCategory || musicSubCategories);

  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');

  useEffect(() => {
    if (studio) {
      setSelectedCategory(studio.category || '');
      setGalleryImages(studio.galleryImages || []);
      setCoverImage(studio.coverImage || '');
    }
  }, [studio]);

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSubCategories(value === 'Music / Podcast Studio' ? musicSubCategories : photoSubCategories);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType, value: studio?.name },
    { name: 'description', label: 'Description', type: 'textarea' as FieldType, value: studio?.description },
    {
      name: 'category',
      label: 'Category',
      type: 'select' as FieldType,
      options: ['Music / Podcast Studio', 'Photo / Video Studio'],
      value: studio?.category,
      onChange: handleCategoryChange
    },
    {
      name: 'subCategory',
      label: selectedCategory === 'Music / Podcast Studio' ? 'Music / Podcast Studio' : 'Photo / Video Studio',
      type: 'select' as FieldType,
      options: subCategories,
      value: studio?.subCategory
    },
    { name: 'city', label: 'City', type: 'text' as FieldType, value: studio?.city },
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

  const handleSubmit = async (formData: Record<string, any>) => {
    formData.galleryImages = galleryImages;
    formData.coverImage = coverImage;

    updateStudioMutation.mutate(formData as Studio);
  };

  const handleFileUpload = async (files: File[]) => {
    const results = await Promise.all(files.map(async (file) => await uploadFile(file)));
    const imageUrls = results?.map((result) => result.secure_url);

    if (files.length === 1) {
      setCoverImage(imageUrls[0]);
      return toast.success('Cover image uploaded successfully');
    }
    setGalleryImages(imageUrls);
    toast.success('Gallery images uploaded successfully');
  };

  return (
    <section className="form-wrapper edit-studio-form-wrapper">
      <FileUploader
        fileType="image"
        onFileUpload={handleFileUpload}
        galleryFiles={galleryImages}
        isCoverShown={false}
      />

      <GenericForm
        className="edit-studio-form"
        title="Edit Studio"
        fields={fields}
        onSubmit={handleSubmit}
        onCategoryChange={handleCategoryChange}
      />
    </section>
  );
};
