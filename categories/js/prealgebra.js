document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('table tbody');
    const categoryNameElement = document.getElementById('category-name');

    // Hardcoding category name (this will now be consistent for this category)
    const categoryName = "Prealgebra";  // Automatically inserted category name from front matter

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
});