const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        minlength: [5, 'Title must be at least 5 characters long'],
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [20, 'Description must be at least 20 characters long'],
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: {
            values: [
                'Cars',
                'Motorcycles',
                'Mobile Phones',
                'Electronics',
                'Furniture',
                'Fashion',
                'Books',
                'Sports',
                'Properties'
            ],
            message: '{VALUE} is not a valid category'
        }
    },
    image: {
        type: String,
        required: [true, 'Image URL is required'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: String,
        required: [true, 'Seller name is required'],
        trim: true
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit contact number']
    }
}, {
    timestamps: true
});

// Add text index for search
adSchema.index({ 
    title: 'text', 
    description: 'text', 
    category: 'text', 
    location: 'text' 
});

module.exports = mongoose.model('Ad', adSchema);
