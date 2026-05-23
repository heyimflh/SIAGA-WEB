const VALID_EXTENSIONS = ['.dng', '.arw', '.mp4', '.mov', '.tif', '.las'];
const MAX_FILE_SIZE = 500 * 1024 * 1024;

export function isValidExtension(filename) {
 if (typeof filename !== 'string' || !filename) return false;
 const ext = filename.slice(filename.lastIndexOf('.')).toLowerCase();
 return VALID_EXTENSIONS.includes(ext);
}

export function isValidFileSize(size) {
 if (typeof size !== 'number' || isNaN(size)) return false;
 return size >= 0 && size <= MAX_FILE_SIZE;
}

export function validateFile(file) {
 if (!file) return { valid: false, error: 'File tidak ditemukan' };
 if (!isValidExtension(file.name)) {
 return { valid: false, error: 'Format file tidak didukung' };
 }
 if (!isValidFileSize(file.size)) {
 return { valid: false, error: 'Ukuran file melebihi 500MB' };
 }
 return { valid: true, error: null };
}
