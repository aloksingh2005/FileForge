// FileForge - PDF Merge

let selectedPDFs = [];

// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const previewSection = document.getElementById('previewSection');
const previewList = document.getElementById('previewList');
const pdfCount = document.getElementById('pdfCount');
const clearBtn = document.getElementById('clearBtn');
const mergeBtn = document.getElementById('mergeBtn');

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

    // Merge button
    mergeBtn.addEventListener('click', mergePDFs);
}

async function handleFiles(files) {
    // Filter PDF files only
    const pdfFiles = files.filter(file =>
        file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length === 0) {
        showToast('Please select PDF files only', 'error');
        return;
    }

    showLoading('Loading PDFs...');

    try {
        // Load all PDFs
        const loadedPDFs = await Promise.all(
            pdfFiles.map(async (file) => {
                const arrayBuffer = await readFileAsArrayBuffer(file);
                const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
                const pageCount = pdfDoc.getPageCount();

                return {
                    file,
                    arrayBuffer,
                    pageCount,
                    id: generateId()
                };
            })
        );

        selectedPDFs = [...selectedPDFs, ...loadedPDFs];
        updatePreview();
        hideLoading();
        showToast(`Added ${pdfFiles.length} PDF(s)`, 'success');
    } catch (error) {
        hideLoading();
        console.error('PDF loading error:', error);
        showToast('Error loading PDFs: ' + error.message, 'error');
    }
}

function updatePreview() {
    if (selectedPDFs.length === 0) {
        previewSection.style.display = 'none';
        uploadSection.style.display = 'block';
        uploadZone.classList.remove('has-files');
        return;
    }

    previewSection.style.display = 'block';
    uploadSection.style.display = 'none';
    uploadZone.classList.add('has-files');

    pdfCount.textContent = selectedPDFs.length;

    // Clear and rebuild preview list
    previewList.innerHTML = '';

    selectedPDFs.forEach((pdfData, index) => {
        const previewItem = createPDFPreview(pdfData, index);
        previewList.appendChild(previewItem);
    });

    // Setup drag-to-reorder
    setupDraggableList();
}

function createPDFPreview(pdfData, index) {
    const div = document.createElement('div');
    div.className = 'card';
    div.style.padding = 'var(--spacing-md)';
    div.style.cursor = 'grab';
    div.draggable = true;
    div.dataset.id = pdfData.id;
    div.dataset.index = index;

    div.innerHTML = `
    <div style="display: flex; align-items: center; gap: var(--spacing-md);">
      <div style="font-size: 2rem;">📄</div>
      <div style="flex: 1;">
        <div style="font-weight: 600; margin-bottom: 0.25rem;">${pdfData.file.name}</div>
        <div style="font-size: 0.875rem; color: var(--text-secondary);">
          ${pdfData.pageCount} page${pdfData.pageCount !== 1 ? 's' : ''} • ${formatFileSize(pdfData.file.size)}
        </div>
      </div>
      <button class="btn btn-sm btn-danger remove-pdf-btn" data-index="${index}">
        Remove
      </button>
    </div>
  `;

    const removeBtn = div.querySelector('.remove-pdf-btn');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removePDF(index);
    });

    return div;
}

function setupDraggableList() {
    const items = previewList.querySelectorAll('.card[draggable="true"]');
    let draggedItem = null;

    items.forEach(item => {
        item.addEventListener('dragstart', function (e) {
            draggedItem = this;
            this.style.opacity = '0.5';
            this.style.cursor = 'grabbing';
        });

        item.addEventListener('dragend', function (e) {
            this.style.opacity = '1';
            this.style.cursor = 'grab';
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

                const temp = selectedPDFs[fromIndex];
                selectedPDFs[fromIndex] = selectedPDFs[toIndex];
                selectedPDFs[toIndex] = temp;

                updatePreview();
            }
        });
    });
}

function removePDF(index) {
    selectedPDFs.splice(index, 1);
    updatePreview();

    if (selectedPDFs.length === 0) {
        fileInput.value = '';
    }

    showToast('PDF removed', 'info');
}

function clearAll() {
    selectedPDFs = [];
    fileInput.value = '';
    updatePreview();
    showToast('All PDFs cleared', 'info');
}

async function mergePDFs() {
    if (selectedPDFs.length < 2) {
        showToast('Please select at least 2 PDFs to merge', 'warning');
        return;
    }

    setButtonLoading(mergeBtn, true);
    showLoading('Merging PDFs...');

    try {
        // Create new PDF document
        const mergedPdf = await PDFLib.PDFDocument.create();

        let totalPages = 0;

        // Add each PDF
        for (let i = 0; i < selectedPDFs.length; i++) {
            const pdfData = selectedPDFs[i];

            updateProgress(
                (i / selectedPDFs.length) * 100,
                `Processing ${pdfData.file.name}...`
            );

            // Load the PDF
            const pdfDoc = await PDFLib.PDFDocument.load(pdfData.arrayBuffer);

            // Copy all pages
            const pageIndices = Array.from({ length: pdfDoc.getPageCount() }, (_, i) => i);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pageIndices);

            // Add copied pages to merged PDF
            copiedPages.forEach(page => {
                mergedPdf.addPage(page);
            });

            totalPages += pdfDoc.getPageCount();
        }

        updateProgress(100, 'Saving merged PDF...');

        // Save merged PDF
        const mergedPdfBytes = await mergedPdf.save();
        const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });

        // Generate filename
        const timestamp = formatDate(new Date(), 'YYYY-MM-DD-HHmmss');
        const filename = `merged-pdf-${timestamp}.pdf`;

        // Download
        downloadFile(blob, filename);

        hideLoading();
        setButtonLoading(mergeBtn, false);

        showToast(
            `Successfully merged ${selectedPDFs.length} PDFs (${totalPages} total pages)!`,
            'success',
            5000
        );

        // Hide progress after delay
        setTimeout(() => {
            const progressContainer = document.querySelector('.progress-container');
            if (progressContainer) {
                progressContainer.remove();
            }
        }, 2000);

    } catch (error) {
        console.error('PDF merge error:', error);
        hideLoading();
        setButtonLoading(mergeBtn, false);
        showToast('Error merging PDFs: ' + error.message, 'error');
    }
}
