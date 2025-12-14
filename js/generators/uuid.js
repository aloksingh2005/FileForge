// UUID Generator

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generateBtn').addEventListener('click', generateUUIDs);

    document.getElementById('countInput').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            generateUUIDs();
        }
    });
});

function generateUUIDs() {
    const count = parseInt(document.getElementById('countInput').value);

    if (count < 1 || count > 100) {
        showToast('Please enter a number between 1 and 100', 'warning');
        return;
    }

    const uuids = [];
    for (let i = 0; i < count; i++) {
        uuids.push(generateUUID());
    }

    document.getElementById('uuidResult').value = uuids.join('\n');
    document.getElementById('resultSection').style.display = 'block';

    showToast(`Generated ${count} UUID${count > 1 ? 's' : ''}!`, 'success');

    setTimeout(() => {
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function copyUUIDs() {
    const textarea = document.getElementById('uuidResult');
    textarea.select();
    document.execCommand('copy');
    showToast('All UUIDs copied!', 'success');
}

function copyFirst() {
    const textarea = document.getElementById('uuidResult');
    const firstUUID = textarea.value.split('\n')[0];
    navigator.clipboard.writeText(firstUUID);
    showToast('First UUID copied!', 'success');
}
