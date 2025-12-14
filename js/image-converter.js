// FileForge - Image Converter

let selectedImages = [];
let convertedImages = [];

// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const previewSection = document.getElementById('previewSection');
const previewGrid = document.getElementById('previewGrid');
const imageCount = document.getElementById('imageCount');
const clearBtn = document.getElementById('clearBtn');
const convertBtn = document.getElementById('convertBtn');
const formatSelect = document.getElementById('formatSelect');
const qualityRow = document.getElementById('qualityRow');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const resultsSection = document.getElementById('resultsSection');
const resultsText = document.getElementById('resultsText');
const downloadAllBtn = document.getElementById('downloadAllBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateQualityVisibility();
});

function setupEventListeners() {
    // Upload zone click
    uploadZone.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(Array.from(e.target.files));
    });

    // Drag and drop
    setupDragAndDrop(uploadZone, handleFiles);

    // Clear button
    clearBtn.addEventListener('click', clearAll);

    // Convert button
    convertBtn.addEventListener('click', convertImages);

    // Download all button
    downloadAllBtn.addEventListener('click', downloadAllConverted);

    // Quality slider
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
    });

    // Format select - show/hide quality
    formatSelect.addEventListener('change', updateQualityVisibility);
}

function updateQualityVisibility() {
    const format = formatSelect.value;
    // Quality only applies to jpeg and webp
    if (format === 'jpeg' || format === 'webp') {
        qualityRow.style.display = 'flex';
    } else {
        qualityRow.style.display = 'none';
    }
}

async function handleFiles(files) {
    // Filter image files only
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
        showToast('Please select image files only', 'error');
        return;
    }

    showLoading('Loading images...');

    try {
        // Load all images
        const loadedImages = await Promise.all(
            imageFiles.map(async (file) => {
                const dataUrl = await readFileAsDataURL(file);
                const img = await loadImage(file);
                return {
                    file,
                    originalDataUrl: dataUrl,
                    width: img.width,
                    height: img.height,
                    id: generateId()
                };
            })
        );

        selectedImages = [...selectedImages, ...loadedImages];
        updatePreview();
        hideLoading();
        showToast(`Added ${imageFiles.length} image(s)`, 'success');
    } catch (error) {
        hideLoading();
        showToast('Error loading images: ' + error.message, 'error');
    }
}

function updatePreview() {
    if (selectedImages.length === 0) {
        previewSection.style.display = 'none';
        uploadSection.style.display = 'block';
        uploadZone.classList.remove('has-files');
        resultsSection.style.display = 'none';
        return;
    }

    previewSection.style.display = 'block';
    uploadSection.style.display = 'none';
    uploadZone.classList.add('has-files');

    imageCount.textContent = selectedImages.length;

    // Clear and rebuild preview grid
    previewGrid.innerHTML = '';

    selectedImages.forEach((imgData, index) => {
        const previewItem = createImagePreview(imgData, index);
        previewGrid.appendChild(previewItem);
    });
}

function createImagePreview(imgData, index) {
    const div = document.createElement('div');
    div.className = 'file-preview-item';
    div.dataset.id = imgData.id;

    const img = document.createElement('img');
    img.className = 'file-preview-image';
    img.src = imgData.originalDataUrl;

    const currentFormat = getFileExtension(imgData.file.name).toUpperCase() || 'Unknown';

    const info = document.createElement('div');
    info.className = 'file-preview-info';
    info.innerHTML = `
    <div class="file-name">${imgData.file.name}</div>
    <div class="file-size">${currentFormat} • ${formatFileSize(imgData.file.size)}</div>
  `;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'file-remove-btn';
    removeBtn.innerHTML = '×';
    removeBtn.title = 'Remove';
    removeBtn.addEventListener('click', () => removeImage(index));

    div.appendChild(img);
    div.appendChild(info);
    div.appendChild(removeBtn);

    return div;
}

function removeImage(index) {
    selectedImages.splice(index, 1);
    updatePreview();
    showToast('Image removed', 'info');
}

function clearAll() {
    selectedImages = [];
    convertedImages = [];
    fileInput.value = '';
    updatePreview();
    showToast('All images cleared', 'info');
}

async function convertImages() {
    if (selectedImages.length === 0) {
        showToast('Please select images first', 'warning');
        return;
    }

    setButtonLoading(convertBtn, true);
    showLoading('Converting images...');

    try {
        const targetFormat = formatSelect.value;
        const quality = parseInt(qualitySlider.value) / 100;

        convertedImages = [];

        for (let i = 0; i < selectedImages.length; i++) {
            const imgData = selectedImages[i];
            updateProgress((i / selectedImages.length) * 100, `Converting ${i + 1} of ${selectedImages.length}...`);

            const converted = await convertImage(imgData, targetFormat, quality);
            convertedImages.push(converted);
        }

        updateProgress(100, 'Conversion complete!');

        // Show results
        const formatName = targetFormat.toUpperCase();
        resultsText.textContent = `Successfully converted ${selectedImages.length} image(s) to ${formatName} format.`;
        resultsSection.style.display = 'block';

        hideLoading();
        setButtonLoading(convertBtn, false);
        showToast(`Conversion complete!`, 'success');

        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);

    } catch (error) {
        console.error('Conversion error:', error);
        hideLoading();
        setButtonLoading(convertBtn, false);
        showToast('Error converting images: ' + error.message, 'error');
    }
}

async function convertImage(imgData, targetFormat, quality) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                canvas.width = img.width;
                canvas.height = img.height;

                // For JPEG, need white background (no transparency)
                if (targetFormat === 'jpeg') {
                    ctx.fillStyle = '#FFFFFF';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }

                ctx.drawImage(img, 0, 0);

                // Determine MIME type
                const mimeTypes = {
                    'jpeg': 'image/jpeg',
                    'png': 'image/png',
                    'webp': 'image/webp',
                    'bmp': 'image/bmp'
                };

                const mimeType = mimeTypes[targetFormat];

                // PNG is lossless, ignore quality
                const compressionQuality = (targetFormat === 'png' || targetFormat === 'bmp') ? 1 : quality;

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Failed to create blob'));
                        return;
                    }

                    // Generate new filename
                    const originalName = removeFileExtension(imgData.file.name);
                    const filename = `${originalName}.${targetFormat}`;

                    resolve({
                        originalName: imgData.file.name,
                        filename,
                        blob,
                        dataUrl: URL.createObjectURL(blob)
                    });
                }, mimeType, compressionQuality);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imgData.originalDataUrl;
    });
}

async function downloadAllConverted() {
    if (convertedImages.length === 0) {
        showToast('No converted images to download', 'warning');
        return;
    }

    if (convertedImages.length === 1) {
        // Single file - download directly
        downloadFile(convertedImages[0].blob, convertedImages[0].filename);
        showToast('Image downloaded', 'success');
    } else {
        // Multiple files - create ZIP
        showLoading('Creating ZIP file...');

        try {
            const zip = new JSZip();

            convertedImages.forEach((img) => {
                zip.file(img.filename, img.blob);
            });

            const zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 9 }
            });

            const timestamp = formatDate(new Date(), 'YYYY-MM-DD-HHmmss');
            const format = formatSelect.value.toUpperCase();
            downloadFile(zipBlob, `converted-to-${format}-${timestamp}.zip`);

            hideLoading();
            showToast(`Downloaded ${convertedImages.length} images as ZIP`, 'success');
        } catch (error) {
            hideLoading();
            showToast('Error creating ZIP: ' + error.message, 'error');
        }
    }
}
