const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000; // Choose your preferred port
// Middleware to serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.urlencoded({ extended: true }));

// Route for "/"
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.post('/submit', (req, res) => {
    const { name, description } = req.body;

    // Define the path to db.json
    const dbPath = path.join(__dirname, 'db.json');

    // Step 1: Read existing data from db.json
    fs.readFile(dbPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading db.json:', err);
            return res.status(500).send('Internal Server Error');
        }

        // Step 2: Parse the existing data (or create an empty array if the file is empty)
        let tasks = [];
        if (data) {
            try {
                tasks = JSON.parse(data);
            } catch (parseErr) {
                console.error('Error parsing db.json:', parseErr);
                return res.status(500).send('Internal Server Error');
            }
        }

        // Step 3: Append the new task
        const newTask = { id: Date.now(), name, description }; // Add a unique ID
        tasks.push(newTask);

        // Step 4: Write the updated data back to db.json
        fs.writeFile(dbPath, JSON.stringify(tasks, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing to db.json:', writeErr);
                return res.status(500).send('Internal Server Error');
            }

            console.log('New task added:', newTask);
            res.send(`Task "${name}" added successfully!`);
        });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
