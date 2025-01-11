function parse(text) {
    const lines = text.split('\n');
    let htmlOutput = '';
    let inCodeBlock = false; // Track if we're inside a code block

    for (let line of lines) {
        // Handle code blocks (triple backticks)
        if (/^```/.test(line)) {
            if (inCodeBlock) {
                htmlOutput += '</pre><br>'; // Close the code block
                inCodeBlock = false;
            } else {
                const language = line.match(/^```(\w*)/)?.[1]; // Extract language after backticks, if present
                htmlOutput += `<pre><code class="${language}">`; // Open the code block with the language class
                inCodeBlock = true;
            }
        }
        else if (inCodeBlock) {
            htmlOutput += line + '\n'; // Inside a code block, just add the line
        }
        else if (/^#{1,3} /.test(line)) {
            const hashCount = line.match(/^#+/)[0].length;
            const content = line.slice(hashCount).trim();
            htmlOutput += `<h${hashCount}>${content}</h${hashCount}><br>`;
        }
        else if (/\*\*.*\*\*/.test(line)) {
            const content = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            htmlOutput += content + '\n';
        }
        else if (/\*.*\*/.test(line)) {
            const content = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
            htmlOutput += content + '\n';
        }
        else if (line.startsWith('> ')) {
            const content = line.slice(2).trim();
            htmlOutput += `<blockquote>${content}</blockquote><br>`;
        }
        else if (/^\d+\./.test(line)) {
            const content = line.replace(/^\d+\.\s*/, '');
            htmlOutput += `<ol><li>${content}</li></ol><br>`;
        }
        else if (line.startsWith('- ')) {
            const content = line.slice(2).trim();
            htmlOutput += `<ul><li>${content}</li></ul><br>`;
        }
        else if (/`.*`/.test(line)) {
            const content = line.replace(/`(.*?)`/g, '<code>$1</code><br>');
            htmlOutput += content + '\n';
        }
        else if (/^---/.test(line)) {
            htmlOutput += '<hr>\n';
        }
        else if (/\!\[.*\]\(.*\)/.test(line)) {
            // Handle images
            const content = line.replace(/!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1">');
            htmlOutput += content + '\n';
        }
        else if (/\[.*\]\(.*\)/.test(line)) {
            // Handle links
            const content = line.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');
            htmlOutput += content + '\n';
        }
        else {
            htmlOutput += `<p>${line}</p>\n`;
        }
    }

    // Now that the first pass is done, do a second pass but keep the HTML intact
    // Only look for Markdown syntax not already turned into HTML
    const finalResult = htmlOutput.replace(/!\[([^\]]+)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1">')
                                  .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');

    return finalResult;
}
