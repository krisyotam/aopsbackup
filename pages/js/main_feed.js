// Replace these with your API details
const API_URL = 'https://kris-yotam.ghost.io/ghost/api/v3/content/posts/';
const API_KEY = 'a7df4f0f931681f8719c806cbf';  // Ensure you are using a valid API key

// Construct the API URL to fetch all posts
const url = `${API_URL}?key=${API_KEY}&include=tags`;

fetch(url)
    .then(response => {
        if (!response.ok) {
            console.error('Failed to fetch blog posts:', response.status, response.statusText);
            throw new Error('Failed to fetch blog posts from the API.');
        }
        return response.json();
    })
    .then(data => {
        const blogPostsContainer = document.getElementById('blog-posts');
        if (!blogPostsContainer) {
            console.error('Blog posts container not found');
            return;
        }

        // Extract posts from the API response
        const posts = data.posts || [];
        console.log('Posts fetched:', posts.length); // Log the number of posts

        // Optionally, you can filter posts by a specific tag
        const filteredPosts = posts.filter(post =>
            post.tags.some(tag => tag.name === '#krisaops.com')
        );

        if (filteredPosts.length === 0) {
            console.warn('No posts with the required tag found.');
        }

        // Process each filtered post
        filteredPosts.forEach(post => {
            const article = document.createElement('article');

            // Title
            const title = document.createElement('h2');
            title.classList.add('post-title');
            title.textContent = post.title;
            article.appendChild(title);

            // Date
            const postDate = document.createElement('div');
            postDate.classList.add('post-date');
            postDate.textContent = `Posted on ${new Date(post.published_at).toLocaleDateString()}`;
            article.appendChild(postDate);

            // Content (assuming MathJax equations are in the description)
            const postContent = document.createElement('div');
            postContent.classList.add('post-content');

            // Modify content: Replace $$ with $ for inline rendering, preserve $$ for block math
            let content = post.excerpt;

            // Log content before replacement
            console.log('Original Content:', content);

            // Convert $$ to $ for inline math, but leave $ for block math
            content = content.replace(/\$\$(.*?)\$\$/g, function(match, p1) {
                console.log('Replacing $$ with $ for:', p1); // Log the part being replaced
                return `$${p1}$`; // Convert $$ to $ for inline
            });

            // Log content after replacement
            console.log('Modified Content:', content);

            postContent.innerHTML = content; // Use innerHTML to handle MathJax syntax
            article.appendChild(postContent);

            // Read more link (if you want to link directly to the post by its ID)
            const readMoreLink = document.createElement('a');
            const postId = post.id;
            readMoreLink.href = `/pages/html/post.html?id=${postId}`;
            readMoreLink.classList.add('read-more');
            readMoreLink.textContent = 'Read more ›';
            article.appendChild(readMoreLink);

            // Append article to the container
            blogPostsContainer.appendChild(article);

            // Trigger MathJax rendering after appending the content
            try {
                MathJax.typesetPromise([postContent])
                    .then(() => {
                        console.log('MathJax rendered successfully for post:', post.title);
                    })
                    .catch(err => {
                        console.error('MathJax rendering error for post:', post.title, err);
                    });
            } catch (err) {
                console.error('Error while calling MathJax.typesetPromise() for post:', post.title, err);
            }
        });
    })
    .catch(error => {
        console.error('Error fetching blog posts:', error);
    });
