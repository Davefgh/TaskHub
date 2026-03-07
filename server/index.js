const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data
const products = [
    {
        id: 1,
        name: "ABC Dry Powder Fire Extinguisher (1kg)",
        price: 25.00,
        rating: 4.8,
        sales: 1200,
        image: "https://via.placeholder.com/300?text=Fire+Ext+1kg",
        category: "Dry Powder"
    },
    {
        id: 2,
        name: "CO2 Fire Extinguisher (2kg)",
        price: 45.00,
        rating: 4.9,
        sales: 850,
        image: "https://via.placeholder.com/300?text=CO2+Ext+2kg",
        category: "CO2"
    },
    {
        id: 3,
        name: "Water-Based Fire Extinguisher (9L)",
        price: 60.00,
        rating: 4.7,
        sales: 300,
        image: "https://via.placeholder.com/300?text=Water+Ext+9L",
        category: "Water"
    },
    {
        id: 4,
        name: "Premium Chrome Fire Extinguisher",
        price: 89.99,
        rating: 5.0,
        sales: 150,
        image: "https://via.placeholder.com/300?text=Chrome+Ext",
        category: "Designer"
    }
];

// Routes
app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id));
    if (!product) return res.status(404).send('Product not found');
    res.json(product);
});

app.get('/', (req, res) => {
    res.send('Fire Extinguisher Marketplace API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
