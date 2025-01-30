const mongoose = require('mongoose');
const Ad = require('../models/Ad');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const categories = [
  'Cars',
  'Motorcycles',
  'Mobile Phones',
  'Electronics',
  'Furniture',
  'Fashion',
  'Books',
  'Sports',
  'Properties'
];

const sampleAds = [
  // Cars
  {
    title: '2022 Honda City',
    description: 'Well maintained Honda City with low mileage. Single owner.',
    price: 1200000,
    category: 'Cars',
    location: 'Mumbai',
    image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/134287/city-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
  },
  {
    title: '2021 Hyundai Creta',
    description: 'Top model Hyundai Creta with all features. Perfect condition.',
    price: 1500000,
    category: 'Cars',
    location: 'Delhi',
    image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/141115/creta-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
  },
  {
    title: '2023 Tata Nexon',
    description: 'Brand new Tata Nexon with extended warranty.',
    price: 1100000,
    category: 'Cars',
    location: 'Bangalore',
    image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/144163/nexon-exterior-right-front-three-quarter.jpeg?isig=0&q=80',
  },

  // Motorcycles
  {
    title: 'Royal Enfield Classic 350',
    description: 'Classic 350 in mint condition. All documents up to date.',
    price: 180000,
    category: 'Motorcycles',
    location: 'Chennai',
    image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/44686/royal-enfield-classic-350-right-front-three-quarter.jpeg?q=80',
  },
  {
    title: 'Yamaha R15 V4',
    description: 'Sports bike with excellent performance. Low kilometers.',
    price: 200000,
    category: 'Motorcycles',
    location: 'Pune',
    image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/102709/right-front-three-quarter.jpeg?isig=0&q=80',
  },
  {
    title: 'KTM Duke 390',
    description: 'Powerful bike with recent service. Ready to ride.',
    price: 250000,
    category: 'Motorcycles',
    location: 'Hyderabad',
    image: 'https://imgd.aeplcdn.com/1280x720/n/cw/ec/1/versions/ktm-390-duke-bs-vi.jpeg?isig=0&q=80',
  },

  // Mobile Phones
  {
    title: 'iPhone 14 Pro',
    description: 'Latest iPhone model with all accessories. Under warranty.',
    price: 110000,
    category: 'Mobile Phones',
    location: 'Mumbai',
    image: 'https://m.media-amazon.com/images/I/61XO4bORHUL._SL1500_.jpg',
  },
  {
    title: 'Samsung S23 Ultra',
    description: 'Flagship Samsung phone with S-Pen. Mint condition.',
    price: 95000,
    category: 'Mobile Phones',
    location: 'Delhi',
    image: 'https://m.media-amazon.com/images/I/71Sa3dqTqGL._SL1500_.jpg',
  },
  {
    title: 'OnePlus 11',
    description: 'Latest OnePlus with fast charging. Full box.',
    price: 65000,
    category: 'Mobile Phones',
    location: 'Bangalore',
    image: 'https://m.media-amazon.com/images/I/61amb0CfMGL._SL1500_.jpg',
  },

  // Electronics
  {
    title: 'MacBook Pro M2',
    description: 'Latest MacBook with M2 chip. Perfect for professionals.',
    price: 150000,
    category: 'Electronics',
    location: 'Mumbai',
    image: 'https://m.media-amazon.com/images/I/61lYIKPieDL._SL1500_.jpg',
  },
  {
    title: 'Sony PS5',
    description: 'Brand new PS5 with extra controller. Sealed pack.',
    price: 45000,
    category: 'Electronics',
    location: 'Delhi',
    image: 'https://m.media-amazon.com/images/I/51mWHXY8hyL._SL1500_.jpg',
  },
  {
    title: 'iPad Pro 2023',
    description: 'Latest iPad Pro with Apple Pencil. Like new.',
    price: 85000,
    category: 'Electronics',
    location: 'Bangalore',
    image: 'https://m.media-amazon.com/images/I/81c+9BOQNWL._SL1500_.jpg',
  },

  // Furniture
  {
    title: 'L-Shaped Sofa Set',
    description: 'Modern sofa set with premium fabric. 6 months old.',
    price: 35000,
    category: 'Furniture',
    location: 'Mumbai',
    image: 'https://m.media-amazon.com/images/I/71Q12pA9qyL._SL1500_.jpg',
  },
  {
    title: 'Queen Size Bed',
    description: 'Solid wood bed with storage. Excellent condition.',
    price: 25000,
    category: 'Furniture',
    location: 'Delhi',
    image: 'https://m.media-amazon.com/images/I/71r6RapHE5L._SL1500_.jpg',
  },
  {
    title: 'Dining Table Set',
    description: '6 seater dining set with chairs. Teak wood.',
    price: 40000,
    category: 'Furniture',
    location: 'Bangalore',
    image: 'https://m.media-amazon.com/images/I/71G5KYOl5uL._SL1500_.jpg',
  },

  // Fashion
  {
    title: 'Designer Lehenga',
    description: 'Heavy work bridal lehenga. Worn once.',
    price: 15000,
    category: 'Fashion',
    location: 'Mumbai',
    image: 'https://m.media-amazon.com/images/I/71f9TQhi+ZL._UL1500_.jpg',
  },
  {
    title: 'Men\'s Suit',
    description: 'Raymond suit with perfect fitting. Like new.',
    price: 8000,
    category: 'Fashion',
    location: 'Delhi',
    image: 'https://m.media-amazon.com/images/I/61QwMfrVbaL._UL1500_.jpg',
  },
  {
    title: 'Nike Air Jordan',
    description: 'Original Air Jordans. Limited edition.',
    price: 12000,
    category: 'Fashion',
    location: 'Bangalore',
    image: 'https://m.media-amazon.com/images/I/71zBnRDaCpL._UL1500_.jpg',
  },

  // Books
  {
    title: 'Harry Potter Collection',
    description: 'Complete set of Harry Potter books. Hardcover.',
    price: 3000,
    category: 'Books',
    location: 'Mumbai',
    image: 'https://m.media-amazon.com/images/I/71rOzy4cyCL._AC_UY327_FMwebp_QL65_.jpg',
  },
  {
    title: 'UPSC Study Material',
    description: 'Complete set of UPSC books and notes.',
    price: 5000,
    category: 'Books',
    location: 'Delhi',
    image: 'https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UY327_FMwebp_QL65_.jpg',
  },
  {
    title: 'Engineering TextBooks',
    description: 'B.Tech Computer Science books. Latest editions.',
    price: 2000,
    category: 'Books',
    location: 'Bangalore',
    image: 'https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UY327_FMwebp_QL65_.jpg',
  },

  // Sports
  {
    title: 'Cricket Kit',
    description: 'MRF cricket kit with bat, pads, and helmet.',
    price: 8000,
    category: 'Sports',
    location: 'Mumbai',
    image: 'https://m.media-amazon.com/images/I/41YvYQh7BIL._SL1000_.jpg',
  },
  {
    title: 'Treadmill',
    description: 'Motorized treadmill with incline. 1 year old.',
    price: 25000,
    category: 'Sports',
    location: 'Delhi',
    image: 'https://m.media-amazon.com/images/I/71+P3NnVqbL._SL1500_.jpg',
  },
  {
    title: 'Tennis Racket',
    description: 'Wilson tennis racket. Professional grade.',
    price: 5000,
    category: 'Sports',
    location: 'Bangalore',
    image: 'https://m.media-amazon.com/images/I/71nXPXqQJuL._SL1500_.jpg',
  },

  // Properties
  {
    title: '3BHK Apartment',
    description: 'Spacious 3BHK with modern amenities. Prime location.',
    price: 8500000,
    category: 'Properties',
    location: 'Mumbai',
    image: 'https://m.media-amazon.com/images/I/71B7h-kz5gL._AC_UL480_FMwebp_QL65_.jpg',
  },
  {
    title: 'Commercial Shop',
    description: 'Shop in busy market area. Ready for possession.',
    price: 5000000,
    category: 'Properties',
    location: 'Delhi',
    image: 'https://m.media-amazon.com/images/I/81lK3q4NxqL._AC_UL480_FMwebp_QL65_.jpg',
  },
  {
    title: 'Villa with Garden',
    description: 'Luxury villa with swimming pool and garden.',
    price: 15000000,
    category: 'Properties',
    location: 'Bangalore',
    image: 'https://m.media-amazon.com/images/I/81VwKCMJyuL._AC_UL480_FMwebp_QL65_.jpg',
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/olx-clone', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Create a test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    let userId;

    if (!testUser) {
      const hashedPassword = await bcrypt.hash('password123', 8);
      const newUser = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        phone: '1234567890',
        location: 'Mumbai'
      });
      const savedUser = await newUser.save();
      userId = savedUser._id;
      console.log('Test user created');
    } else {
      userId = testUser._id;
      console.log('Using existing test user');
    }

    // Delete existing ads
    await Ad.deleteMany({});
    console.log('Deleted existing ads');

    // Add seller to each ad
    const adsWithSeller = sampleAds.map(ad => ({
      ...ad,
      seller: userId
    }));

    // Insert sample ads
    await Ad.insertMany(adsWithSeller);
    console.log('Sample ads inserted successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
