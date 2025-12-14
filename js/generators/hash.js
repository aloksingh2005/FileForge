// Hash Generator

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const hashInput = document.getElementById('hashInput');

    generateBtn.addEventListener('click', generateHashes);

    hashInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            generateHashes();
        }
    });
});

function generateHashes() {
    const input = document.getElementById('hashInput').value;

    if (!input) {
        showToast('Please enter some text', 'warning');
        return;
    }

    try {
        // Generate all hashes
        document.getElementById('md5Result').value = CryptoJS.MD5(input).toString();
        document.getElementById('sha1Result').value = CryptoJS.SHA1(input).toString();
        document.getElementById('sha256Result').value = CryptoJS.SHA256(input).toString();
        document.getElementById('sha512Result').value = CryptoJS.SHA512(input).toString();

        document.getElementById('resultSection').style.display = 'block';
        showToast('Hashes generated!', 'success');

        setTimeout(() => {
            document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } catch (error) {
        showToast('Error generating hashes: ' + error.message, 'error');
    }
}

function copyHash(elementId) {
    const input = document.getElementById(elementId);
    input.select();
    document.execCommand('copy');
    showToast('Hash copied to clipboard!', 'success');
}
