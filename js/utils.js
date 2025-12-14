// FileForge - Utility Functions

/**
 * Format bytes to human-readable file size
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Trigger file download
 */
function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Handle file input with validation
 */
function handleFileUpload(input, options = {}) {
  return new Promise((resolve, reject) => {
    const files = Array.from(input.files);
    
    if (files.length === 0) {
      reject(new Error('No files selected'));
      return;
    }
    
    // Validate file types if specified
    if (options.accept) {
      const acceptedTypes = options.accept.split(',').map(t => t.trim());
      const invalidFiles = files.filter(file => {
        return !acceptedTypes.some(type => {
          if (type.endsWith('/*')) {
            const category = type.split('/')[0];
            return file.type.startsWith(category + '/');
          }
          return file.type === type || file.name.endsWith(type.replace('*', ''));
        });
      });
      
      if (invalidFiles.length > 0) {
        reject(new Error(`Invalid file type: ${invalidFiles[0].name}`));
        return;
      }
    }
    
    // Validate file size if specified
    if (options.maxSize) {
      const oversizedFiles = files.filter(file => file.size > options.maxSize);
      if (oversizedFiles.length > 0) {
        reject(new Error(`File too large: ${oversizedFiles[0].name} (max ${formatFileSize(options.maxSize)})`));
        return;
      }
    }
    
    // Validate file count if specified
    if (options.maxFiles && files.length > options.maxFiles) {
      reject(new Error(`Too many files (max ${options.maxFiles})`));
      return;
    }
    
    resolve(files);
  });
}

/**
 * Read file as data URL
 */
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Read file as array buffer
 */
function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Load image from file
 */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Create ZIP file from multiple files
 */
async function createZip(files, zipName = 'files.zip') {
  if (typeof JSZip === 'undefined') {
    throw new Error('JSZip library not loaded');
  }
  
  const zip = new JSZip();
  
  for (const { name, blob } of files) {
    zip.file(name, blob);
  }
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadFile(zipBlob, zipName);
}

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Generate unique ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Copy to clipboard
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

/**
 * Get file extension
 */
function getFileExtension(filename) {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

/**
 * Remove file extension
 */
function removeFileExtension(filename) {
  return filename.replace(/\.[^/.]+$/, '');
}

/**
 * Validate email
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Format date
 */
function formatDate(date, format = 'YYYY-MM-DD') {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}
