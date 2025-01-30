import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const MyAds = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  useEffect(() => {
    fetchMyAds();
  }, []);

  const fetchMyAds = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/ads/my-ads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAds(response.data);
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Failed to load your ads. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (adId) => {
    navigate(`/edit-ad/${adId}`);
  };

  const handleDelete = async () => {
    if (!selectedAd) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/ads/${selectedAd}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAds(ads.filter(ad => ad._id !== selectedAd));
      setDeleteDialogOpen(false);
      setSelectedAd(null);
    } catch (err) {
      console.error('Error deleting ad:', err);
      setError('Failed to delete ad. Please try again.');
    }
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            My Ads
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate('/sell')}
          >
            Post New Ad
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {ads.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              You haven't posted any ads yet
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/sell')}
              sx={{ mt: 2 }}
            >
              Post Your First Ad
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {ads.map((ad) => (
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
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      display: 'flex',
                      gap: 1,
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                      borderRadius: 1,
                      p: 0.5,
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(ad._id);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAd(ad._id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedAd(null);
        }}
      >
        <DialogTitle>Delete Advertisement</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this advertisement? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setDeleteDialogOpen(false);
              setSelectedAd(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyAds;
