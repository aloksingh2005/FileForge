// Base64 Encoder/Decoder

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('encodeBtn').addEventListener('click', encodeBase64);
    document.getElementById('decodeBtn').addEventListener('click', decodeBase64);
});

function encodeBase64() {
    const input = document.getElementById('inputText').value;

    if (!input) {
        showToast('Please enter text to encode', 'warning');
        return;
    }

    try {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        document.getElementById('outputText').value = encoded;
        document.getElementById('resultSection').style.display = 'block';
        showToast('Text encoded to Base64!', 'success');
    } catch (error) {
        showToast('Error encoding: ' + error.message, 'error');
    }
}

function decodeBase64() {
    const input = document.getElementById('inputText').value;

    if (!input) {
        showToast('Please enter Base64 to decode', 'warning');
        return;
    }

    try {
        const decoded = decodeURIComponent(escape(atob(input)));
        document.getElementById('outputText').value = decoded;
        document.getElementById('resultSection').style.display = 'block';
        showToast('Base64 decoded!', 'success');
    } catch (error) {
        showToast('Invalid Base64 string', 'error');
    }
}

function copyResult() {
    const output = document.getElementById('outputText');
    output.select();
    document.execCommand('copy');
    showToast('Result copied!', 'success');
}
