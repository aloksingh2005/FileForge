// FileForge - PDF Compressor

let selectedPDF = null;
let compressedPDF = null;

// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const previewSection = document.getElementById('previewSection');
const fileName = document.getElementById('fileName');
const fileDetails = document.getElementById('fileDetails');
const clearBtn = document.getElementById('clearBtn');
const compressBtn = document.getElementById('compressBtn');
const resultsSection = document.getElementById('resultsSection');
const resultsStats = document.getElementById('resultsStats');
const downloadBtn = document.getElementById('downloadBtn');

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
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Drag and drop
    setupDragAndDrop(uploadZone, (files) => {
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Clear button
    clearBtn.addEventListener('click', clearFile);

    // Compress button
    compressBtn.addEventListener('click', compressPDF);

    // Download button
    downloadBtn.addEventListener('click', downloadCompressedPDF);
}

async function handleFile(file) {
    // Check if it's a PDF
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        showToast('Please select a PDF file', 'error');
        return;
    }

    showLoading('Loading PDF...');

    try {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
        const pageCount = pdfDoc.getPageCount();

        selectedPDF = {
            file,
            arrayBuffer,
            pdfDoc,
            pageCount
        };

        updatePreview();
        hideLoading();
        showToast('PDF loaded successfully', 'success');
    } catch (error) {
        hideLoading();
        console.error('PDF loading error:', error);
        showToast('Error loading PDF: ' + error.message, 'error');
    }
}

function updatePreview() {
    if (!selectedPDF) {
        previewSection.style.display = 'none';
        uploadSection.style.display = 'block';
        uploadZone.classList.remove('has-files');
        resultsSection.style.display = 'none';
        return;
    }

    previewSection.style.display = 'block';
    uploadSection.style.display = 'none';
    uploadZone.classList.add('has-files');
    resultsSection.style.display = 'none';

    fileName.textContent = selectedPDF.file.name;
    fileDetails.textContent = `${selectedPDF.pageCount} page${selectedPDF.pageCount !== 1 ? 's' : ''} • ${formatFileSize(selectedPDF.file.size)}`;
}

function clearFile() {
    selectedPDF = null;
    compressedPDF = null;
    fileInput.value = '';
    updatePreview();
    showToast('PDF cleared', 'info');
}

async function compressPDF() {
    if (!selectedPDF) {
        showToast('Please select a PDF first', 'warning');
        return;
    }

    // Get selected compression level
    const compressionLevel = document.querySelector('input[name="compression"]:checked').value;

    setButtonLoading(compressBtn, true);
    showLoading('Compressing PDF...');

    try {
        // Create a new PDF document
        const compressedDoc = await PDFLib.PDFDocument.create();

        updateProgress(20, 'Copying pages...');

        // Copy all pages from original
        const pageIndices = Array.from({ length: selectedPDF.pdfDoc.getPageCount() }, (_, i) => i);
        const copiedPages = await compressedDoc.copyPages(selectedPDF.pdfDoc, pageIndices);

        updateProgress(40, 'Adding pages...');

        // Add copied pages
        copiedPages.forEach(page => {
            compressedDoc.addPage(page);
        });

        updateProgress(60, 'Optimizing...');

        // Determine save options based on compression level
        let saveOptions;
        if (compressionLevel === 'low') {
            saveOptions = {
                useObjectStreams: false,
                addDefaultPage: false
            };
        } else if (compressionLevel === 'medium') {
            saveOptions = {
                useObjectStreams: true,
                addDefaultPage: false
            };
        } else {
            // high compression
            saveOptions = {
                useObjectStreams: true,
                addDefaultPage: false,
                objectsPerTick: 50
            };
        }

        updateProgress(80, 'Saving compressed PDF...');

        // Save the compressed PDF
        const compressedBytes = await compressedDoc.save(saveOptions);
        const blob = new Blob([compressedBytes], { type: 'application/pdf' });

        compressedPDF = {
            blob,
            size: blob.size
        };

        updateProgress(100, 'Compression complete!');

        // Show results
        const originalSize = selectedPDF.file.size;
        const compressedSize = compressedPDF.size;
        const savedBytes = originalSize - compressedSize;
        const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

        // Handle cases where compression actually increased size
        const compressionWorked = savedBytes > 0;

        resultsStats.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: var(--spacing-md); text-align: center;">
        <div>
          <div style="font-size: 0.875rem; color: var(--text-secondary);">Original Size</div>
          <div style="font-size: 1.25rem; font-weight: 700;">${formatFileSize(originalSize)}</div>
        </div>
        <div>
          <div style="font-size: 0.875rem; color: var(--text-secondary);">Compressed Size</div>
          <div style="font-size: 1.25rem; font-weight: 700; color: ${compressionWorked ? 'var(--success)' : 'var(--warning)'};">
            ${formatFileSize(compressedSize)}
          </div>
        </div>
        <div>
          <div style="font-size: 0.875rem; color: var(--text-secondary);">${compressionWorked ? 'Space Saved' : 'Size Change'}</div>
          <div style="font-size: 1.25rem; font-weight: 700; color: ${compressionWorked ? 'var(--accent-primary)' : 'var(--warning)'};">
            ${compressionWorked ? savedPercent + '%' : '+' + Math.abs(savedPercent) + '%'}
          </div>
        </div>
      </div>
      ${!compressionWorked ? `
        <div style="margin-top: var(--spacing-md); padding: var(--spacing-md); background: var(--accent-light); border-radius: var(--radius-md); color: var(--text-secondary); font-size: 0.875rem;">
          ⚠️ This PDF couldn't be compressed further. It may already be optimized or contain mostly text content.
        </div>
      ` : ''}
    `;

        resultsSection.style.display = 'block';

        hideLoading();
        setButtonLoading(compressBtn, false);

        if (compressionWorked) {
            showToast(`PDF compressed successfully! Saved ${savedPercent}%`, 'success', 5000);
        } else {
            showToast('PDF processed, but size increased. Original may already be optimized.', 'warning', 5000);
        }

        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);

    } catch (error) {
        console.error('PDF compression error:', error);
        hideLoading();
        setButtonLoading(compressBtn, false);
        showToast('Error compressing PDF: ' + error.message, 'error');
    }
}

function downloadCompressedPDF() {
    if (!compressedPDF) {
        showToast('No compressed PDF to download', 'warning');
        return;
    }

    // Generate filename
    const originalName = removeFileExtension(selectedPDF.file.name);
    const timestamp = formatDate(new Date(), 'YYYY-MM-DD-HHmmss');
    const filename = `${originalName}-compressed-${timestamp}.pdf`;

    downloadFile(compressedPDF.blob, filename);
    showToast('Compressed PDF downloaded', 'success');
}
