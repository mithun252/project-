import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './style.css';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const history = useHistory();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      history.push(`/products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleSellClick = () => {
    history.push('/sell');
  };

  const handleLoginClick = () => {
    // TODO: Implement login functionality
    alert('Login functionality coming soon!');
  };

  return (
    <>
      <div className="d-flex flex-wrap p-3 main">
        <div className="ml-5">
          <a 
            className="text-black-50 text-decoration-none strong ancor" 
            href="/"
            onClick={(e) => {
              e.preventDefault();
              history.push('/');
            }}
          >
            Olx
          </a>
        </div>
        <form onSubmit={handleSearch} className="d-flex flex-grow-1 justify-content-center">
          <div className="ml-5 mr-5 search align-content-center text-center">
            <input
              type="search"
              className="w-150 text-center align-content-center input"
              placeholder="Find Cars, Mobile Phones and More"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="ml-1 mr-5 mt-1">
            <button type="submit" className="btn btn-link p-0">
              <i className="fa fa-search icon" aria-hidden="true"></i>
            </button>
          </div>
        </form>
        <div 
          className="btn ml-5 mr-5 btn:hover login"
          onClick={handleLoginClick}
        >
          Login
        </div>
        <div 
          className="btn sell border-gradient border-gradient-purple"
          onClick={handleSellClick}
        >
          + Sell
        </div>
      </div>
    </>
  );
};

export default Header;