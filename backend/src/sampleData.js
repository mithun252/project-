const mongoose = require('mongoose');
const Ad = require('./models/Ads');

const sampleAds = [
    // Cars
    {
        title: "2022 Honda City - Excellent Condition",
        description: "Single owner, well maintained Honda City with low mileage. All service records available.",
        price: 1200000,
        category: "Cars",
        image: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Honda/City/9710/1677914238296/front-left-side-47.jpg",
        location: "Mumbai",
        seller: "Rahul Sharma",
        contact: "9876543210"
    },
    {
        title: "2021 Hyundai Creta SX",
        description: "Automatic transmission, sunroof, all features working perfectly.",
        price: 1500000,
        category: "Cars",
        image: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Hyundai/Creta/6775/1584360708758/front-left-side-47.jpg",
        location: "Delhi",
        seller: "Amit Patel",
        contact: "9876543211"
    },

    // Motorcycles
    {
        title: "Royal Enfield Classic 350",
        description: "2022 model, mint condition, all papers clear",
        price: 180000,
        category: "Motorcycles",
        image: "https://bd.gaadicdn.com/processedimages/royal-enfield/classic350/source/classic350_2_62e8aec2c6a3f.jpg",
        location: "Bangalore",
        seller: "Vijay Kumar",
        contact: "9876543212"
    },
    {
        title: "Yamaha R15 V4",
        description: "Racing blue color, excellent performance, recently serviced",
        price: 160000,
        category: "Motorcycles",
        image: "https://bd.gaadicdn.com/processedimages/yamaha/yamaha-r15-v4/source/yamaha-r15-v4_2_62e8aec2c6a3f.jpg",
        location: "Chennai",
        seller: "Karthik R",
        contact: "9876543213"
    },

    // Mobile Phones
    {
        title: "iPhone 13 Pro - 256GB",
        description: "Perfect condition, under warranty, all accessories included",
        price: 85000,
        category: "Mobile Phones",
        image: "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-13-pro-max-graphite-select?wid=470&hei=556&fmt=jpeg&qlt=95&.v=1631652956000",
        location: "Pune",
        seller: "Priya Singh",
        contact: "9876543214"
    },
    {
        title: "Samsung Galaxy S21",
        description: "8GB RAM, 128GB storage, excellent camera quality",
        price: 65000,
        category: "Mobile Phones",
        image: "https://images.samsung.com/is/image/samsung/p6pim/in/galaxy-s21/gallery/in-galaxy-s21-5g-g991-sm-g991bzsdinu-thumb-368338803",
        location: "Hyderabad",
        seller: "Ravi Teja",
        contact: "9876543215"
    },

    // Houses & Apartments
    {
        title: "3BHK Luxury Apartment",
        description: "Fully furnished, modern amenities, prime location",
        price: 8500000,
        category: "Houses & Apartments",
        image: "https://is1-2.housingcdn.com/4f2250e8/1365e13e1b9e2104e99e53e8f88ee288/v0/medium.jpg",
        location: "Mumbai",
        seller: "Deepak Verma",
        contact: "9876543216"
    },
    {
        title: "2BHK Independent House",
        description: "Newly constructed, car parking, garden area",
        price: 6500000,
        category: "Houses & Apartments",
        image: "https://is1-3.housingcdn.com/4f2250e8/1365e13e1b9e2104e99e53e8f88ee288/v0/medium.jpg",
        location: "Bangalore",
        seller: "Suresh Kumar",
        contact: "9876543217"
    },

    // Scooters
    {
        title: "Honda Activa 6G",
        description: "2023 model, excellent mileage, scratch-free condition",
        price: 75000,
        category: "Scooters",
        image: "https://bd.gaadicdn.com/processedimages/honda/activa-6g/source/activa-6g_2_62e8aec2c6a3f.jpg",
        location: "Delhi",
        seller: "Rajesh Singh",
        contact: "9876543218"
    },
    {
        title: "TVS Jupiter",
        description: "Low kilometers, well maintained, all papers clear",
        price: 65000,
        category: "Scooters",
        image: "https://bd.gaadicdn.com/processedimages/tvs/jupiter/source/jupiter_2_62e8aec2c6a3f.jpg",
        location: "Chennai",
        seller: "Manoj Kumar",
        contact: "9876543219"
    },

    // Commercial Vehicles
    {
        title: "Tata Ace Gold",
        description: "Commercial mini truck, perfect for business",
        price: 450000,
        category: "Commercial Vehicles",
        image: "https://bd.gaadicdn.com/processedimages/tata/ace-gold/source/ace-gold_2_62e8aec2c6a3f.jpg",
        location: "Mumbai",
        seller: "Rakesh Patel",
        contact: "9876543220"
    },
    {
        title: "Mahindra Pickup",
        description: "Diesel variant, good condition, ready for commercial use",
        price: 550000,
        category: "Commercial Vehicles",
        image: "https://bd.gaadicdn.com/processedimages/mahindra/bolero-pickup/source/bolero-pickup_2_62e8aec2c6a3f.jpg",
        location: "Delhi",
        seller: "Sanjay Kumar",
        contact: "9876543221"
    }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/olx', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB');

        // Clear existing ads
        await Ad.deleteMany({});
        console.log('Cleared existing ads');

        // Insert sample ads
        await Ad.insertMany(sampleAds);
        console.log('Sample ads inserted successfully');

        // Disconnect from MongoDB
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seeding function
seedDatabase();
