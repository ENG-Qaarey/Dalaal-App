"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ALLOWED_DOCUMENT_TYPES = exports.ALLOWED_IMAGE_TYPES = exports.MAX_FILE_SIZE = exports.isDocumentFile = exports.isImageFile = exports.getFileExtension = exports.formatFileName = void 0;
const formatFileName = (originalName) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const ext = originalName.split('.').pop();
    const baseName = originalName.replace(`.${ext}`, '').replace(/[^a-zA-Z0-9]/g, '_');
    return `${timestamp}-${randomString}-${baseName}.${ext}`;
};
exports.formatFileName = formatFileName;
const getFileExtension = (filename) => {
    return filename.split('.').pop() || '';
};
exports.getFileExtension = getFileExtension;
const isImageFile = (filename) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    const ext = (0, exports.getFileExtension)(filename).toLowerCase();
    return imageExtensions.includes(ext);
};
exports.isImageFile = isImageFile;
const isDocumentFile = (filename) => {
    const documentExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
    const ext = (0, exports.getFileExtension)(filename).toLowerCase();
    return documentExtensions.includes(ext);
};
exports.isDocumentFile = isDocumentFile;
exports.MAX_FILE_SIZE = 10 * 1024 * 1024;
exports.ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
exports.ALLOWED_DOCUMENT_TYPES = ['application/pdf'];
//# sourceMappingURL=file.utils.js.map