// FileForge - UI Helper Functions

/**
 * Show toast notification
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = getToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Close">&times;</button>
  `;

    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => removeToast(toast));

    container.appendChild(toast);

    if (duration > 0) {
        setTimeout(() => removeToast(toast), duration);
    }

    return toast;
}

function getToastContainer() {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    return container;
}

function removeToast(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => toast.remove(), 300);
}

/**
 * Show/hide loading overlay
 */
function showLoading(message = 'Processing...') {
    let overlay = document.querySelector('.loading-overlay');

    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
      <div class="spinner"></div>
      <div class="loading-message">${message}</div>
    `;
        document.body.appendChild(overlay);
    } else {
        overlay.querySelector('.loading-message').textContent = message;
        overlay.style.display = 'flex';
    }

    return overlay;
}

function hideLoading() {
    const overlay = document.querySelector('.loading-overlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

/**
 * Update progress bar
 */
function updateProgress(percentage, text = '') {
    let container = document.querySelector('.progress-container');

    if (!container) {
        container = document.createElement('div');
        container.className = 'progress-container';
        container.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      <div class="progress-text"></div>
    `;

        // Insert after the main content area
        const mainContent = document.querySelector('main') || document.body;
        mainContent.appendChild(container);
    }

    const fill = container.querySelector('.progress-fill');
    const textEl = container.querySelector('.progress-text');

    fill.style.width = `${Math.min(100, Math.max(0, percentage))}%`;
    textEl.textContent = text || `${Math.round(percentage)}%`;

    if (percentage >= 100) {
        setTimeout(() => container.remove(), 1000);
    }

    return container;
}

/**
 * Create modal dialog
 */
function createModal(title, content, buttons = []) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${title}</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-footer">
        ${buttons.map(btn => `
          <button class="btn btn-${btn.type || 'secondary'}" data-action="${btn.action}">
            ${btn.label}
          </button>
        `).join('')}
      </div>
    </div>
  `;

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Close button
    modal.querySelector('.modal-close').addEventListener('click', () => {
        modal.remove();
    });

    // Button actions
    buttons.forEach(btn => {
        const btnEl = modal.querySelector(`[data-action="${btn.action}"]`);
        if (btnEl && btn.onClick) {
            btnEl.addEventListener('click', () => {
                btn.onClick();
                if (btn.closeOnClick !== false) {
                    modal.remove();
                }
            });
        }
    });

    document.body.appendChild(modal);
    return modal;
}

/**
 * Toggle theme (dark/light mode)
 */
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    return newTheme;
}

/**
 * Initialize theme from localStorage
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    return savedTheme;
}

/**
 * Setup drag and drop for file upload
 */
function setupDragAndDrop(element, onFilesDropped) {
    element.addEventListener('dragover', (e) => {
        e.preventDefault();
        element.classList.add('drag-over');
    });

    element.addEventListener('dragleave', (e) => {
        e.preventDefault();
        element.classList.remove('drag-over');
    });

    element.addEventListener('drop', (e) => {
        e.preventDefault();
        element.classList.remove('drag-over');

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onFilesDropped(files);
        }
    });
}

/**
 * Create file preview element
 */
function createFilePreview(file, index, onRemove) {
    const preview = document.createElement('div');
    preview.className = 'file-preview-item';
    preview.dataset.index = index;

    const isImage = file.type.startsWith('image/');

    if (isImage) {
        const img = document.createElement('img');
        img.className = 'file-preview-image';
        img.src = URL.createObjectURL(file);
        img.onload = () => URL.revokeObjectURL(img.src);
        preview.appendChild(img);
    } else {
        // Show file icon for non-images
        preview.innerHTML = `
      <div class="file-preview-icon">📄</div>
    `;
    }

    preview.innerHTML += `
    <div class="file-preview-info">
      <div class="file-name">${file.name}</div>
      <div class="file-size">${formatFileSize(file.size)}</div>
    </div>
    <button class="file-remove-btn" title="Remove">×</button>
  `;

    const removeBtn = preview.querySelector('.file-remove-btn');
    removeBtn.addEventListener('click', () => {
        if (onRemove) onRemove(index);
        preview.remove();
    });

    return preview;
}

/**
 * Animate element entrance
 */
function animateIn(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';

    setTimeout(() => {
        element.style.transition = 'all 0.4s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

/**
 * Smooth scroll to element
 */
function scrollToElement(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

/**
 * Disable/enable button with loading state
 */
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<div class="spinner spinner-sm"></div> Processing...';
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalText || button.innerHTML;
    }
}

/**
 * Confirm dialog
 */
function confirm(message, onConfirm, onCancel) {
    return createModal(
        'Confirm',
        `<p>${message}</p>`,
        [
            {
                label: 'Cancel',
                type: 'secondary',
                action: 'cancel',
                onClick: onCancel
            },
            {
                label: 'Confirm',
                type: 'primary',
                action: 'confirm',
                onClick: onConfirm
            }
        ]
    );
}

/**
 * Alert dialog
 */
function alert(message, type = 'info') {
    return createModal(
        type === 'error' ? 'Error' : 'Info',
        `<p>${message}</p>`,
        [
            {
                label: 'OK',
                type: 'primary',
                action: 'ok'
            }
        ]
    );
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTheme();

    // Setup theme toggle button if exists
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = toggleTheme();
            themeToggle.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
        });

        // Set initial icon
        const currentTheme = document.documentElement.getAttribute('data-theme');
        themeToggle.innerHTML = currentTheme === 'dark' ? '☀️' : '🌙';
    }
});
