// Function to fetch and process the posts data
fetch('/pages/json/posts.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch posts data');
        }
        return response.json();
    })
    .then(data => {
        const categories = {};

        // Loop through the blog posts and count the posts per category
        data.blog_posts.forEach(post => {
            const category = post.category_name;
            if (categories[category]) {
                categories[category]++;
            } else {
                categories[category] = 1;
            }
        });

        // Get the category table body
        const tableBody = document.querySelector('#category-table tbody');

        // Loop through the categories object and add rows to the table
        for (let category in categories) {
            const row = document.createElement('tr');

            // Category name cell
            const categoryCell = document.createElement('td');
            categoryCell.textContent = category;
            row.appendChild(categoryCell);

            // Post count cell
            const postCountCell = document.createElement('td');
            postCountCell.textContent = categories[category];
            row.appendChild(postCountCell);

            // Append the row to the table body
            tableBody.appendChild(row);
        }
    })
    .catch(error => {
        console.error('Error fetching or processing the data:', error);
    });
