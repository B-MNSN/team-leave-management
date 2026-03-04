require('dotenv').config();

const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Check Route
app.get('/', (req, res) => {
    res.json({ message: 'Team Leave Management API is running 🚀' });
});

// Global Error Handler (basic)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong'
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});