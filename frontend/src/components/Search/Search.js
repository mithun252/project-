import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  InputBase,
  IconButton,
  Paper,
  Divider,
  Select,
  MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Search = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('India');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}&location=${encodeURIComponent(location)}`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSearch} sx={{ width: '100%', maxWidth: 800 }}>
      <Paper
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          border: '2px solid #002f34',
          borderRadius: 1,
          boxShadow: 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 200, p: 1 }}>
          <LocationOnIcon sx={{ color: '#002f34', mr: 1 }} />
          <Select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            variant="standard"
            sx={{
              '&:before': { border: 'none' },
              '&:after': { border: 'none' },
              '& .MuiSelect-select': { py: 0 },
            }}
          >
            <MenuItem value="India">India</MenuItem>
            <MenuItem value="Delhi">Delhi</MenuItem>
            <MenuItem value="Mumbai">Mumbai</MenuItem>
            <MenuItem value="Bangalore">Bangalore</MenuItem>
            <MenuItem value="Hyderabad">Hyderabad</MenuItem>
            <MenuItem value="Chennai">Chennai</MenuItem>
          </Select>
        </Box>
        
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Find Cars, Mobile Phones and more..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <IconButton 
          type="submit" 
          sx={{ 
            p: '10px', 
            bgcolor: '#002f34',
            borderRadius: '0 4px 4px 0',
            '&:hover': { bgcolor: '#002f34' }
          }}
        >
          <SearchIcon sx={{ color: '#fff' }} />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default Search;
