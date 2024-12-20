// Fetch the blog posts data from the JSON file
fetch('/pages/json/posts.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch blog posts.');
        }
        return response.json();
    })
    .then(data => {
        const blogPostsContainer = document.getElementById('blog-posts');
        if (!blogPostsContainer) {
            console.error('Blog posts container not found');
            return;
        }

        data.blog_posts.forEach(post => {
            const article = document.createElement('article');
            
            // Title
            const title = document.createElement('h2');
            title.classList.add('post-title');
            title.textContent = post.post_name;
            article.appendChild(title);
            
            // Date
            const postDate = document.createElement('div');
            postDate.classList.add('post-date');
            postDate.textContent = `Posted on ${post.post_date}`;
            article.appendChild(postDate);
            
            // Content
            const postContent = document.createElement('div');
            postContent.classList.add('post-content');

            // Convert display math to inline math by replacing $$...$$ with $...$
            post.description = post.description.replace(/\$\$(.*?)\$\$/g, function(match, p1) {
                return '$' + p1 + '$';  // Replace display math with inline math
            });

            postContent.innerHTML = post.description; // Render the modified LaTeX content
            article.appendChild(postContent);
            
            // Read more link
            const readMoreLink = document.createElement('a');
            readMoreLink.href = post.post_link;
            readMoreLink.classList.add('read-more');
            readMoreLink.textContent = 'Read more ›';
            article.appendChild(readMoreLink);
            
            // Append article to the container
            blogPostsContainer.appendChild(article);
        });

        // Reprocess LaTeX content after insertion
        if (typeof MathJax !== 'undefined') {
            MathJax.typeset(); // Automatically processes all LaTeX expressions in the page
        } else {
            console.error('MathJax is not loaded');
        }
    })
    .catch(error => {
        console.error('Error fetching blog posts:', error);
    });
