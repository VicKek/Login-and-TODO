const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const dataPath = path.join(__dirname, 'users_data.json'); 

// Load all users from the file
app.get('/api/users', (req, res) => {
    fs.readFile(dataPath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading users_data.json:', err);
            return res.status(500).json({ error: 'Failed to read user data' });
        }

        try {
            const users = JSON.parse(data);
            res.json(users);
        } catch (e) {
            console.error('JSON parse error:', e);
            res.status(500).json({ error: 'Malformed JSON' });
        }
    });
});

// Save updated users (new tasks or users)
app.post('/api/users', (req, res) => {
    const users = req.body;
    fs.writeFile(dataPath, JSON.stringify(users, null, 2), err => {
        if (err) return res.status(500).json({ error: 'Failed to write data in file' });
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
