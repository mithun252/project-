const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Mobile Phones',
      'Cars',
      'Motorcycles',
      'Scooters',
      'Houses & Apartments',
      'Electronics',
      'Furniture',
      'Fashion',
      'Books',
      'Sports'
    ]
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  features: [{
    type: String
  }],
  condition: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Ad', adSchema);
