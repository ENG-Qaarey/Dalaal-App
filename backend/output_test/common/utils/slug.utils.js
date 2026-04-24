"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqueSlug = exports.generateSlug = void 0;
const generateSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
};
exports.generateSlug = generateSlug;
const generateUniqueSlug = (text, uniqueId) => {
    const slug = (0, exports.generateSlug)(text);
    return uniqueId ? `${slug}-${uniqueId}` : slug;
};
exports.generateUniqueSlug = generateUniqueSlug;
//# sourceMappingURL=slug.utils.js.map