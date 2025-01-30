import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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
  Button,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteFilledIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { API_BASE_URL } from '../../config/api';
import BuyModal from './BuyModal';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const { category } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          category
            ? `${API_BASE_URL}/ads/category/${category}`
            : `${API_BASE_URL}/ads`
        );
        
        const productsData = response.data.ads || response.data || [];
        setProducts(productsData);
        setError(null);

        // Load favorites from localStorage
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(savedFavorites);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        setProducts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleBuyClick = (e, product) => {
    e.stopPropagation();
    setSelectedProduct(product);
  };

  const toggleFavorite = (e, productId) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
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
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!products || products.length === 0) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="info">
          No products found {category ? `in ${category}` : ''}.
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {category && (
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            {category}
          </Typography>
        )}

        <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
          {products.length} {products.length === 1 ? 'item' : 'items'} available
        </Typography>

        <Grid container spacing={3}>
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
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
                onClick={() => navigate(`/ad/${product._id}`)}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.title}
                    sx={{ 
                      objectFit: 'cover',
                      backgroundColor: '#f5f5f5'
                    }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300';
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
                    onClick={(e) => toggleFavorite(e, product._id)}
                  >
                    {favorites.includes(product._id) ? (
                      <FavoriteFilledIcon color="error" />
                    ) : (
                      <FavoriteIcon />
                    )}
                  </IconButton>
                </Box>
                
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="h6" component="h2" sx={{ 
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    mb: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}>
                    {product.title}
                  </Typography>

                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    {formatPrice(product.price)}
                  </Typography>

                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: 'text.secondary',
                    fontSize: '0.875rem'
                  }}>
                    <LocationOnIcon sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">
                      {product.location}
                    </Typography>
                  </Box>

                  {product.condition && (
                    <Chip 
                      label={product.condition}
                      size="small"
                      sx={{ 
                        mt: 1,
                        backgroundColor: '#e8f4fd',
                        color: '#0077cc',
                        fontSize: '0.75rem'
                      }}
                    />
                  )}

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    sx={{ mt: 2 }}
                    onClick={(e) => handleBuyClick(e, product)}
                  >
                    Buy Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <BuyModal
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </>
  );
};

export default ProductList;
