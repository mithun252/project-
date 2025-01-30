const express = require('express');
const router = express.Router();
const Ad = require('../models/Ads');

// Get all ads
router.get('/ads', async (req, res) => {
    try {
        console.log('Fetching all ads');
        const ads = await Ad.find();
        console.log(`Found ${ads.length} ads`);
        res.json(ads);
    } catch (err) {
        console.error('Error fetching ads:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get ads by category
router.get('/ads/category/:category', async (req, res) => {
    try {
        const category = decodeURIComponent(req.params.category);
        console.log('Fetching ads for category:', category);
        
        const ads = await Ad.find({ 
            category: { 
                $regex: new RegExp('^' + category + '$', 'i') 
            } 
        });
        
        console.log(`Found ${ads.length} ads in category: ${category}`);
        res.json(ads);
    } catch (err) {
        console.error('Error fetching ads by category:', err);
        res.status(500).json({ message: err.message });
    }
});

// Get ad by id
router.get('/ads/:id', async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (ad) {
            res.json(ad);
        } else {
            res.status(404).json({ message: 'Ad not found' });
        }
    } catch (err) {
        console.error('Error fetching ad by id:', err);
        res.status(500).json({ message: err.message });
    }
});

// Create new ad
router.post('/ads', async (req, res) => {
    try {
        console.log('Creating new ad:', req.body);
        const ad = new Ad(req.body);
        const newAd = await ad.save();
        console.log('Ad created successfully:', newAd);
        res.status(201).json(newAd);
    } catch (err) {
        console.error('Error creating ad:', err);
        res.status(400).json({ message: err.message });
    }
});

// Update ad
router.patch('/ads/:id', async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }

        // Update only provided fields
        Object.keys(req.body).forEach(key => {
            if (req.body[key] !== undefined) {
                ad[key] = req.body[key];
            }
        });

        const updatedAd = await ad.save();
        res.json(updatedAd);
    } catch (err) {
        console.error('Error updating ad:', err);
        res.status(400).json({ message: err.message });
    }
});

// Delete ad
router.delete('/ads/:id', async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.id);
        if (!ad) {
            return res.status(404).json({ message: 'Ad not found' });
        }
        await ad.remove();
        res.json({ message: 'Ad deleted successfully' });
    } catch (err) {
        console.error('Error deleting ad:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;