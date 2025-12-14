// FileForge - Image to PDF Converter

let selectedImages = [];

// Page size configurations (in mm)
const PAGE_SIZES = {
    a4: { width: 210, height: 297 },
    letter: { width: 216, height: 279 },
    a3: { width: 297, height: 420 },
    a5: { width: 148, height: 210 }
};

// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const previewSection = document.getElementById('previewSection');
const previewGrid = document.getElementById('previewGrid');
const imageCount = document.getElementById('imageCount');
const clearBtn = document.getElementById('clearBtn');
const convertBtn = document.getElementById('convertBtn');
const pageSizeSelect = document.getElementById('pageSizeSelect');
const orientationSelect = document.getElementById('orientationSelect');
const fitSelect = document.getElementById('fitSelect');
const marginSlider = document.getElementById('marginSlider');
const marginValue = document.getElementById('marginValue');

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

    // Convert button
    convertBtn.addEventListener('click', convertToPDF);

    // Margin slider
    marginSlider.addEventListener('input', (e) => {
        marginValue.textContent = `${e.target.value}mm`;
    });
}

async function handleFiles(files) {
    // Filter image files only
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length === 0) {
        showToast('Please select image files only', 'error');
        return;
    }

    // Check file sizes (max 10MB per image)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversized = imageFiles.filter(file => file.size > maxSize);
    if (oversized.length > 0) {
        showToast(`Some files are too large (max 10MB): ${oversized[0].name}`, 'error');
        return;
    }

    showLoading('Loading images...');

    try {
        // Load all images
        const loadedImages = await Promise.all(
            imageFiles.map(async (file) => {
                const dataUrl = await readFileAsDataURL(file);
                const img = await loadImageFromDataURL(dataUrl);
                return {
                    file,
                    dataUrl,
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

function loadImageFromDataURL(dataUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = dataUrl;
    });
}

function updatePreview() {
    if (selectedImages.length === 0) {
        previewSection.style.display = 'none';
        uploadSection.style.display = 'block';
        uploadZone.classList.remove('has-files');
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

    // Make preview items draggable for reordering
    setupDraggableItems();
}

function createImagePreview(imgData, index) {
    const div = document.createElement('div');
    div.className = 'file-preview-item';
    div.dataset.id = imgData.id;
    div.dataset.index = index;
    div.draggable = true;

    const img = document.createElement('img');
    img.className = 'file-preview-image';
    img.src = imgData.dataUrl;

    const info = document.createElement('div');
    info.className = 'file-preview-info';
    info.innerHTML = `
    <div class="file-name">${imgData.file.name}</div>
    <div class="file-size">${formatFileSize(imgData.file.size)} • ${imgData.width}×${imgData.height}</div>
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

function setupDraggableItems() {
    const items = previewGrid.querySelectorAll('.file-preview-item');
    let draggedItem = null;

    items.forEach(item => {
        item.addEventListener('dragstart', function (e) {
            draggedItem = this;
            this.style.opacity = '0.5';
        });

        item.addEventListener('dragend', function (e) {
            this.style.opacity = '1';
        });

        item.addEventListener('dragover', function (e) {
            e.preventDefault();
            if (this !== draggedItem) {
                this.style.borderColor = 'var(--accent-primary)';
            }
        });

        item.addEventListener('dragleave', function (e) {
            this.style.borderColor = '';
        });

        item.addEventListener('drop', function (e) {
            e.preventDefault();
            this.style.borderColor = '';

            if (this !== draggedItem) {
                // Swap positions
                const fromIndex = parseInt(draggedItem.dataset.index);
                const toIndex = parseInt(this.dataset.index);

                const temp = selectedImages[fromIndex];
                selectedImages[fromIndex] = selectedImages[toIndex];
                selectedImages[toIndex] = temp;

                updatePreview();
            }
        });
    });
}

function removeImage(index) {
    selectedImages.splice(index, 1);
    updatePreview();

    if (selectedImages.length === 0) {
        fileInput.value = '';
    }

    showToast('Image removed', 'info');
}

function clearAll() {
    selectedImages = [];
    fileInput.value = '';
    updatePreview();
    showToast('All images cleared', 'info');
}

async function convertToPDF() {
    if (selectedImages.length === 0) {
        showToast('Please select images first', 'warning');
        return;
    }

    setButtonLoading(convertBtn, true);
    showLoading('Generating PDF...');

    try {
        // Get settings
        const pageSize = pageSizeSelect.value;
        const orientation = orientationSelect.value;
        const fit = fitSelect.value;
        const margin = parseInt(marginSlider.value);

        // Get page dimensions
        let { width, height } = PAGE_SIZES[pageSize];

        // Swap for landscape
        if (orientation === 'landscape') {
            [width, height] = [height, width];
        }

        // Create PDF using jsPDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: orientation,
            unit: 'mm',
            format: pageSize
        });

        // Calculate usable area (accounting for margin)
        const usableWidth = width - (margin * 2);
        const usableHeight = height - (margin * 2);

        // Add each image
        for (let i = 0; i < selectedImages.length; i++) {
            const imgData = selectedImages[i];

            // Add new page for images after the first
            if (i > 0) {
                pdf.addPage();
            }

            // Calculate image dimensions based on fit option
            let imgWidth, imgHeight, x, y;
            const aspectRatio = imgData.width / imgData.height;
            const pageAspect = usableWidth / usableHeight;

            if (fit === 'contain') {
                // Fit to page, maintain aspect ratio
                if (aspectRatio > pageAspect) {
                    // Image is wider than page
                    imgWidth = usableWidth;
                    imgHeight = usableWidth / aspectRatio;
                } else {
                    // Image is taller than page
                    imgHeight = usableHeight;
                    imgWidth = usableHeight * aspectRatio;
                }
                // Center on page
                x = margin + (usableWidth - imgWidth) / 2;
                y = margin + (usableHeight - imgHeight) / 2;

            } else if (fit === 'cover') {
                // Fill page, may crop
                if (aspectRatio > pageAspect) {
                    imgHeight = usableHeight;
                    imgWidth = usableHeight * aspectRatio;
                } else {
                    imgWidth = usableWidth;
                    imgHeight = usableWidth / aspectRatio;
                }
                // Center on page (parts may be cut off)
                x = margin + (usableWidth - imgWidth) / 2;
                y = margin + (usableHeight - imgHeight) / 2;

            } else {
                // Stretch to fill
                imgWidth = usableWidth;
                imgHeight = usableHeight;
                x = margin;
                y = margin;
            }

            // Add image to PDF
            pdf.addImage(
                imgData.dataUrl,
                'JPEG',
                x,
                y,
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
            );

            // Update progress
            const progress = ((i + 1) / selectedImages.length) * 100;
            updateProgress(progress, `Adding image ${i + 1} of ${selectedImages.length}...`);
        }

        // Generate filename
        const timestamp = formatDate(new Date(), 'YYYY-MM-DD-HHmmss');
        const filename = `images-to-pdf-${timestamp}.pdf`;

        // Save PDF
        pdf.save(filename);

        hideLoading();
        setButtonLoading(convertBtn, false);
        showToast(`PDF created successfully! (${selectedImages.length} images)`, 'success', 5000);

        // Hide progress after a delay
        setTimeout(() => {
            const progressContainer = document.querySelector('.progress-container');
            if (progressContainer) {
                progressContainer.remove();
            }
        }, 2000);

    } catch (error) {
        console.error('PDF generation error:', error);
        hideLoading();
        setButtonLoading(convertBtn, false);
        showToast('Error creating PDF: ' + error.message, 'error');
    }
}
