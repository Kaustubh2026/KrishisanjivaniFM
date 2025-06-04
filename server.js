const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Hardcoded data
const users = [
    { id: 1, name: 'Test Farmer', email: 'farmer@test.com', role: 'farmer' },
    { id: 2, name: 'Test Merchant', email: 'merchant@test.com', role: 'merchant' }
];

const transactions = [
    {
        id: 1,
        user: 1,
        commodity: 'rice',
        quantity: 1000,
        price: 45,
        type: 'supply',
        status: 'completed',
        createdAt: new Date()
    }
];

const commodities = [
    {
        name: 'rice',
        currentStock: 2500000,
        msp: 40,
        unit: 'kg',
        bufferStock: {
            minimum: 1000000,
            maximum: 5000000
        }
    },
    {
        name: 'wheat',
        currentStock: 1800000,
        msp: 35,
        unit: 'kg',
        bufferStock: {
            minimum: 800000,
            maximum: 4000000
        }
    }
];

// Routes

// User Authentication
app.post('/api/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const newUser = {
        id: users.length + 1,
        name,
        email,
        role
    };
    users.push(newUser);
    res.status(201).send({ user: newUser, token: 'dummy_token' });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (user) {
        res.send({ user, token: 'dummy_token' });
    } else {
        res.status(400).send({ error: 'Invalid login credentials' });
    }
});

// Price Prediction
app.get('/api/predict/:commodity', (req, res) => {
    const commodity = req.params.commodity;
    const predictions = {
        rice: { min: 42, max: 48, trend: 'up', msp: 40 },
        wheat: { min: 38, max: 43, trend: 'stable', msp: 35 },
        sugar: { min: 35, max: 40, trend: 'down', msp: 32 },
        pulses: { min: 80, max: 90, trend: 'up', msp: 75 }
    };
    res.send(predictions[commodity] || { error: 'Commodity not found' });
});

// Transaction Management
app.post('/api/transactions', (req, res) => {
    const newTransaction = {
        id: transactions.length + 1,
        ...req.body,
        createdAt: new Date()
    };
    transactions.push(newTransaction);
    res.status(201).send(newTransaction);
});

app.get('/api/transactions', (req, res) => {
    res.send(transactions);
});

// Buffer Stock Management
app.get('/api/buffer-stock', (req, res) => {
    const bufferStock = commodities.map(c => ({
        name: c.name,
        currentStock: c.currentStock
    }));
    res.send(bufferStock);
});

// Market Status
app.get('/api/market-status', (req, res) => {
    const marketStatus = {
        demand: 'High',
        activeMerchants: 15,
        bufferStock: 2.5
    };
    res.send(marketStatus);
});

// OTP Generation
app.post('/api/generate-otp', (req, res) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    res.send({ otp });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 