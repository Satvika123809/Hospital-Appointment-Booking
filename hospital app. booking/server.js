const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost', // Change if using a remote database
    user: 'root',      // Replace with your DB username
    password: '',      // Replace with your DB password
    database: 'face_recognition' // Replace with your DB name
});

// Connect to database
db.connect(err => {
    if (err) throw err;
    console.log('Connected to database.');
});

// API to save user login data
app.post('/saveLogin', (req, res) => {
    const { userId, success, timestamp } = req.body;

    const query = 'INSERT INTO login_attempts (user_id, success, timestamp) VALUES (?, ?, ?)';
    db.query(query, [userId, success, timestamp], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Database error');
        } else {
            res.send('Login saved');
        }
    });
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000.');
});
