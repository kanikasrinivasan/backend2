const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Log to verify MONGO_URI is loaded
console.log('MONGO_URI:', process.env.MONGO_URI);

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Exit if MONGO_URI is not defined
if (!MONGO_URI) {
    console.error('Error: MONGO_URI is undefined. Please check your .env file.');
    process.exit(1);
}

// Middleware
app.use(express.json());

// Database connection function
const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,  // Optional in newer Mongoose versions
            useUnifiedTopology: true // Optional in newer Mongoose versions
        });
        console.log('Connected to MongoDB successfully!');
    } catch (error) {
        console.error('Database connection error:', error.message);
        setTimeout(connectDB, 5000); // Retry connection every 5 seconds
    }
};

// Call the database connection function
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
