const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const frontMatter = require('front-matter');

// Paths
const inputDir = 'C:/Users/Kris Yotam/Documents/krisnewmathblog/posts/md';
const outputDir = 'C:/Users/Kris Yotam/Documents/krisnewmathblog/posts/html';
const jsonPath = 'C:/Users/Kris Yotam/Documents/krisnewmathblog/pages/json/posts.json';
const categoryHtmlDir = 'C:/Users/Kris Yotam/Documents/krisnewmathblog/categories/html';
const categoryJsDir = 'C:/Users/Kris Yotam/Documents/krisnewmathblog/categories/js';
const categoryCss = ['/pages/css/styles.css', '/categories/css/categories.css'];

// Ensure necessary directories exist
[outputDir, categoryHtmlDir, categoryJsDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Initialize or reset the JSON file
if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);
fs.writeFileSync(jsonPath, JSON.stringify({ blog_posts: [] }, null, 2));

// Function to convert markdown to HTML and update JSON
function convertMarkdownToHTML(filePath, index) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            return;
        }

        const parsed = frontMatter(data);
        const { attributes, body } = parsed;

        // Extract the first 20 words for description, excluding section titles
        const description = extractDescription(body);

        const postFileName = `post${index + 1}.html`;
        const outputPath = path.join(outputDir, postFileName);
        const htmlContent = marked(body);

        const htmlPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${attributes.title || 'Post Title'}</title>
    <link rel="stylesheet" href="/pages/css/styles.css">
    <link rel="stylesheet" href="/pages/css/post.css">
    <script type="text/javascript">
        window.MathJax = {
            tex: {
                inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
                displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
                processEscapes: true
            },
            chtml: { scale: 1.0 }
        };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
</head>
<body>
    <h1>${attributes.title || 'Post Title'}</h1>
    <div>${htmlContent}</div>
</body>
</html>`;

        fs.writeFileSync(outputPath, htmlPage, 'utf8');
        console.log(`Converted ${filePath} to ${outputPath}`);

        // Hardcoding category slug based on front matter category
        const categorySlug = attributes.category.toLowerCase().replace(/\s+/g, '-');
        const categoryHtmlPath = path.join(categoryHtmlDir, `${categorySlug}.html`);
        const categoryJsPath = path.join(categoryJsDir, `${categorySlug}.js`);

        // Create category HTML if it doesn't exist
        if (!fs.existsSync(categoryHtmlPath)) {
            const categoryHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Category - Kris Yotam's Math Blog</title>
    <link rel="stylesheet" href="/pages/css/styles.css">
    <link rel="stylesheet" href="/pages/css/categories.css">
</head>
<body>
    <main>
        <h1 id="category-name">${attributes.category}</h1>
        <table>
            <thead>
                <tr>
                    <th class="post-title">Post Title</th>
                    <th class="post-date">Date</th>
                </tr>
            </thead>
            <tbody>
                <!-- Posts will be dynamically loaded here -->
            </tbody>
        </table>
    </main>

    <footer>
        <nav>
            <a href="/index.html">Home</a> •
            <a href="/pages/html/categories.html">Index</a> •
            <a href="/pages/html/about.html">About</a>
        </nav>
    </footer>

<script src="/categories/js/${categorySlug}.js"></script>

</body>
</html>`;

            fs.writeFileSync(categoryHtmlPath, categoryHtml, 'utf8');
            console.log(`Generated category HTML: ${categoryHtmlPath}`);
        }

        // Create category JS if it doesn't exist
        if (!fs.existsSync(categoryJsPath)) {
            const categoryJs = `document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('table tbody');
    const categoryNameElement = document.getElementById('category-name');

    // Hardcoding category name (this will now be consistent for this category)
    const categoryName = "${attributes.category}";  // Automatically inserted category name from front matter

    categoryNameElement.textContent = categoryName;

    fetch('/pages/json/posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load posts.json');
            }
            return response.json();
        })
        .then(data => {
            const posts = data.blog_posts;
            const categoryPosts = posts.filter(post => post.category_name === categoryName);

            if (categoryPosts.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="2">No posts found in this category.</td></tr>';
                return;
            }

            categoryPosts.forEach(post => {
                const row = document.createElement('tr');

                const titleCell = document.createElement('td');
                const postLink = document.createElement('a');
                postLink.href = post.post_link;
                postLink.textContent = post.post_name;
                titleCell.appendChild(postLink);

                const dateCell = document.createElement('td');
                dateCell.textContent = post.post_date;

                row.appendChild(titleCell);
                row.appendChild(dateCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading or parsing posts.json:', error);
        });
});`;

            fs.writeFileSync(categoryJsPath, categoryJs, 'utf8');
            console.log(`Generated category JS: ${categoryJsPath}`);
        }

        // Update the posts.json file with post data
        const postsData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        postsData.blog_posts.push({
            post_date: attributes.date,
            description: description,
            post_name: attributes.title,
            post_link: `/posts/html/${postFileName}`,
            category_link: `/categories/html/${categorySlug}.html`,
            category_name: attributes.category
        });

        fs.writeFileSync(jsonPath, JSON.stringify(postsData, null, 2), 'utf8');
    });
}

// Function to extract the first 20 words excluding section titles and subtitles
function extractDescription(body) {
    // Remove Markdown headers (section titles and subtitles)
    const cleanedBody = body.replace(/^(#{1,6})\s+(.*)$/gm, '').trim();

    // Split the cleaned body into words and take the first 20
    const words = cleanedBody.split(/\s+/).slice(0, 20).join(' ');

    return words;
}

// Process all markdown files
fs.readdir(inputDir, (err, files) => {
    if (err) {
        console.error('Error reading input directory:', err);
        return;
    }

    files.filter(file => path.extname(file) === '.md').forEach((file, index) => {
        convertMarkdownToHTML(path.join(inputDir, file), index);
    });
});
