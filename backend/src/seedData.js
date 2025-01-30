const mongoose = require('mongoose');
const Ad = require('./models/Ads');

const sampleAds = [
  {
    title: 'iPhone 13 Pro Max',
    description: 'Brand new iPhone 13 Pro Max, 256GB, Pacific Blue. Complete box with all accessories.',
    price: 109999,
    category: 'Mobile Phones',
    image: 'https://via.placeholder.com/400x300?text=iPhone+13+Pro+Max',
    location: 'Mumbai',
    seller: 'John Doe',
    contact: '+91 9876543210'
  },
  {
    title: 'Honda City 2022',
    description: 'Honda City 2022 Model, Petrol, Automatic transmission, Only 5000 km driven.',
    price: 1200000,
    category: 'Cars',
    image: 'https://via.placeholder.com/400x300?text=Honda+City+2022',
    location: 'Delhi',
    seller: 'Jane Smith',
    contact: '+91 9876543211'
  },
  {
    title: 'Royal Enfield Classic 350',
    description: 'Royal Enfield Classic 350, 2021 model, Single owner, Well maintained.',
    price: 150000,
    category: 'Motorcycles',
    image: 'https://via.placeholder.com/400x300?text=Royal+Enfield',
    location: 'Bangalore',
    seller: 'Mike Johnson',
    contact: '+91 9876543212'
  },
  {
    title: '3BHK Apartment',
    description: 'Spacious 3BHK apartment with modern amenities, 24/7 security, and parking.',
    price: 7500000,
    category: 'Houses & Apartments',
    image: 'https://via.placeholder.com/400x300?text=3BHK+Apartment',
    location: 'Pune',
    seller: 'Real Estate Pro',
    contact: '+91 9876543213'
  },
  {
    title: 'Honda Activa 6G',
    description: 'New Honda Activa 6G with disc brake, 2023 model.',
    price: 75000,
    category: 'Scooters',
    image: 'https://via.placeholder.com/400x300?text=Honda+Activa',
    location: 'Chennai',
    seller: 'Sam Wilson',
    contact: '+91 9876543214'
  },
  {
    title: 'Tata Ace Gold',
    description: 'Commercial vehicle in excellent condition, perfect for business.',
    price: 450000,
    category: 'Commercial Vehicles',
    image: 'https://via.placeholder.com/400x300?text=Tata+Ace',
    location: 'Hyderabad',
    seller: 'Commercial Motors',
    contact: '+91 9876543215'
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing ads
    await Ad.deleteMany({});
    
    // Insert sample ads
    await Ad.insertMany(sampleAds);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Connect to MongoDB and seed data
mongoose.connect('mongodb://localhost:27017/olx', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log('Connected to MongoDB');
  seedDatabase();
}).catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
