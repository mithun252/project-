import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createAd } from '../../services/api';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const categories = [
  'Cars',
  'Motorcycles',
  'Mobile Phones',
  'Houses & Apartments',
  'Scooters',
  'Commercial Vehicles',
];

const SellForm = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    location: '',
    seller: '',
    contact: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) { // 5MB limit
        setMessage({ text: 'Image size should be less than 5MB', type: 'danger' });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.onerror = () => {
        setMessage({ text: 'Error reading image file', type: 'danger' });
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const requiredFields = ['title', 'price', 'category', 'location', 'seller', 'contact'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setMessage({ 
        text: `Please fill in the following fields: ${missingFields.join(', ')}`, 
        type: 'danger' 
      });
      return false;
    }

    if (!formData.image) {
      setMessage({ text: 'Please upload an image', type: 'danger' });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: 'Submitting...', type: 'info' });

    try {
      console.log('Submitting form data:', { ...formData, image: formData.image.substring(0, 50) + '...' });
      
      const response = await createAd({
        ...formData,
        price: Number(formData.price)
      });

      console.log('Server response:', response);
      
      setMessage({ text: 'Ad posted successfully!', type: 'success' });
      setTimeout(() => {
        history.push('/products');
      }, 2000);
    } catch (error) {
      console.error('Error details:', error);
      setMessage({ 
        text: error.response?.data?.message || 'Error posting ad. Please try again.', 
        type: 'danger' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Post Your Ad</h2>
          {message.text && (
            <div className={`alert alert-${message.type}`} role="alert">
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title*</label>
              <input
                type="text"
                className="form-control"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Price*</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Category*</label>
                <select
                  className="form-select"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Location*</label>
                <input
                  type="text"
                  className="form-control"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Contact Number*</label>
                <input
                  type="tel"
                  className="form-control"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Image* (Max 5MB)</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
                required={!formData.image}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-2"
                  style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain' }}
                />
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">Your Name*</label>
              <input
                type="text"
                className="form-control"
                name="seller"
                value={formData.seller}
                onChange={handleChange}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Posting...' : 'Post Ad'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellForm;
