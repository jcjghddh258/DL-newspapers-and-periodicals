const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 8080;

// Configure storage for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')){
    fs.mkdirSync('uploads');
}

// In-memory store for messages
let messages = [];

// Get all messages
app.get('/messages', (req, res) => {
    res.json(messages);
});

// Post a new message (text or file)
app.post('/messages', upload.single('file'), (req, res) => {
    let message = {
        text: req.body.text || null,
        file: req.file ? `/uploads/${req.file.filename}` : null
    };
    messages.push(message);
    res.status(201).json({ status: 'Message received!' });
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Server running at "http://192.168.1.7:${port}"`);
});