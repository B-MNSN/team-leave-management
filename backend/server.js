require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5174', // Adjust this to your frontend URL
    credentials: true,
    methods: ["GET","POST","PUT","DELETE", "PATCH"],
    allowedHeaders: ["Content-Type","Authorization"]
}));

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

// Routes
app.use('/auth', require('./src/routes/authRoutes'));
app.use('/leave', require('./src/routes/leaveRoutes'));

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});