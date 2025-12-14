// Color Converter

document.addEventListener('DOMContentLoaded', () => {
    const colorPicker = document.getElementById('colorPicker');
    const hexInput = document.getElementById('hexInput');

    colorPicker.addEventListener('input', (e) => {
        updateFromHex(e.target.value);
    });

    hexInput.addEventListener('input', (e) => {
        const hex = e.target.value;
        if (/^#[0-9A-F]{6}$/i.test(hex)) {
            updateFromHex(hex);
            colorPicker.value = hex;
        }
    });

    // Initial update
    updateFromHex('#6366f1');
});

function updateFromHex(hex) {
    // Update preview
    document.getElementById('preview').style.background = hex;

    // Update HEX display
    document.getElementById('hexResult').value = hex.toUpperCase();

    // Convert to RGB
    const rgb = hexToRgb(hex);
    document.getElementById('rgbResult').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    // Convert to HSL
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    document.getElementById('hslResult').value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r: h = ((- b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

function copyValue(elementId) {
    const input = document.getElementById(elementId);
    input.select();
    document.execCommand('copy');
    showToast('Copied!', 'success');
}
