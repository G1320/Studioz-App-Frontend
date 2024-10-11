const cloudinaryEndpoint = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;

interface UploadFileResult {
  secure_url: string;
}

export const uploadFile = async (file: File): Promise<UploadFileResult> => {
  try {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    formData.append('api_key', import.meta.env.VITE_CLOUDINARY_API_KEY);

    const response = await fetch(cloudinaryEndpoint, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Failed to upload image');

    return await response.json();
  } catch (error) {
    console.error('Error uploading images:', error);
    throw error;
  }
};
