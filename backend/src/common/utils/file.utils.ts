export const formatFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split('.').pop();
  const baseName = originalName.replace(`.${ext}`, '').replace(/[^a-zA-Z0-9]/g, '_');
  return `${timestamp}-${randomString}-${baseName}.${ext}`;
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop() || '';
};

export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const ext = getFileExtension(filename).toLowerCase();
  return imageExtensions.includes(ext);
};

export const isDocumentFile = (filename: string): boolean => {
  const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
  const ext = getFileExtension(filename).toLowerCase();
  return documentExtensions.includes(ext);
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];
