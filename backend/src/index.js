const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Ad = require('./models/Ads');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable detailed logging for mongoose
mongoose.set('debug', true);

// Middleware
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// MongoDB Connection URL
const MONGODB_URL = 'mongodb://127.0.0.1:27017/olx';

// Connect to MongoDB with all options explicitly set
const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB at:', MONGODB_URL);
        
        const conn = await mongoose.connect(MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
        
        // Check database connection
        const dbState = mongoose.connection.readyState;
        console.log('Database state:', {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting',
        }[dbState]);

        // After successful connection, check and seed data
        const count = await Ad.countDocuments();
        console.log('Current number of ads:', count);

        if (count === 0) {
            const sampleAds = [
                {
                    title: "2022 Honda City ZX",
                    description: "Single owner, well maintained, all service records available. Premium sedan with sunroof and leather seats.",
                    price: 1200000,
                    category: "Cars",
                    image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/2023-city-exterior-right-front-three-quarter.jpeg?isig=0&q=80",
                    location: "Mumbai",
                    seller: "John Doe",
                    contact: "9876543210"
                },
                {
                    title: "iPhone 13 Pro Max",
                    description: "256GB, Perfect condition, under warranty, all accessories included",
                    price: 85000,
                    category: "Mobile Phones",
                    image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-13-pro-max-2.jpg",
                    location: "Delhi",
                    seller: "Jane Smith",
                    contact: "9876543211"
                },
                {
                    title: "3 BHK Luxury Apartment",
                    description: "Spacious 3 BHK with modern amenities, 24/7 security, swimming pool, and gym",
                    price: 8500000,
                    category: "Houses & Apartments",
                    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                    location: "Bangalore",
                    seller: "Real Estate Pro",
                    contact: "9876543212"
                },
                {
                    title: "Royal Enfield Classic 350",
                    description: "2021 model, mint condition, all papers clear, dual channel ABS",
                    price: 165000,
                    category: "Motorcycles",
                    image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/44686/royal-enfield-classic-350-right-front-three-quarter.jpeg?isig=0&q=80",
                    location: "Chennai",
                    seller: "Bike Lover",
                    contact: "9876543213"
                },
                {
                    title: "MacBook Pro M1",
                    description: "13-inch, 512GB SSD, 16GB RAM, AppleCare+ till 2024",
                    price: 110000,
                    category: "Electronics",
                    image: "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                    location: "Hyderabad",
                    seller: "Tech Enthusiast",
                    contact: "9876543214"
                },
                {
                    title: "Honda Activa 6G",
                    description: "2023 model, only 2000km driven, best mileage",
                    price: 75000,
                    category: "Scooters",
                    image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/103183/activa-6g-right-front-three-quarter.jpeg?isig=0&q=80",
                    location: "Pune",
                    seller: "Daily Commuter",
                    contact: "9876543215"
                },
                {
                    title: "Tata Nexon EV",
                    description: "2022 model, extended warranty, fast charging enabled",
                    price: 1450000,
                    category: "Cars",
                    image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/42611/nexon-ev-exterior-right-front-three-quarter.jpeg?isig=0&q=80",
                    location: "Kolkata",
                    seller: "EV Enthusiast",
                    contact: "9876543216"
                },
                {
                    title: "2 BHK Furnished Flat",
                    description: "Ready to move, fully furnished, prime location",
                    price: 4500000,
                    category: "Houses & Apartments",
                    image: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                    location: "Mumbai",
                    seller: "Property Expert",
                    contact: "9876543217"
                },
                {
                    title: "Samsung Galaxy S23 Ultra",
                    description: "512GB, 5G, S Pen included, box packed",
                    price: 115000,
                    category: "Mobile Phones",
                    image: "https://images.samsung.com/is/image/samsung/p6pim/in/2302/gallery/in-galaxy-s23-s918-sm-s918bzgcins-thumb-534863401",
                    location: "Delhi",
                    seller: "Gadget Pro",
                    contact: "9876543218"
                },
                {
                    title: "Mahindra Thar",
                    description: "2023 model, 4x4, hardtop, diesel variant",
                    price: 1650000,
                    category: "Cars",
                    image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/40087/thar-exterior-right-front-three-quarter-11.jpeg?q=80",
                    location: "Bangalore",
                    seller: "Adventure Seeker",
                    contact: "9876543219"
                },
                {
                    title: "Commercial Shop Space",
                    description: "Prime location, 500 sq ft, ready for business",
                    price: 9500000,
                    category: "Commercial Property",
                    image: "https://images.pexels.com/photos/264507/pexels-photo-264507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                    location: "Chennai",
                    seller: "Commercial Realtor",
                    contact: "9876543220"
                },
                {
                    title: "Yamaha R15 V4",
                    description: "Racing blue, ABS, quick shifter, 1000km driven",
                    price: 175000,
                    category: "Motorcycles",
                    image: "https://imgd.aeplcdn.com/1280x720/n/cw/ec/102709/r15-v4-right-front-three-quarter.jpeg?isig=0&q=80",
                    location: "Hyderabad",
                    seller: "Sports Bike Lover",
                    contact: "9876543221"
                }
            ];

            await Ad.insertMany(sampleAds);
            console.log('Sample data inserted successfully');
        }

    } catch (error) {
        console.error('MongoDB connection error:', {
            message: error.message,
            name: error.name,
            code: error.code,
            stack: error.stack
        });
        process.exit(1);
    }
};

// Connect to database
connectDB();

// Monitor database connection
mongoose.connection.on('error', err => {
    console.error('MongoDB error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

// Routes
app.use('/api/auth', authRoutes);

// Basic routes
app.get('/', (req, res) => {
    res.json({
        status: 'Server is running',
        mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Ad routes
app.get('/api/ads', async (req, res) => {
    try {
        console.log('GET /api/ads - Fetching all ads');
        const ads = await Ad.find().sort({ createdAt: -1 });
        console.log(`Found ${ads.length} ads`);
        res.json(ads);
    } catch (err) {
        console.error('Error fetching ads:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/ads/category/:category', async (req, res) => {
    try {
        const category = decodeURIComponent(req.params.category);
        console.log(`GET /api/ads/category/${category} - Fetching category ads`);
        const ads = await Ad.find({
            category: { $regex: new RegExp(category, 'i') }
        }).sort({ createdAt: -1 });
        console.log(`Found ${ads.length} ads in category ${category}`);
        res.json(ads);
    } catch (err) {
        console.error('Error fetching category ads:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/ads', async (req, res) => {
    try {
        console.log('POST /api/ads - Creating new ad');
        const ad = new Ad(req.body);
        const savedAd = await ad.save();
        console.log('Ad created successfully:', savedAd._id);
        res.status(201).json(savedAd);
    } catch (err) {
        console.error('Error creating ad:', err);
        res.status(400).json({ error: err.message });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('MongoDB status:', mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected');
});

// Handle server errors
server.on('error', (err) => {
    console.error('Server error:', err);
});