import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FileUploader, GenericForm, FieldType} from '@/components';
import { useStudio, useUpdateStudioMutation } from '@/hooks';
import { uploadFile } from '@/services';
import { musicSubCategories, videoAndPhotographySubCategories } from '@/config/config';
import { Studio } from '@/types/index';
import { toast } from 'sonner';


 export const EditStudio = () => {
  const { studioId } = useParams();
  const { data } = useStudio(studioId ||'');

  const studio = data?.currStudio;

  const updateStudioMutation = useUpdateStudioMutation(studioId ||'');

  const [selectedCategory, setSelectedCategory] = useState<string>('Music');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [coverImage, setCoverImage] = useState<string>('');

  useEffect(() => {
    if (studio) {
      setSelectedCategory(studio.category||'');
      setGalleryImages(studio.galleryImages || []);
      setCoverImage(studio.coverImage || '');
    }
  }, [studio]);

  const handleCategoryChange = (value:string) => {
    setSelectedCategory(value);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType, value: studio?.name },
    { name: 'description', label: 'Description', type: 'textarea' as FieldType, value: studio?.description },
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
      label: selectedCategory === 'Music' ? 'Music Subcategory' : 'Photo / Video Subcategory',
      type: 'select' as FieldType,
      options: selectedCategory === 'Music' ? musicSubCategories : videoAndPhotographySubCategories,
      value: studio?.subCategory,
    },
    { name: 'city', label: 'City', type: 'text' as FieldType, value: studio?.city },
    { name: 'address', label: 'Address', type: 'text' as FieldType, value: studio?.address },
    { name: 'maxOccupancy', label: 'Max Occupancy', type: 'number' as FieldType, value: studio?.maxOccupancy },
    {
      name: 'isSmokingAllowed',
      label: 'Smoking Allowed',
      type: 'checkbox' as FieldType,
      value: studio?.isSmokingAllowed,
    },
    {
      name: 'isWheelchairAccessible',
      label: 'Wheelchair Accessible',
      type: 'checkbox' as FieldType,
      value: studio?.isWheelchairAccessible,
    },
    { name: 'isSelfService', label: 'Self Service', type: 'checkbox' as FieldType, value: studio?.isSelfService },
  ];

  const handleSubmit = async (formData: Record<string,any>) => {
    formData.galleryImages = galleryImages;
    formData.coverImage = coverImage;

    updateStudioMutation.mutate(formData as Studio);
  };

  const handleImageUpload = async (files: File[]) => {
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
    <section className="edit-studio">
      <FileUploader fileType='image' onFileUpload={handleImageUpload} multiple={false} isCoverShown={true} />
      <FileUploader
      fileType='image'
        onFileUpload={handleImageUpload}
        multiple={true}
        galleryFiles={galleryImages}
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
