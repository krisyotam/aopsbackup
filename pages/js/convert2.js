const fs = require('fs');
const path = require('path');
const { marked } = require('marked');  // Marked library for markdown to HTML conversion
const frontMatter = require('front-matter'); // Library for reading front matter

// Hardcoded paths to the directories
const inputDir = 'C:/Users/Kris Yotam/Documents/krisnewmathblog/posts/md';  // Updated path
const outputDir = 'C:/Users/Kris Yotam/Documents/krisnewmathblog/posts/html';  // Updated path

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Function to convert markdown to HTML
function convertMarkdownToHTML(filePath, outputPath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        // Parse front matter (metadata) from markdown (e.g., author, date)
        const parsed = frontMatter(data);
        const { attributes, body } = parsed;

        // Convert markdown body to HTML
        const htmlContent = marked(body);

        // Template for the HTML page
        const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${attributes.title || 'Math Blog Post'}</title>
    <link rel="stylesheet" href="/pages/css/styles.css">
    <link rel="stylesheet" href="/pages/css/post.css">
    
    <!-- MathJax for LaTeX rendering -->
    <script type="text/javascript">
        window.MathJax = {
          tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true
          },
          chtml: {
            scale: 1.0
          }
        };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
    
</head>
<body>

    <h1 class="post-title">${attributes.title || 'Post Title'}</h1>
    
    <div class="author-date">
        <p>${attributes.author || 'Author'} &middot; ${attributes.date || 'Date'}</p>
    </div>
    
    <div class="post-content">
        ${htmlContent}
    </div>

    <footer>
        <nav>
            <a href="/index.html">Home</a> •
            <a href="/pages/html/categories.html">Index</a> •
            <a href="/pages/html/about.html">About</a>
        </nav>
    </footer>

    <script src="/pages/js/main_feed.js"></script>
    <script src="/pages/js/smoothScroll.js"></script>

</body>
</html>`;

        // Write the HTML file to the output directory
        fs.writeFile(outputPath, htmlPage, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing file ${outputPath}:`, err);
            } else {
                console.log(`Converted ${filePath} to ${outputPath}`);
            }
        });
    });
}

// Function to process all markdown files in the input directory
function processMarkdownFiles() {
    fs.readdir(inputDir, (err, files) => {
        if (err) {
            console.error('Error reading input directory:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(inputDir, file);
            const outputPath = path.join(outputDir, path.basename(file, '.md') + '.html');

            // Only process markdown files
            if (path.extname(file) === '.md') {
                convertMarkdownToHTML(filePath, outputPath);
            }
        });
    });
}

// Run the conversion
processMarkdownFiles();
