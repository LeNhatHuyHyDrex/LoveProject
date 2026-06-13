const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME?.trim() ?? '';
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET?.trim() ?? '';

const hasRealValue = (value: string) =>
  value.length > 0 && !value.includes('your_') && !value.includes('example');

export const isCloudinaryConfigured = hasRealValue(cloudName) && hasRealValue(uploadPreset);

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
  resource_type: 'image' | 'video' | 'raw' | string;
  thumbnail_url?: string;
  original_filename?: string;
};

export const getCloudinaryVideoThumbnail = (publicId: string) => {
  if (!cloudName || !publicId) {
    return '';
  }

  return `https://res.cloudinary.com/${cloudName}/video/upload/so_0,w_900/${publicId}.jpg`;
};

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  if (!isCloudinaryConfigured) {
    throw new Error('Cloudinary chưa được cấu hình.');
  }

  const folder = file.type.startsWith('video/')
    ? 'love-confession/videos'
    : 'love-confession/images';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', folder);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Upload Cloudinary thất bại.');
  }

  const result = (await response.json()) as CloudinaryUploadResult;

  return {
    ...result,
    thumbnail_url:
      result.resource_type === 'video'
        ? getCloudinaryVideoThumbnail(result.public_id)
        : result.secure_url,
  };
};
