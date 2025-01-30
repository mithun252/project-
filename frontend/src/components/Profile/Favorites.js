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
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      // Get favorites from localStorage
      const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Fetch details for each favorite ad
      const response = await axios.get(`${API_BASE_URL}/ads/multiple`, {
        params: {
          ids: favoriteIds.join(','),
        },
      });

      setFavorites(response.data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = (adId) => {
    const favoriteIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    const updatedFavorites = favoriteIds.filter(id => id !== adId);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    setFavorites(favorites.filter(ad => ad._id !== adId));
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

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Favorite Ads
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {favorites.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You haven't added any ads to your favorites yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Click the heart icon on any ad to add it to your favorites
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {favorites.map((ad) => (
              <Grid item xs={12} sm={6} md={4} key={ad._id}>
                <Paper
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    },
                  }}
                  onClick={() => navigate(`/product/${ad._id}`)}
                >
                  <img
                    src={`${API_BASE_URL}${ad.image}`}
                    alt={ad.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'white',
                      '&:hover': {
                        bgcolor: 'white',
                      },
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFavorite(ad._id);
                    }}
                  >
                    <FavoriteIcon color="error" />
                  </IconButton>
                  <Box sx={{ p: 2, flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        fontWeight: 'bold',
                        color: '#002f34',
                        fontSize: '1.5rem',
                        mb: 1,
                      }}
                    >
                      {formatPrice(ad.price)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 1,
                      }}
                    >
                      {ad.title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 'auto',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOnIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {ad.location}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(ad.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
};

export default Favorites;
