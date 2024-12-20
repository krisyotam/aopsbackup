document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('table tbody');

    // Fetch the JSON file containing blog posts
    fetch('/pages/json/posts.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load posts.json');
            }
            return response.json();
        })
        .then(data => {
            const posts = data.blog_posts;
            const categories = new Map();

            // Aggregate category data
            posts.forEach(post => {
                const { category_name, category_link } = post;
                if (categories.has(category_name)) {
                    categories.get(category_name).count++;
                } else {
                    categories.set(category_name, { link: category_link, count: 1 });
                }
            });

            // Populate the table dynamically
            categories.forEach((value, key) => {
                const row = document.createElement('tr');

                // Create category name cell with a link
                const categoryCell = document.createElement('td');
                const categoryLink = document.createElement('a');
                categoryLink.href = value.link;
                categoryLink.textContent = key;
                categoryLink.classList.add('category-link'); // Add a specific class for styling

                // Optionally remove inline styles if any
                categoryLink.style.textDecoration = 'none'; // Ensure no inline text decoration

                categoryCell.appendChild(categoryLink);

                // Create post count cell
                const countCell = document.createElement('td');
                countCell.textContent = value.count;

                // Append cells to the row
                row.appendChild(categoryCell);
                row.appendChild(countCell);

                // Append row to the table body
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading or parsing posts.json:', error);
        });
});
