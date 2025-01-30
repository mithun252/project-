import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './Navbar.css';

const categories = [
  'Cars',
  'Motorcycles',
  'Mobile Phones',
  'Houses & Apartments',
  'Scooters',
  'Commercial Vehicles',
];

const Navbar = () => {
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleCategoryClick = (category) => {
    history.push(`/category/${encodeURIComponent(category)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    history.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          OLX Clone
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </a>
              <ul className="dropdown-menu">
                {categories.map((category) => (
                  <li key={category}>
                    <a
                      className="dropdown-item"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleCategoryClick(category);
                      }}
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
          <div className="d-flex align-items-center">
            {user ? (
              <>
                <span className="text-light me-3">Welcome, {user.name}</span>
                <Link to="/sell" className="btn btn-success me-2">
                  + SELL
                </Link>
                <button onClick={handleLogout} className="btn btn-outline-light">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light me-2">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-light">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
