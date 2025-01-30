import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Divider,
  Container,
  Avatar,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddIcon from '@mui/icons-material/Add';
import Search from '../Search/Search';

const categories = [
  'Cars',
  'Motorcycles',
  'Mobile Phones',
  'For Sale: Houses & Apartments',
  'Scooters',
  'Commercial & Other Vehicles',
  'For Rent: Houses & Apartments',
  'Electronics & Appliances',
  'Furniture',
  'Fashion',
];

const Navbar = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchorEl, setCategoryAnchorEl] = useState(null);
  const isLoggedIn = !!localStorage.getItem('token');
  const userEmail = localStorage.getItem('userEmail');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCategoryMenu = (event) => {
    setCategoryAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClose = () => {
    setCategoryAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    handleClose();
    navigate('/');
    window.location.reload();
  };

  const handleCategorySelect = (category) => {
    handleCategoryClose();
    navigate(`/category/${encodeURIComponent(category)}`);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default" sx={{ bgcolor: 'white', boxShadow: 1 }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Box 
              component={Link} 
              to="/"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <img
                src="/olx-logo.svg"
                alt="OLX Logo"
                style={{ height: 32, marginRight: 16 }}
              />
            </Box>

            {/* Search Component */}
            <Box sx={{ flexGrow: 1, mx: 2 }}>
              <Search />
            </Box>

            {/* Right Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Language Selector */}
              <Button
                color="inherit"
                sx={{ 
                  textTransform: 'none',
                  display: { xs: 'none', md: 'flex' }
                }}
              >
                ENGLISH
              </Button>

              {/* Favorites */}
              <IconButton
                color="inherit"
                onClick={() => navigate('/favorites')}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                <FavoriteBorderIcon />
              </IconButton>

              {/* User Menu */}
              {isLoggedIn ? (
                <>
                  <IconButton
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ p: 0 }}
                  >
                    <Avatar sx={{ bgcolor: '#002f34' }}>
                      {userEmail?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem onClick={() => {
                      handleClose();
                      navigate('/profile');
                    }}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={() => {
                      handleClose();
                      navigate('/my-ads');
                    }}>
                      My Ads
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{ textTransform: 'none' }}
                >
                  Login
                </Button>
              )}

              {/* Sell Button */}
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={() => navigate('/sell')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 3,
                  '&:hover': {
                    bgcolor: '#ffce32',
                  },
                }}
              >
                Sell
              </Button>
            </Box>
          </Toolbar>

          {/* Categories Bar */}
          <Box
            sx={{
              bgcolor: 'white',
              borderTop: 1,
              borderColor: 'divider',
              py: 1,
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Button
              color="inherit"
              onClick={handleCategoryMenu}
              sx={{ textTransform: 'none' }}
            >
              ALL CATEGORIES
            </Button>
            <Menu
              anchorEl={categoryAnchorEl}
              open={Boolean(categoryAnchorEl)}
              onClose={handleCategoryClose}
            >
              {categories.map((category) => (
                <MenuItem
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                >
                  {category}
                </MenuItem>
              ))}
            </Menu>
            <Box
              component="nav"
              sx={{
                display: 'inline-flex',
                ml: 2,
                gap: 2,
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                '&::-webkit-scrollbar': { display: 'none' },
                scrollbarWidth: 'none',
              }}
            >
              {categories.slice(0, 6).map((category) => (
                <Button
                  key={category}
                  color="inherit"
                  onClick={() => handleCategorySelect(category)}
                  sx={{
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                  }}
                >
                  {category}
                </Button>
              ))}
            </Box>
          </Box>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Navbar;
