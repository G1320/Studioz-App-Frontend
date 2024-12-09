import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileUploader, GenericForm, FieldType } from '@components/index';
import {
  useMusicCategories,
  useMusicSubCategories,
  usePhotoCategories,
  usePhotoSubCategories,
  useStudio,
  useUpdateStudioMutation
} from '@hooks/index';
import { uploadFile } from '@services/index';
import { Studio } from 'src/types/index';
import { toast } from 'sonner';
import { arraysEqual } from '@utils/compareArrays';

interface FormData {
  coverImage?: string;
  galleryImages?: string[];
  coverAudioFile?: string;
  galleryAudioFiles?: string[];
  categories?: string[];
  subCategories?: string[];
}

export const EditStudioForm = () => {
  const { studioId } = useParams();
  const { data } = useStudio(studioId || '');
  const studio = data?.currStudio;

  const musicCategories = useMusicCategories();
  const musicSubCategories = useMusicSubCategories();
  const photoCategories = usePhotoCategories();
  const photoSubCategories = usePhotoSubCategories();

  const updateStudioMutation = useUpdateStudioMutation(studioId || '');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    studio?.categories && studio.categories.length > 0 ? [studio.categories[0]] : musicCategories
  );
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>(studio?.subCategories || []);
  const [subCategories, setSubCategories] = useState<string[]>(musicSubCategories);
  // const [subCategories, setSubCategories] = useState<string[]>(
  //   studio?.categories?.includes(musicCategories[0]) ? musicSubCategories : photoSubCategories
  // );

  const [galleryImages, setGalleryImages] = useState<string[]>(studio?.galleryImages || []);
  const [coverImage, setCoverImage] = useState<string>(studio?.coverImage || '');
  const [galleryAudioFiles, setGalleryAudioFiles] = useState<string[]>(studio?.galleryAudioFiles || []);

  const handleCategoryChange = (values: string[]) => {
    setSelectedCategories(values);
    const newSubCategories = values.includes(`${musicCategories}`) ? musicSubCategories : photoSubCategories;
    setSubCategories(newSubCategories);
    setSelectedSubCategories([newSubCategories[0]]);
  };

  const handleSubCategoryChange = (value: string[]) => {
    setSelectedSubCategories(value);
  };

  const fields = [
    { name: 'name', label: 'Name', type: 'text' as FieldType, value: studio?.name },
    { name: 'description', label: 'Description', type: 'textarea' as FieldType, value: studio?.description },
    {
      name: 'categories',
      label: 'Categories',
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

  const handleSubmit = async (formData: FormData) => {
    formData.coverImage = coverImage;
    formData.galleryImages = galleryImages;
    formData.categories = selectedCategories;
    formData.subCategories = selectedSubCategories;
    formData.galleryAudioFiles = galleryAudioFiles;

    updateStudioMutation.mutate(formData as Studio, {
      onSuccess: () => toast.success('Studio updated successfully'),
      onError: () => toast.error('Failed to update studio')
    });
  };

  const handleFileUpload = async (files: File[], type: string) => {
    const results = await Promise.all(files.map((file) => uploadFile(file)));
    const urls = results.map((result) => result.secure_url);

    if (type === 'image') {
      if (files.length === 1) {
        setCoverImage(urls[0]);
        return toast.success('Cover image uploaded successfully');
      }
      setGalleryImages(urls);
      toast.success('Gallery images uploaded successfully');
    } else if (type === 'audio') {
      setGalleryAudioFiles(urls);
      toast.success('Audio files uploaded successfully');
    }
  };

  return (
    <section>
      <FileUploader fileType="image" onFileUpload={handleFileUpload} galleryFiles={galleryImages} isCoverShown={true} />
      <section className="form-wrapper edit-studio-form-wrapper">
        <GenericForm
          className="edit-studio-form"
          title="Edit Studio"
          fields={fields}
          onSubmit={handleSubmit}
          onCategoryChange={handleCategoryChange}
        />
      </section>
    </section>
  );
};
