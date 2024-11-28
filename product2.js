const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port =  3000;

// Enable CORS to allow frontend communication
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Handle requests for /favicon.ico to prevent 404 error
app.get('/favicon.ico', (req, res) => res.status(204));  // Return a 204 No Content response

// Connect to MongoDB (replace with your MongoDB URI)
mongoose.connect('mongodb://localhost:27017/clickCountDB')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Error connecting to MongoDB:", err));

// Define a schema for the click count
const clickCountSchema = new mongoose.Schema({
    count: { type: Number, default: 0 }
});

// Create a model for the click count schema
const ClickCount = mongoose.model('ClickCount', clickCountSchema);

// Endpoint to get the current global click count
app.get('/get-click-count', async (req, res) => {
    try {
        const clickCountData = await ClickCount.findOne();
        res.json({ clickCount: clickCountData ? clickCountData.count : 0 });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching click count' });
    }
});

// Endpoint to increment the global click count
app.post('/increment-click', async (req, res) => {
    try {
        const clickCountData = await ClickCount.findOne();
        if (clickCountData) {
            clickCountData.count++;
            await clickCountData.save();
        } else {
            // If no click count exists, create a new record
            await ClickCount.create({ count: 1 });
        }
        res.json({ clickCount: clickCountData ? clickCountData.count : 1 });
    } catch (err) {
        res.status(500).json({ message: 'Error updating click count' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
