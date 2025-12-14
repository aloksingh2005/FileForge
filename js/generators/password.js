// Password Generator

const chars = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

document.addEventListener('DOMContentLoaded', () => {
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthValue = document.getElementById('lengthValue');
    const generateBtn = document.getElementById('generateBtn');

    lengthSlider.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
    });

    generateBtn.addEventListener('click', generatePassword);

    // Auto-generate on load
    generatePassword();
});

function generatePassword() {
    const length = parseInt(document.getElementById('lengthSlider').value);
    const includeUpper = document.getElementById('includeUpper').checked;
    const includeLower = document.getElementById('includeLower').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSymbols = document.getElementById('includeSymbols').checked;

    let charset = '';
    if (includeUpper) charset += chars.upper;
    if (includeLower) charset += chars.lower;
    if (includeNumbers) charset += chars.numbers;
    if (includeSymbols) charset += chars.symbols;

    if (!charset) {
        showToast('Please select at least one character type', 'warning');
        return;
    }

    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    document.getElementById('passwordResult').value = password;
    document.getElementById('resultSection').style.display = 'block';

    // Calculate strength
    calculateStrength(password);

    showToast('Password generated!', 'success');
}

function calculateStrength(password) {
    let strength = 0;

    // Length
    if (password.length >= 12) strength += 25;
    else if (password.length >= 8) strength += 15;

    // Character variety
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 25;

    // Extra length bonus
    if (password.length >= 16) strength += 10;

    strength = Math.min(strength, 100);

    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');

    if (strength >= 80) {
        strengthBar.style.background = 'var(--success)';
        strengthText.textContent = 'Very Strong';
        strengthText.style.color = 'var(--success)';
    } else if (strength >= 60) {
        strengthBar.style.background = '#4ade80';
        strengthText.textContent = 'Strong';
        strengthText.style.color = '#4ade80';
    } else if (strength >= 40) {
        strengthBar.style.background = 'var(--warning)';
        strengthText.textContent = 'Medium';
        strengthText.style.color = 'var(--warning)';
    } else {
        strengthBar.style.background = 'var(--danger)';
        strengthText.textContent = 'Weak';
        strengthText.style.color = 'var(--danger)';
    }

    strengthBar.style.width = strength + '%';
}

function copyPassword() {
    const password = document.getElementById('passwordResult');
    password.select();
    document.execCommand('copy');
    showToast('Password copied!', 'success');
}
