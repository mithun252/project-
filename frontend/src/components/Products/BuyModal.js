import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const BuyModal = ({ open, onClose, product }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    phone: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Validate inputs
      if (!contactInfo.name || !contactInfo.phone) {
        setError('Please fill in all required fields');
        return;
      }

      // Send buy request to backend
      const response = await axios.post(`${API_BASE_URL}/ads/${product._id}/inquire`, {
        ...contactInfo
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setContactInfo({ name: '', phone: '', message: '' });
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Buy {product.title}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <img
            src={product.image}
            alt={product.title}
            style={{
              width: '100%',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '8px'
            }}
          />
          
          <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </Typography>

          <Typography variant="body1" sx={{ mt: 1 }}>
            {product.description}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              {product.location}
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            {product.features?.map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                size="small"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Inquiry sent successfully! The seller will contact you soon.
          </Alert>
        )}

        <TextField
          fullWidth
          label="Your Name"
          name="name"
          value={contactInfo.name}
          onChange={handleInputChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={contactInfo.phone}
          onChange={handleInputChange}
          required
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Message (Optional)"
          name="message"
          value={contactInfo.message}
          onChange={handleInputChange}
          multiline
          rows={3}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          Send Inquiry
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BuyModal;
