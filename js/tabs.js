// FileForge - Tab Navigation & Search

let currentTab = 'file-processing';
let allTools = [];

// Initialize tabs on page load
document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    setupSearch();
    loadToolsData();
});

function initializeTabs() {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.category);
        });
    });

    // Activate first tab by default
    if (tabs.length > 0) {
        switchTab(tabs[0].dataset.category);
    }
}

function switchTab(category) {
    currentTab = category;

    // Update tab active state
    document.querySelectorAll('.tab').forEach(tab => {
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Update content active state
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.dataset.category === category) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });

    // Save to localStorage
    localStorage.setItem('fileforge_last_tab', category);
}

function setupSearch() {
    const searchInput = document.getElementById('toolSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase().trim();
        searchTools(query);
    }, 300));
}

function searchTools(query) {
    if (!query) {
        // Show all tools
        document.querySelectorAll('.tool-card-compact').forEach(card => {
            card.style.display = 'flex';
        });
        return;
    }

    // Filter tools
    document.querySelectorAll('.tool-card-compact').forEach(card => {
        const name = card.querySelector('.tool-name').textContent.toLowerCase();
        const desc = card.querySelector('.tool-desc').textContent.toLowerCase();

        if (name.includes(query) || desc.includes(query)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

function loadToolsData() {
    // This will be populated as we add tools
    allTools = [
        // File Processing
        { category: 'file-processing', name: 'Image to PDF', status: 'ready', url: 'tools/image-to-pdf.html' },
        { category: 'file-processing', name: 'Image Compressor', status: 'ready', url: 'tools/image-compressor.html' },
        { category: 'file-processing', name: 'Image Converter', status: 'ready', url: 'tools/image-converter.html' },
        { category: 'file-processing', name: 'PDF Merge', status: 'ready', url: 'tools/pdf-merge.html' },
        { category: 'file-processing', name: 'PDF Compress', status: 'ready', url: 'tools/pdf-compress.html' },
        { category: 'file-processing', name: 'Background Remover', status: 'ready', url: 'tools/bg-remove.html' },
    ];
}

// Restore last viewed tab
function restoreLastTab() {
    const lastTab = localStorage.getItem('fileforge_last_tab');
    if (lastTab) {
        switchTab(lastTab);
    }
}

// Call on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', restoreLastTab);
} else {
    restoreLastTab();
}
