// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, 'static')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/birkenstock', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Payment Schema
const paymentSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    cardNumber: String,
    cardExpiry: {
        month: String,
        year: String
    },
    cardCVV: String,
    product: String,
    price: Number,
    timestamp: { type: Date, default: Date.now }
});

// Payment Model
const Payment = mongoose.model('Payment', paymentSchema);

// API Route for payment submission
app.post('/api/submit-payment', async (req, res) => {
    try {
        // IMPORTANT: In a production environment, you should:
        // 1. Validate the payment data
        // 2. Use a payment processor API (like Stripe, PayPal)
        // 3. Never store raw credit card information in your database
        
        // For this demo, we'll store a simplified version without the sensitive card data
        const paymentData = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            product: req.body.product,
            price: req.body.price,
            timestamp: req.body.timestamp
            // Note: We're deliberately NOT saving the card details to MongoDB
        };
        
        const payment = new Payment(paymentData);
        await payment.save();
        
        res.status(200).json({ success: true, message: 'Payment recorded successfully' });
    } catch (error) {
        console.error('Error saving payment:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Serve the HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Chat endpoint for your existing chat functionality
app.post('/chat', (req, res) => {
    // Your existing chat handling code
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));