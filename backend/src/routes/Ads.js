const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const auth = require('../middleware/auth');

// Get all ads with search and filters
router.get('/', async (req, res) => {
    try {
        const { search, category, location, minPrice, maxPrice, sort } = req.query;
        console.log('Search query:', { search, category, location, minPrice, maxPrice, sort });

        // Build query
        let query = {};
        
        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by category
        if (category) {
            query.category = category;
        }

        // Filter by location
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        console.log('MongoDB query:', JSON.stringify(query, null, 2));

        // Execute query with error handling
        const ads = await Ad.find(query)
            .sort({ createdAt: -1 }) // Default sort by newest
            .populate('seller', 'name email phone')
            .lean()
            .exec();

        console.log(`Found ${ads.length} ads`);

        if (!ads || ads.length === 0) {
            return res.status(200).json({ 
                message: 'No ads found',
                ads: [] 
            });
        }

        res.json({
            message: 'Ads retrieved successfully',
            count: ads.length,
            ads: ads
        });
    } catch (error) {
        console.error('Error fetching ads:', error);
        res.status(500).json({ 
            error: 'Error fetching ads',
            message: error.message 
        });
    }
});

// Test route to check database connection and Ad model
router.get('/test', async (req, res) => {
    try {
        // Try to create a test ad
        const testAd = new Ad({
            title: 'Test Ad',
            description: 'This is a test ad',
            price: 1000,
            category: 'Electronics',
            location: 'Test Location',
            image: 'test-image.jpg',
            seller: '65b8c0e76c067d001234567' // Replace with a valid user ID from your database
        });

        // Save the test ad
        await testAd.save();
        console.log('Test ad created:', testAd);

        // Fetch all ads
        const allAds = await Ad.find().lean();
        console.log('Total ads in database:', allAds.length);

        res.json({
            message: 'Database test successful',
            testAd: testAd,
            totalAds: allAds.length,
            allAds: allAds
        });
    } catch (error) {
        console.error('Database test error:', error);
        res.status(500).json({
            error: 'Database test failed',
            message: error.message,
            stack: error.stack
        });
    }
});

// Get ad by ID
router.get('/:id', async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id)
            .populate('seller', 'name email phone');
            
        if (!ad) {
            return res.status(404).json({ error: 'Ad not found' });
        }
        res.json(ad);
    } catch (error) {
        console.error('Error fetching ad:', error);
        res.status(500).json({ error: 'Error fetching ad' });
    }
});

// Get ads by category
router.get('/category/:category', async (req, res) => {
    try {
        const ads = await Ad.find({ 
            category: req.params.category 
        })
        .sort('-createdAt')
        .populate('seller', 'name email phone');
        
        if (!ads || ads.length === 0) {
            return res.status(200).json({
                message: 'No ads found in this category',
                ads: []
            });
        }

        res.json({
            message: 'Category ads retrieved successfully',
            count: ads.length,
            ads: ads
        });
    } catch (error) {
        console.error('Error fetching ads by category:', error);
        res.status(500).json({ error: 'Error fetching ads' });
    }
});

// Get user's ads
router.get('/user/my-ads', auth, async (req, res) => {
    try {
        const ads = await Ad.find({ seller: req.user.userId })
            .sort('-createdAt')
            .populate('seller', 'name email phone');
            
        res.json({
            message: 'Your ads retrieved successfully',
            count: ads.length,
            ads: ads
        });
    } catch (error) {
        console.error('Error fetching user ads:', error);
        res.status(500).json({ error: 'Error fetching your ads' });
    }
});

// Create new ad
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, price, category, image, location } = req.body;

        console.log('Creating new ad:', { title, category, price });

        const ad = new Ad({
            title,
            description,
            price: Number(price),
            category,
            image,
            location,
            seller: req.user.userId
        });

        await ad.save();
        
        const populatedAd = await Ad.findById(ad._id)
            .populate('seller', 'name email phone');
            
        console.log('Ad created successfully:', populatedAd._id);

        res.status(201).json({
            message: 'Ad created successfully',
            ad: populatedAd
        });
    } catch (error) {
        console.error('Error creating ad:', error);
        res.status(500).json({ 
            error: 'Error creating ad',
            message: error.message 
        });
    }
});

// Update ad
router.put('/:id', auth, async (req, res) => {
    try {
        const ad = await Ad.findOne({ 
            _id: req.params.id, 
            seller: req.user.userId 
        });
        
        if (!ad) {
            return res.status(404).json({ error: 'Ad not found or unauthorized' });
        }

        const updates = req.body;
        Object.keys(updates).forEach(key => {
            if (key !== 'seller') { // Prevent updating the seller field
                ad[key] = updates[key];
            }
        });

        await ad.save();
        
        const updatedAd = await Ad.findById(ad._id)
            .populate('seller', 'name email phone');
            
        res.json({
            message: 'Ad updated successfully',
            ad: updatedAd
        });
    } catch (error) {
        console.error('Error updating ad:', error);
        res.status(500).json({ error: 'Error updating ad' });
    }
});

// Delete ad
router.delete('/:id', auth, async (req, res) => {
    try {
        const ad = await Ad.findOneAndDelete({ 
            _id: req.params.id, 
            seller: req.user.userId 
        });

        if (!ad) {
            return res.status(404).json({ error: 'Ad not found or unauthorized' });
        }

        res.json({ message: 'Ad deleted successfully' });
    } catch (error) {
        console.error('Error deleting ad:', error);
        res.status(500).json({ error: 'Error deleting ad' });
    }
});

// Send inquiry for an ad
router.post('/:id/inquire', async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id).populate('seller', 'email');
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        // Here you would typically:
        // 1. Send email to seller
        // 2. Store inquiry in database
        // 3. Send SMS notification
        // For now, we'll just return success

        res.json({
            message: 'Inquiry sent successfully',
            sellerEmail: ad.seller.email,
            adTitle: ad.title
        });
    } catch (error) {
        console.error('Error sending inquiry:', error);
        res.status(500).json({ error: 'Error sending inquiry' });
    }
});

module.exports = router;