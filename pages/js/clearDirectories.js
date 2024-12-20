const fs = require('fs');
const path = require('path');

// Paths to the directories you want to clear
const directoriesToClear = [
    'C:/Users/Kris Yotam/Documents/krisnewmathblog/posts/html',
    'C:/Users/Kris Yotam/Documents/krisnewmathblog/categories/html',
    'C:/Users/Kris Yotam/Documents/krisnewmathblog/categories/js'
];

// Function to delete all files in a directory
function clearDirectory(directoryPath) {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${directoryPath}:`, err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directoryPath, file);

            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(`Error getting stats of file ${filePath}:`, err);
                    return;
                }

                // If it's a file, delete it
                if (stats.isFile()) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error(`Error deleting file ${filePath}:`, err);
                        } else {
                            console.log(`Deleted file: ${filePath}`);
                        }
                    });
                }
            });
        });
    });
}

// Clear the specified directories
directoriesToClear.forEach(directory => {
    clearDirectory(directory);
});
