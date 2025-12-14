// FileForge - Image Compressor

let selectedImages = [];
let compressedImages = [];

// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const previewSection = document.getElementById('previewSection');
const previewGrid = document.getElementById('previewGrid');
const imageCount = document.getElementById('imageCount');
const clearBtn = document.getElementById('clearBtn');
const compressBtn = document.getElementById('compressBtn');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const formatSelect = document.getElementById('formatSelect');
const maxSizeInput = document.getElementById('maxSizeInput');
const resultsSection = document.getElementById('resultsSection');
const resultsStats = document.getElementById('resultsStats');
const downloadAllBtn = document.getElementById('downloadAllBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
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

    // Compress button
    compressBtn.addEventListener('click', compressImages);

    // Download all button
    downloadAllBtn.addEventListener('click', downloadAllCompressed);

    // Quality slider
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
    });
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

    const info = document.createElement('div');
    info.className = 'file-preview-info';
    info.innerHTML = `
    <div class="file-name">${imgData.file.name}</div>
    <div class="file-size">${formatFileSize(imgData.file.size)}</div>
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
    compressedImages = [];
    fileInput.value = '';
    updatePreview();
    showToast('All images cleared', 'info');
}

async function compressImages() {
    if (selectedImages.length === 0) {
        showToast('Please select images first', 'warning');
        return;
    }

    setButtonLoading(compressBtn, true);
    showLoading('Compressing images...');

    try {
        const quality = parseInt(qualitySlider.value) / 100;
        const format = formatSelect.value;
        const maxSize = parseInt(maxSizeInput.value) || 0;

        compressedImages = [];
        let totalOriginalSize = 0;
        let totalCompressedSize = 0;

        for (let i = 0; i < selectedImages.length; i++) {
            const imgData = selectedImages[i];
            updateProgress((i / selectedImages.length) * 100, `Compressing ${i + 1} of ${selectedImages.length}...`);

            const compressed = await compressImage(imgData, quality, format, maxSize);
            compressedImages.push(compressed);

            totalOriginalSize += imgData.file.size;
            totalCompressedSize += compressed.blob.size;
        }

        updateProgress(100, 'Compression complete!');

        // Show results
        const savedBytes = totalOriginalSize - totalCompressedSize;
        const savedPercent = ((savedBytes / totalOriginalSize) * 100).toFixed(1);

        resultsStats.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--spacing-md); text-align: center;">
        <div>
          <div style="font-size: 0.875rem; color: var(--text-secondary);">Original Size</div>
          <div style="font-size: 1.25rem; font-weight: 700;">${formatFileSize(totalOriginalSize)}</div>
        </div>
        <div>
          <div style="font-size: 0.875rem; color: var(--text-secondary);">Compressed Size</div>
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--success);">${formatFileSize(totalCompressedSize)}</div>
        </div>
        <div>
          <div style="font-size: 0.875rem; color: var(--text-secondary);">Space Saved</div>
          <div style="font-size: 1.25rem; font-weight: 700; color: var(--accent-primary);">${savedPercent}%</div>
        </div>
      </div>
    `;

        resultsSection.style.display = 'block';

        hideLoading();
        setButtonLoading(compressBtn, false);
        showToast(`Successfully compressed ${selectedImages.length} image(s)!`, 'success');

        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);

    } catch (error) {
        console.error('Compression error:', error);
        hideLoading();
        setButtonLoading(compressBtn, false);
        showToast('Error compressing images: ' + error.message, 'error');
    }
}

async function compressImage(imgData, quality, formatOption, maxSize) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;

                // Resize if maxSize is set
                if (maxSize > 0 && (width > maxSize || height > maxSize)) {
                    if (width > height) {
                        height = (height / width) * maxSize;
                        width = maxSize;
                    } else {
                        width = (width / height) * maxSize;
                        height = maxSize;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                ctx.drawImage(img, 0, 0, width, height);

                // Determine output format
                let outputFormat;
                if (formatOption === 'original') {
                    outputFormat = imgData.file.type;
                } else if (formatOption === 'jpeg') {
                    outputFormat = 'image/jpeg';
                } else if (formatOption === 'webp') {
                    outputFormat = 'image/webp';
                } else if (formatOption === 'png') {
                    outputFormat = 'image/png';
                }

                // For PNG, ignore quality (always lossless)
                const compressionQuality = outputFormat === 'image/png' ? 1 : quality;

                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Failed to create blob'));
                        return;
                    }

                    // Generate new filename
                    const originalName = removeFileExtension(imgData.file.name);
                    const extension = outputFormat.split('/')[1];
                    const filename = `${originalName}-compressed.${extension}`;

                    resolve({
                        originalName: imgData.file.name,
                        filename,
                        blob,
                        dataUrl: URL.createObjectURL(blob),
                        originalSize: imgData.file.size,
                        compressedSize: blob.size
                    });
                }, outputFormat, compressionQuality);
            } catch (error) {
                reject(error);
            }
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imgData.originalDataUrl;
    });
}

async function downloadAllCompressed() {
    if (compressedImages.length === 0) {
        showToast('No compressed images to download', 'warning');
        return;
    }

    if (compressedImages.length === 1) {
        // Single file - download directly
        downloadFile(compressedImages[0].blob, compressedImages[0].filename);
        showToast('Image downloaded', 'success');
    } else {
        // Multiple files - create ZIP
        showLoading('Creating ZIP file...');

        try {
            const zip = new JSZip();

            compressedImages.forEach((img, index) => {
                zip.file(img.filename, img.blob);
            });

            const zipBlob = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 9 }
            });

            const timestamp = formatDate(new Date(), 'YYYY-MM-DD-HHmmss');
            downloadFile(zipBlob, `compressed-images-${timestamp}.zip`);

            hideLoading();
            showToast(`Downloaded ${compressedImages.length} images as ZIP`, 'success');
        } catch (error) {
            hideLoading();
            showToast('Error creating ZIP: ' + error.message, 'error');
        }
    }
}
