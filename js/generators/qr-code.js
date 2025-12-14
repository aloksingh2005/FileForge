// QR Code Generator

let qrCodeInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const qrInput = document.getElementById('qrInput');

    generateBtn.addEventListener('click', generateQRCode);
    downloadBtn.addEventListener('click', downloadQRCode);

    // Generate on Enter (Ctrl+Enter in textarea)
    qrInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            generateQRCode();
        }
    });
});

function generateQRCode() {
    const input = document.getElementById('qrInput').value.trim();
    const size = parseInt(document.getElementById('qrSize').value);
    const qrcodeDiv = document.getElementById('qrcode');
    const resultSection = document.getElementById('resultSection');

    if (!input) {
        showToast('Please enter some text or URL', 'warning');
        return;
    }

    // Clear previous QR code
    qrcodeDiv.innerHTML = '';

    // Generate new QR code
    try {
        qrCodeInstance = new QRCode(qrcodeDiv, {
            text: input,
            width: size,
            height: size,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        resultSection.style.display = 'block';
        showToast('QR Code generated!', 'success');

        // Scroll to result
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } catch (error) {
        showToast('Error generating QR Code: ' + error.message, 'error');
    }
}

function downloadQRCode() {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        showToast('No QR code to download', 'warning');
        return;
    }

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `qrcode-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('QR Code downloaded!', 'success');
    });
}
