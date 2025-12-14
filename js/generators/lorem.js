// Lorem Ipsum Generator

const loremWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'];

let generatedText = '';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generateBtn').addEventListener('click', generateLorem);
});

function generateLorem() {
    const type = document.getElementById('typeSelect').value;
    const count = parseInt(document.getElementById('countInput').value);

    if (count < 1 || count > 100) {
        showToast('Please enter a number between 1 and 100', 'warning');
        return;
    }

    let result = '';

    switch (type) {
        case 'paragraphs':
            result = generateParagraphs(count);
            break;
        case 'sentences':
            result = generateSentences(count);
            break;
        case 'words':
            result = generateWords(count);
            break;
    }

    generatedText = result;
    document.getElementById('loremResult').value = result;
    document.getElementById('resultSection').style.display = 'block';

    showToast(`Generated ${count} ${type}!`, 'success');

    setTimeout(() => {
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

function generateWords(count) {
    const words = [];
    for (let i = 0; i < count; i++) {
        words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    }
    return words.join(' ') + '.';
}

function generateSentences(count) {
    const sentences = [];
    for (let i = 0; i < count; i++) {
        const wordCount = Math.floor(Math.random() * 10) + 5; // 5-15 words per sentence
        const words = [];
        for (let j = 0; j < wordCount; j++) {
            words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        }
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        sentences.push(words.join(' ') + '.');
    }
    return sentences.join(' ');
}

function generateParagraphs(count) {
    const paragraphs = [];
    for (let i = 0; i < count; i++) {
        const sentenceCount = Math.floor(Math.random() * 4) + 3; // 3-7 sentences per paragraph
        paragraphs.push(generateSentences(sentenceCount));
    }
    return paragraphs.join('\n\n');
}

function copyLorem() {
    const textarea = document.getElementById('loremResult');
    textarea.select();
    document.execCommand('copy');
    showToast('Text copied!', 'success');
}

function copyHTML() {
    const type = document.getElementById('typeSelect').value;
    let html = '';

    if (type === 'paragraphs') {
        const paragraphs = generatedText.split('\n\n');
        html = paragraphs.map(p => `<p>${p}</p>`).join('\n');
    } else {
        html = `<p>${generatedText}</p>`;
    }

    navigator.clipboard.writeText(html);
    showToast('HTML copied!', 'success');
}
