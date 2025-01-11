// script.js
document.getElementById('markdown-input').addEventListener('input', function () {
    const markdownText = this.value;
    const htmlOutput = parse(markdownText);
    document.getElementById('preview').innerHTML = htmlOutput;
});