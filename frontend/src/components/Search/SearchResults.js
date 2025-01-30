import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { API_BASE_URL } from '../../config/api';
import axios from 'axios';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    const locationParam = searchParams.get('location');

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/ads/search`, {
          params: {
            q: query,
            location: locationParam,
          },
        });
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [location.search]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('q');
  const locationParam = searchParams.get('location');

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
        sx={{ mb: 3 }}
      >
        <Link color="inherit" onClick={() => navigate('/')} sx={{ cursor: 'pointer' }}>
          Home
        </Link>
        <Typography color="text.primary">
          Search results for "{query}" in {locationParam}
        </Typography>
      </Breadcrumbs>

      <Typography variant="h5" gutterBottom>
        {products.length} results found
      </Typography>

      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <Card
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
              onClick={() => navigate(`/product/${product._id}`)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image || 'https://via.placeholder.com/300'}
                  alt={product.title}
                  sx={{ objectFit: 'cover' }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'white',
                    '&:hover': {
                      backgroundColor: 'white',
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Add to favorites logic here
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
                {product.featured && (
                  <Chip
                    label="FEATURED"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      backgroundColor: '#ffce32',
                      color: '#002f34',
                      fontWeight: 'bold',
                    }}
                  />
                )}
              </Box>
              <CardContent sx={{ flexGrow: 1, p: 2 }}>
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
                  ₹ {product.price.toLocaleString('en-IN')}
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
                  {product.title}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 'auto',
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    {product.location}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {products.length === 0 && (
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" color="text.secondary">
            No results found for "{query}" in {locationParam}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default SearchResults;
