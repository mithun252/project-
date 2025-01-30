const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Buy Request Schema
const buyRequestSchema = new mongoose.Schema({
  adId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ad',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  message: String,
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const BuyRequest = mongoose.model('BuyRequest', buyRequestSchema);

// Submit a buy request
router.post('/', async (req, res) => {
  try {
    const { adId, name, email, phone, address, message } = req.body;

    // Validate required fields
    if (!adId || !name || !email || !phone || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new buy request
    const buyRequest = new BuyRequest({
      adId,
      name,
      email,
      phone,
      address,
      message
    });

    // Save the buy request
    await buyRequest.save();

    res.status(201).json({
      message: 'Buy request submitted successfully',
      buyRequest
    });
  } catch (error) {
    console.error('Error submitting buy request:', error);
    res.status(500).json({ error: 'Failed to submit buy request' });
  }
});

// Get all buy requests for an ad (seller only)
router.get('/ad/:adId', async (req, res) => {
  try {
    const { adId } = req.params;
    const buyRequests = await BuyRequest.find({ adId }).sort('-createdAt');
    res.json(buyRequests);
  } catch (error) {
    console.error('Error fetching buy requests:', error);
    res.status(500).json({ error: 'Failed to fetch buy requests' });
  }
});

// Update buy request status (seller only)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const buyRequest = await BuyRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!buyRequest) {
      return res.status(404).json({ error: 'Buy request not found' });
    }

    res.json(buyRequest);
  } catch (error) {
    console.error('Error updating buy request:', error);
    res.status(500).json({ error: 'Failed to update buy request' });
  }
});

module.exports = router;
