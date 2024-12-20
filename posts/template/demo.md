---
date: "2024-12-18"  # Date of the post
description: "An introduction to calculus, focusing on limits and derivatives. $$f(x) = x^2 + 3x + 2$$ and its derivative."
title: "Introduction to Calculus: Limits and Derivatives"  # Title of the post
category: "Applied Algebraic Number Theory"  # Category name
---

ok those will be the names that it generates in the json but for the front matter lets map them to something else so in front matter post_date becomes date:, description: will stay the same, post_name will be title:, category_name: will be category: it will update the post link in the json by the name of the md file its reading for ex post1.md will be post1.html and it knows the directories that the files go to so itt will just add that link under post_link in the json. 



It will take the category named put it in all lower case for ex. applied-algebraic-number-theory.html, and check categories > html, for that file
if the file exisits it will add that into the "category_link:" section of the json if the file does not exists it will create for example "applied-algebraic-number-theory.html"
based on category_template.html, it will create "applied-algebraic-number-theory.html" and while creating it link it to "applied-algebraic-number-theory.js" which it is going to generate in 
the categories > js   directory based on category_template.js, all generated category html pages will be linked to categories/css/categories.css and pages/css/styles.css 

here is category_template.html

<!DOCTYPE html>
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
        <h1 id="category-name">Category Name</h1>
        <!-- Table to display posts in the category -->
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

    <script src="/pages/js/category_template.js"></script>
</body>
</html>





here is category_template.js

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('table tbody');
    const categoryNameElement = document.getElementById('category-name');

    // Extract category name from the URL (e.g., ?category=Math)
    const urlParams = new URLSearchParams(window.location.search);
    const categoryName = urlParams.get('category');

    if (!categoryName) {
        categoryNameElement.textContent = "Category Not Found";
        return;
    }

    // Update the category name in the page header
    categoryNameElement.textContent = categoryName;

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

            // Filter posts by the current category
            const categoryPosts = posts.filter(post => post.category_name === categoryName);

            if (categoryPosts.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="2">No posts found in this category.</td></tr>`;
                return;
            }

            // Populate the table dynamically
            categoryPosts.forEach(post => {
                const row = document.createElement('tr');

                // Create post title cell with a link
                const titleCell = document.createElement('td');
                const postLink = document.createElement('a');
                postLink.href = post.post_link;
                postLink.textContent = post.post_title;
                postLink.classList.add('post-link'); // Add a specific class for styling
                titleCell.appendChild(postLink);

                // Create post date cell
                const dateCell = document.createElement('td');
                dateCell.textContent = post.post_date;

                // Append cells to the row
                row.appendChild(titleCell);
                row.appendChild(dateCell);

                // Append row to the table body
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error loading or parsing posts.json:', error);
        });
});
