import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import './ProductList.css';

const ProductList = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { category } = useParams();
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        setError(null);
        const url = category
          ? `${API_BASE_URL}/ads/category/${encodeURIComponent(category)}`
          : `${API_BASE_URL}/ads`;
        
        const response = await axios.get(url);
        setAds(response.data);
      } catch (err) {
        console.error('Error fetching ads:', err);
        setError('Failed to load ads. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, [category]);

  const handleImageLoad = (adId) => {
    setLoadedImages(prev => ({
      ...prev,
      [adId]: true
    }));
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://via.placeholder.com/400x300?text=No+Image+Available';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );
  }

  if (ads.length === 0) {
    return (
      <div className="alert alert-info" role="alert">
        No ads found {category ? `in category "${category}"` : ''}.
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">
        {category ? `${category} Listings` : 'Featured Listings'}
      </h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {ads.map((ad) => (
          <div key={ad._id} className="col">
            <div className="card h-100 shadow-sm hover-shadow">
              <div className="position-relative image-container">
                {!loadedImages[ad._id] && (
                  <div className="image-placeholder">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                <img
                  src={ad.image}
                  className={`card-img-top ${loadedImages[ad._id] ? 'loaded' : ''}`}
                  alt={ad.title}
                  onLoad={() => handleImageLoad(ad._id)}
                  onError={handleImageError}
                  loading="lazy"
                />
                <span className="position-absolute top-0 end-0 badge bg-primary m-2">
                  {ad.category}
                </span>
              </div>
              <div className="card-body">
                <h5 className="card-title text-truncate">{ad.title}</h5>
                <h6 className="card-subtitle mb-2 text-primary fw-bold">
                  {formatPrice(ad.price)}
                </h6>
                <p className="card-text text-muted small mb-0">
                  <i className="bi bi-geo-alt-fill"></i> {ad.location}
                </p>
                <p className="card-text description-text">
                  {ad.description.length > 100
                    ? `${ad.description.substring(0, 100)}...`
                    : ad.description}
                </p>
              </div>
              <div className="card-footer bg-white border-top-0">
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Posted by: {ad.seller}</small>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => window.location.href = `tel:${ad.contact}`}
                  >
                    <i className="bi bi-telephone-fill"></i> Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
