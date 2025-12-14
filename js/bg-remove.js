// FileForge - Background Remover

let selectedImage = null;
let resultImageUrl = null;
let apiKey = null;

// DOM Elements
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const uploadSection = document.getElementById('uploadSection');
const previewSection = document.getElementById('previewSection');
const originalImage = document.getElementById('originalImage');
const originalInfo = document.getElementById('originalInfo');
const clearBtn = document.getElementById('clearBtn');
const removeBtn = document.getElementById('removeBtn');
const resultsSection = document.getElementById('resultsSection');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const apiKeyInput = document.getElementById('apiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
const apiKeyStatus = document.getElementById('apiKeyStatus');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadApiKey();
    setupEventListeners();
});

function setupEventListeners() {
    // API key save
    saveApiKeyBtn.addEventListener('click', saveApiKey);

    // Upload zone click
    uploadZone.addEventListener('click', () => {
        if (!apiKey) {
            showToast('Please enter and save your API key first', 'warning');
            apiKeyInput.focus();
            return;
        }
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
        if (!apiKey) {
            showToast('Please enter and save your API key first', 'warning');
            return;
        }
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // Clear button
    clearBtn.addEventListener('click', clearImage);

    // Remove button
    removeBtn.addEventListener('click', removeBackground);

    // Download button
    downloadBtn.addEventListener('click', downloadResult);
}

function loadApiKey() {
    const saved = localStorage.getItem('removebg_api_key');
    if (saved) {
        apiKey = saved;
        apiKeyInput.value = saved;
        updateApiKeyStatus(true);
    }
}

function saveApiKey() {
    const key = apiKeyInput.value.trim();
    if (!key) {
        showToast('Please enter an API key', 'warning');
        return;
    }

    apiKey = key;
    localStorage.setItem('removebg_api_key', key);
    updateApiKeyStatus(true);
    showToast('API key saved successfully', 'success');
}

function updateApiKeyStatus(isValid) {
    if (isValid) {
        apiKeyStatus.innerHTML = '✅ API key saved (stored locally in your browser)';
        apiKeyStatus.style.color = 'var(--success)';
    } else {
        apiKeyStatus.innerHTML = '❌ No API key saved';
        apiKeyStatus.style.color = 'var(--danger)';
    }
}

async function handleFile(file) {
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }

    // Check file size (Remove.bg has limits)
    const maxSize = 12 * 1024 * 1024; // 12MB
    if (file.size > maxSize) {
        showToast('Image too large. Maximum size is 12MB', 'error');
        return;
    }

    showLoading('Loading image...');

    try {
        const dataUrl = await readFileAsDataURL(file);
        const img = await loadImage(file);

        selectedImage = {
            file,
            dataUrl,
            width: img.width,
            height: img.height
        };

        updatePreview();
        hideLoading();
        showToast('Image loaded successfully', 'success');
    } catch (error) {
        hideLoading();
        console.error('Image loading error:', error);
        showToast('Error loading image: ' + error.message, 'error');
    }
}

function updatePreview() {
    if (!selectedImage) {
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

    originalImage.src = selectedImage.dataUrl;
    originalInfo.textContent = `${selectedImage.file.name} • ${selectedImage.width}×${selectedImage.height} • ${formatFileSize(selectedImage.file.size)}`;
}

function clearImage() {
    selectedImage = null;
    resultImageUrl = null;
    fileInput.value = '';
    updatePreview();
    showToast('Image cleared', 'info');
}

async function removeBackground() {
    if (!selectedImage) {
        showToast('Please select an image first', 'warning');
        return;
    }

    if (!apiKey) {
        showToast('Please enter and save your API key first', 'warning');
        apiKeyInput.focus();
        return;
    }

    setButtonLoading(removeBtn, true);
    showLoading('Removing background... This may take 10-30 seconds');

    try {
        // Create FormData
        const formData = new FormData();
        formData.append('image_file', selectedImage.file);
        formData.append('size', 'auto');

        updateProgress(30, 'Sending to Remove.bg API...');

        // Call Remove.bg API
        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
                'X-Api-Key': apiKey
            },
            body: formData
        });

        updateProgress(60, 'Processing response...');

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.errors?.[0]?.title || 'API request failed');
        }

        // Get the result as blob
        const blob = await response.blob();

        updateProgress(90, 'Preparing result...');

        // Create object URL for display
        resultImageUrl = URL.createObjectURL(blob);
        resultImage.src = resultImageUrl;

        // Store blob for download
        selectedImage.resultBlob = blob;

        updateProgress(100, 'Complete!');

        // Show results
        resultsSection.style.display = 'block';

        hideLoading();
        setButtonLoading(removeBtn, false);
        showToast('Background removed successfully!', 'success', 5000);

        // Scroll to results
        setTimeout(() => {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);

        // Hide progress
        setTimeout(() => {
            const progressContainer = document.querySelector('.progress-container');
            if (progressContainer) {
                progressContainer.remove();
            }
        }, 2000);

    } catch (error) {
        console.error('Background removal error:', error);
        hideLoading();
        setButtonLoading(removeBtn, false);

        // Provide helpful error messages
        let errorMessage = 'Error removing background: ' + error.message;

        if (error.message.includes('Insufficient credits')) {
            errorMessage = 'Not enough API credits. Get more at remove.bg or wait for monthly reset.';
        } else if (error.message.includes('Invalid API key')) {
            errorMessage = 'Invalid API key. Please check and save a valid key.';
        } else if (error.message.includes('Rate limit')) {
            errorMessage = 'API rate limit reached. Please wait a moment and try again.';
        }

        showToast(errorMessage, 'error', 7000);
    }
}

function downloadResult() {
    if (!selectedImage || !selectedImage.resultBlob) {
        showToast('No result to download', 'warning');
        return;
    }

    // Generate filename
    const originalName = removeFileExtension(selectedImage.file.name);
    const timestamp = formatDate(new Date(), 'YYYY-MM-DD-HHmmss');
    const filename = `${originalName}-no-bg-${timestamp}.png`;

    downloadFile(selectedImage.resultBlob, filename);
    showToast('Image downloaded', 'success');
}
