// src/components/pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Button from '../ui/Button';

const Home = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!username.trim()) {
      setError('Please enter your Discogs username');
      return;
    }
    
    // Navigate to the recommendations page with the entered username
    navigate(`/recommendations/${username}`);
  };
  
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Discover Your Next Favorite Vinyl</h1>
            <p className="hero-subtitle">
              Get personalized vinyl recommendations based on your Discogs collection, 
              curated from the latest arrivals at Kops Records.
            </p>
            
            <form onSubmit={handleSubmit} className="username-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">Enter your Discogs username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="YourDiscogsUsername"
                  className={`form-input ${error ? 'input-error' : ''}`}
                />
                {error && <div className="error-message">{error}</div>}
              </div>
              
              <Button 
                type="submit"
                variant="primary"
                size="lg"
                style={{
                  backgroundColor: 'black',
                  color: 'white',
                  borderColor: 'black',  
                  fontSize: '1.25rem',      // ~20px
                  padding: '1rem 2rem'     // more “meaty” click area
                }}
              >
                Get Recommendations
              </Button>
            </form>
          </div>
          
          <div className="hero-image">
            <img src="/assets/images/hero-img.png" alt="KOPSIFY Hero img" />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3 className="step-title">Connect Discogs</h3>
              <p className="step-description">
                Enter your Discogs username to let us analyze your vinyl collection.
              </p>
            </div>
            
            <div className="step">
              <div className="step-number">2</div>
              <h3 className="step-title">AI Analysis</h3>
              <p className="step-description">
                Our AI analyzes your music taste and matches it with Kops Records inventory.
              </p>
            </div>
            
            <div className="step">
              <div className="step-number">3</div>
              <h3 className="step-title">Get Recommendations</h3>
              <p className="step-description">
                Receive personalized vinyl recommendations with insights about your collection.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Section */}
      <section className="featured-section">
        <div className="container">
          <h2 className="section-title">Why Kopsify?</h2>
          
          <div className="features-grid">
            <div className="feature">
              <div className="feature-icon">🎵</div>
              <h3 className="feature-title">Personalized Curation</h3>
              <p className="feature-description">
                Tailored recommendations based on your unique music taste and collection.
              </p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">🏪</div>
              <h3 className="feature-title">Local Inventory</h3>
              <p className="feature-description">
                All recommendations come from Kops Records' current inventory.
              </p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">💡</div>
              <h3 className="feature-title">Collection Insights</h3>
              <p className="feature-description">
                Get interesting insights and statistics about your vinyl collection.
              </p>
            </div>
            
            <div className="feature">
              <div className="feature-icon">⏱️</div>
              <h3 className="feature-title">Always Updated</h3>
              <p className="feature-description">
                Recommendations refresh with the latest arrivals at Kops Records.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to discover new vinyl?</h2>
            <p className="cta-description">
              Enter your Discogs username and get personalized recommendations in seconds.
            </p>
            
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => {
                // Scroll back to the hero section's input
                document.getElementById('username').focus();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Try It Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;