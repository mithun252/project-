import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import ProductList from './components/Products/ProductList';
import SellForm from './components/Sell/SellForm';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import ProductDetails from './components/Products/ProductDetails';
import SearchResults from './components/Search/SearchResults';
import Profile from './components/Profile/Profile';
import MyAds from './components/Profile/MyAds';
import Favorites from './components/Profile/Favorites';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#002f34',
    },
    secondary: {
      main: '#ffce32',
    },
    background: {
      default: '#f2f4f5',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:category" element={<ProductList />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/sell" element={<SellForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-ads" element={<MyAds />} />
            <Route path="/favorites" element={<Favorites />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
