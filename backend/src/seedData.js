const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Ad = require('./models/Ad');

const seedDatabase = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/olx_new', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Clear existing data
        await User.deleteMany({});
        await Ad.deleteMany({});

        // Create a test user
        const hashedPassword = await bcrypt.hash('password123', 10);
        const user = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: hashedPassword,
            phone: '1234567890',
            location: 'Mumbai'
        });

        // Create sample ads for each category
        const sampleAds = [
            // Mobile Phones
            {
                title: 'iPhone 14 Pro Max',
                description: '256GB, Deep Purple, 1 year old, excellent condition with original accessories',
                price: 89999,
                category: 'Mobile Phones',
                location: 'Mumbai',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-7inch-deeppurple?wid=5120&hei=2880&fmt=p-jpg',
                seller: user._id,
                features: ['5G', 'A16 Bionic', '48MP Camera'],
                condition: 'Like New'
            },
            {
                title: 'Samsung Galaxy S23 Ultra',
                description: '512GB, Phantom Black, 6 months old, with S Pen and Samsung Care+',
                price: 99999,
                category: 'Mobile Phones',
                location: 'Delhi',
                image: 'https://images.samsung.com/in/smartphones/galaxy-s23-ultra/images/galaxy-s23-ultra-highlights-kv.jpg',
                seller: user._id,
                features: ['S Pen', '200MP Camera', '5G'],
                condition: 'Excellent'
            },
            {
                title: 'OnePlus 11 5G',
                description: '256GB, Titan Black, 3 months old, with warranty and all accessories',
                price: 59999,
                category: 'Mobile Phones',
                location: 'Bangalore',
                image: 'https://oasis.opstatics.com/content/dam/oasis/page/2023/na/oneplus-11/specs/black-img.png',
                seller: user._id,
                features: ['Snapdragon 8 Gen 2', '50MP Camera', '100W Charging'],
                condition: 'Like New'
            },

            // Cars
            {
                title: 'Hyundai Creta SX 2022',
                description: 'Single owner, 15,000 km driven, all service records available, panoramic sunroof',
                price: 1500000,
                category: 'Cars',
                location: 'Bangalore',
                image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/141115/creta-exterior-right-front-three-quarter.jpeg',
                seller: user._id,
                features: ['Automatic', 'Petrol', 'Sunroof'],
                condition: 'Used'
            },
            {
                title: 'Toyota Fortuner 2023',
                description: 'Legender variant, 5,000 km driven, white color, extended warranty',
                price: 4500000,
                category: 'Cars',
                location: 'Mumbai',
                image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/44709/fortuner-exterior-right-front-three-quarter-19.jpeg',
                seller: user._id,
                features: ['4x4', 'Diesel', 'Automatic'],
                condition: 'Like New'
            },
            {
                title: 'Tata Nexon EV 2023',
                description: 'Electric SUV, Long Range variant, 2,000 km driven, home charger included',
                price: 1899999,
                category: 'Cars',
                location: 'Pune',
                image: 'https://imgd.aeplcdn.com/664x374/n/cw/ec/149123/nexon-ev-exterior-right-front-three-quarter-3.jpeg',
                seller: user._id,
                features: ['Electric', '465km Range', 'Connected Car'],
                condition: 'Like New'
            },

            // Electronics
            {
                title: 'MacBook Pro M2 Pro',
                description: '16-inch, 32GB RAM, 1TB SSD, Space Gray, AppleCare+ till 2025',
                price: 199999,
                category: 'Electronics',
                location: 'Pune',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=904&hei=840&fmt=jpeg',
                seller: user._id,
                features: ['M2 Pro', '32GB RAM', '1TB SSD'],
                condition: 'New'
            },
            {
                title: 'Sony PlayStation 5',
                description: 'Digital Edition, 2 controllers, 5 games included, 1 year warranty remaining',
                price: 39999,
                category: 'Electronics',
                location: 'Chennai',
                image: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21',
                seller: user._id,
                features: ['Digital Edition', '825GB SSD', '4K Gaming'],
                condition: 'Like New'
            },
            {
                title: 'Samsung 65" QLED 4K TV',
                description: 'QN90B Neo QLED, Smart TV, Gaming Hub, warranty valid',
                price: 159999,
                category: 'Electronics',
                location: 'Delhi',
                image: 'https://images.samsung.com/is/image/samsung/p6pim/in/qa65qn90baklxl/gallery/in-qled-qn90b-qa65qn90baklxl-531504564?$650_519_PNG$',
                seller: user._id,
                features: ['4K', 'Gaming Mode', 'Smart TV'],
                condition: 'New'
            },

            // Furniture
            {
                title: 'L-Shaped Sofa Set',
                description: 'Premium leather, 6-seater, with ottoman, 6 months old',
                price: 45000,
                category: 'Furniture',
                location: 'Hyderabad',
                image: 'https://www.godrejinterio.com/imagestore/B2C/56101543SD00046/56101543SD00046_01_1500x1500.png',
                seller: user._id,
                features: ['Leather', '6-Seater', 'Ottoman'],
                condition: 'Used'
            },
            {
                title: 'Queen Size Bed',
                description: 'Solid wood, with storage, mattress included, warranty available',
                price: 35000,
                category: 'Furniture',
                location: 'Delhi',
                image: 'https://www.godrejinterio.com/imagestore/B2C/ADVENTQUEEN/ADVENTQUEEN_01_1500x1500.png',
                seller: user._id,
                features: ['Storage', 'Mattress', 'Warranty'],
                condition: 'New'
            },
            {
                title: 'Study Table with Bookshelf',
                description: 'Modern design, engineered wood, perfect for WFH setup',
                price: 12999,
                category: 'Furniture',
                location: 'Bangalore',
                image: 'https://www.godrejinterio.com/imagestore/B2C/IWCSTUDYUNITMAXLAM/IWCSTUDYUNITMAXLAM_01_1500x1500.png',
                seller: user._id,
                features: ['Bookshelf', 'Cable Management', 'Drawer'],
                condition: 'New'
            },

            // Fashion
            {
                title: 'Nike Air Jordan 1 High OG',
                description: 'Chicago colorway, Size UK 9, Brand new with box',
                price: 15999,
                category: 'Fashion',
                location: 'Mumbai',
                image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/f51d992b-3a71-4945-8135-be3496d3ea71/air-jordan-1-high-og-shoes-GMMT8r.png',
                seller: user._id,
                features: ['Original', 'UK 9', 'Limited Edition'],
                condition: 'New'
            },
            {
                title: 'Apple Watch Series 8',
                description: '45mm, GPS + Cellular, Stainless Steel, Multiple bands',
                price: 45000,
                category: 'Fashion',
                location: 'Bangalore',
                image: 'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/MKUQ3_VW_34FR+watch-45-stainless-gold-cell-8s_VW_34FR_WF_CO+watch-face-45-nike-meridian-midnight_VW_34FR_WF_CO?wid=1400&hei=1400',
                seller: user._id,
                features: ['GPS + Cellular', '45mm', 'Stainless Steel'],
                condition: 'Like New'
            },
            {
                title: 'Ray-Ban Aviator Classic',
                description: 'Gold frame with green G-15 lenses, with case',
                price: 7999,
                category: 'Fashion',
                location: 'Chennai',
                image: 'https://assets.ray-ban.com/is/image/RayBan/805289602057__STD__shad__qt.png',
                seller: user._id,
                features: ['Polarized', 'UV Protection', 'Classic Style'],
                condition: 'New'
            },

            // Books
            {
                title: 'Complete Harry Potter Series',
                description: 'Hardcover, Special Edition Box Set, All 7 Books',
                price: 4999,
                category: 'Books',
                location: 'Delhi',
                image: 'https://m.media-amazon.com/images/I/71rOzy4cyAL._AC_UF1000,1000_QL80_.jpg',
                seller: user._id,
                features: ['Hardcover', 'Box Set', 'Special Edition'],
                condition: 'New'
            },
            {
                title: 'Rich Dad Poor Dad',
                description: '20th Anniversary Edition, Perfect condition',
                price: 299,
                category: 'Books',
                location: 'Mumbai',
                image: 'https://m.media-amazon.com/images/I/81bsw6fnUiL._AC_UF1000,1000_QL80_.jpg',
                seller: user._id,
                features: ['Paperback', 'Best Seller', 'Finance'],
                condition: 'Like New'
            },
            {
                title: 'Atomic Habits',
                description: 'Hardcover, James Clear, International Edition',
                price: 499,
                category: 'Books',
                location: 'Bangalore',
                image: 'https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UF1000,1000_QL80_.jpg',
                seller: user._id,
                features: ['Hardcover', 'Self Help', 'Best Seller'],
                condition: 'New'
            },

            // Sports
            {
                title: 'MRF Cricket Bat',
                description: 'English Willow, Grade 1, with bat cover',
                price: 12999,
                category: 'Sports',
                location: 'Chennai',
                image: 'https://storage.sg.content-cdn.io/cdn-cgi/image/width=500,height=500,quality=75,format=auto,fit=cover,g=top/in-resources/b368029c-a4dd-448a-a888-58348cb1b144/Images/ProductImages/Source/MRFGW.jpg',
                seller: user._id,
                features: ['English Willow', 'Grade 1', 'Professional'],
                condition: 'New'
            },
            {
                title: 'Yonex Badminton Racket',
                description: 'Astrox 88D Pro, with cover and extra grips',
                price: 8999,
                category: 'Sports',
                location: 'Pune',
                image: 'https://www.yonex.com/media/catalog/product/cache/9ad66c435c43f3952f09161e0d380fd9/a/x/ax88d-360_1.png',
                seller: user._id,
                features: ['4U', 'Professional', 'Extra Grips'],
                condition: 'Like New'
            },
            {
                title: 'Nike Mercurial Football Boots',
                description: 'Size UK 8, Professional grade, barely used',
                price: 6999,
                category: 'Sports',
                location: 'Mumbai',
                image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/7c2fff38-9f89-4e86-b7f7-f3c2750ee6db/mercurial-vapor-15-elite-fg-football-boot-x67x7k.png',
                seller: user._id,
                features: ['Professional', 'Lightweight', 'Studs'],
                condition: 'Like New'
            },

            // Motorcycles
            {
                title: 'Royal Enfield Classic 350',
                description: 'Stealth Black, 2022 model, 5000km driven, first owner, all documents clear',
                price: 175000,
                category: 'Motorcycles',
                location: 'Bangalore',
                image: 'https://media.zigcdn.com/media/model/2023/Feb/right-side-view-1836958788_600x400.jpg',
                seller: user._id,
                features: ['BS6', 'ABS', 'Single Channel'],
                condition: 'Like New'
            },
            {
                title: 'KTM Duke 390',
                description: '2023 model, Orange color, 3000km driven, under warranty, quickshifter',
                price: 320000,
                category: 'Motorcycles',
                location: 'Pune',
                image: 'https://media.zigcdn.com/media/model/2023/Sep/2024-ktm-390-duke-right-side-view_600x400.jpg',
                seller: user._id,
                features: ['Quickshifter', 'TFT Display', 'Traction Control'],
                condition: 'Excellent'
            },
            {
                title: 'Kawasaki Ninja ZX-6R',
                description: '2022 model, Green, 2000km driven, Akrapovic exhaust, mint condition',
                price: 950000,
                category: 'Motorcycles',
                location: 'Mumbai',
                image: 'https://media.zigcdn.com/media/model/2020/Feb/right-side-view-1454731830_600x400.jpg',
                seller: user._id,
                features: ['636cc', 'Quickshifter', 'Traction Control'],
                condition: 'Like New'
            },

            // Scooters
            {
                title: 'Honda Activa 6G',
                description: '2023 model, Pearl White, 1000km driven, first owner',
                price: 75000,
                category: 'Scooters',
                location: 'Chennai',
                image: 'https://media.zigcdn.com/media/model/2023/Jan/right-side-view-161700901_600x400.jpg',
                seller: user._id,
                features: ['BS6', 'LED Headlamp', 'Silent Start'],
                condition: 'Like New'
            },
            {
                title: 'TVS Jupiter 125',
                description: '2022 model, Blue, 3000km driven, all papers clear',
                price: 65000,
                category: 'Scooters',
                location: 'Hyderabad',
                image: 'https://media.zigcdn.com/media/model/2021/Oct/right-side-view-947991377_600x400.jpg',
                seller: user._id,
                features: ['125cc', 'USB Charging', 'LED Lights'],
                condition: 'Excellent'
            },
            {
                title: 'Suzuki Access 125',
                description: '2023 model, Metallic Silver, 500km driven, extended warranty',
                price: 85000,
                category: 'Scooters',
                location: 'Delhi',
                image: 'https://media.zigcdn.com/media/model/2023/May/right-side-view-1451969714_600x400.jpg',
                seller: user._id,
                features: ['Digital Console', 'Bluetooth', 'USB Charging'],
                condition: 'New'
            },

            // Houses & Apartments
            {
                title: '3 BHK Luxury Apartment',
                description: '1800 sq.ft, fully furnished, 24x7 security, swimming pool, gym, covered parking',
                price: 9500000,
                category: 'Houses & Apartments',
                location: 'Mumbai',
                image: 'https://is1-3.housingcdn.com/4f2250e8/1365e7b4dd6df21dde7dfd89ce50d9e4/v0/large/3_bhk_apartment-for-sale-kandivali_east-Mumbai-living_room.jpg',
                seller: user._id,
                features: ['3 BHK', 'Swimming Pool', 'Gym', '2 Parking'],
                condition: 'Ready to Move'
            },
            {
                title: '4 BHK Independent House',
                description: '3200 sq.ft, modern design, Italian marble flooring, modular kitchen, garden',
                price: 15000000,
                category: 'Houses & Apartments',
                location: 'Bangalore',
                image: 'https://is1-3.housingcdn.com/4f2250e8/ac4a53e19f9e6d185c59c7857fe22a37/v0/large/4_bhk_villa-for-sale-whitefield-Bangalore-others.jpg',
                seller: user._id,
                features: ['4 BHK', 'Garden', 'Modular Kitchen', '4 Parking'],
                condition: 'Ready to Move'
            },
            {
                title: '2 BHK Premium Apartment',
                description: '1200 sq.ft, semi-furnished, high-rise building, sea view, prime location',
                price: 7500000,
                category: 'Houses & Apartments',
                location: 'Chennai',
                image: 'https://is1-2.housingcdn.com/4f2250e8/be4f683a61c1e91c8a4c90f6dd4c4d7a/v0/large/2_bhk_apartment-for-sale-thoraipakkam-Chennai-living_room.jpg',
                seller: user._id,
                features: ['2 BHK', 'Sea View', 'Power Backup', '1 Parking'],
                condition: 'Ready to Move'
            },
            {
                title: '5 BHK Villa',
                description: '4500 sq.ft, ultra-luxury, private pool, home theater, smart home system',
                price: 25000000,
                category: 'Houses & Apartments',
                location: 'Pune',
                image: 'https://is1-3.housingcdn.com/4f2250e8/1c19e1a19a9b1c76cd8e7b9e10ccc9e1/v0/large/5_bhk_villa-for-sale-baner-Pune-living_room.jpg',
                seller: user._id,
                features: ['5 BHK', 'Private Pool', 'Smart Home', '6 Parking'],
                condition: 'Ready to Move'
            }

        ];

        // Insert sample ads
        await Ad.insertMany(sampleAds);

        console.log('Database seeded successfully!');
        console.log('Test user credentials:');
        console.log('Email: john@example.com');
        console.log('Password: password123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
