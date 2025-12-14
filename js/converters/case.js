// Text Case Converter

function convertCase(type) {
    const input = document.getElementById('inputText').value;

    if (!input) {
        showToast('Please enter some text', 'warning');
        return;
    }

    let result = '';

    switch (type) {
        case 'upper':
            result = input.toUpperCase();
            break;
        case 'lower':
            result = input.toLowerCase();
            break;
        case 'title':
            result = input.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
            break;
        case 'sentence':
            result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, l => l.toUpperCase());
            break;
        case 'toggle':
            result = input.split('').map(char => {
                return char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase();
            }).join('');
            break;
        case 'camel':
            result = input.toLowerCase()
                .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
                    return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
                })
                .replace(/\s+/g, '');
            break;
    }

    document.getElementById('outputText').value = result;
    document.getElementById('resultSection').style.display = 'block';
    showToast('Text converted!', 'success');
}

function copyResult() {
    const output = document.getElementById('outputText');
    output.select();
    document.execCommand('copy');
    showToast('Result copied!', 'success');
}
