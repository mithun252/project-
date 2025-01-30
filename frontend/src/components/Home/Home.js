import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Button,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

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

const Home = () => {
  const navigate = useNavigate();
  const [adsByCategory, setAdsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchAds();
    // Load favorites from localStorage
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(savedFavorites);
  }, []);

  const fetchAds = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/ads`);
      const allAds = response.data.ads || []; // Access the ads array from the response

      // Group ads by category
      const grouped = categories.reduce((acc, category) => {
        acc[category] = allAds.filter(ad => ad.category === category) || [];
        return acc;
      }, {});

      setAdsByCategory(grouped);
      setError(''); // Clear any previous errors
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Failed to load ads. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (adId) => {
    const newFavorites = favorites.includes(adId)
      ? favorites.filter(id => id !== adId)
      : [...favorites, adId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {categories.map((category) => {
          const categoryAds = adsByCategory[category] || [];
          if (categoryAds.length === 0) return null;

          return (
            <Box key={category} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5" component="h2">
                  {category}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate(`/category/${category}`)}
                >
                  View All
                </Button>
              </Box>
              
              <Grid container spacing={3}>
                {categoryAds.slice(0, 4).map((ad) => (
                  <Grid item xs={12} sm={6} md={3} key={ad._id}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        cursor: 'pointer',
                        '&:hover': {
                          boxShadow: 6,
                        },
                      }}
                      onClick={() => navigate(`/ad/${ad._id}`)}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          paddingTop: '75%', // 4:3 aspect ratio
                          mb: 1,
                        }}
                      >
                        <img
                          src={ad.image}
                          alt={ad.title}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <IconButton
                          sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            bgcolor: 'background.paper',
                            '&:hover': {
                              bgcolor: 'background.paper',
                            },
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(ad._id);
                          }}
                        >
                          {favorites.includes(ad._id) ? (
                            <FavoriteIcon color="error" />
                          ) : (
                            <FavoriteBorderIcon />
                          )}
                        </IconButton>
                      </Box>

                      <Typography variant="h6" noWrap>
                        {ad.title}
                      </Typography>
                      
                      <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                        {formatPrice(ad.price)}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {ad.location}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
              
              <Divider sx={{ mt: 4 }} />
            </Box>
          );
        })}
      </Box>
    </Container>
  );
};

export default Home;
