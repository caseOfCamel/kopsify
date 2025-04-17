// src/components/layout/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section">
            <h3 className="footer-heading">Kopsify</h3>
            <p className="footer-text">
              Personalized vinyl recommendations based on your Discogs collection,
              powered by AI and curated from Kops Records inventory.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Navigation</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/recommendations">Recommendations</Link></li>
              <li><a href="https://www.kopsrecords.ca" target="_blank" rel="noopener noreferrer">Kops Records</a></li>
              <li><a href="https://www.discogs.com" target="_blank" rel="noopener noreferrer">Discogs</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Locations</h3>
            <ul className="footer-links">
              <li>Queen West</li>
              <li>Danforth</li>
              <li>Bloor West</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="footer-heading">Connect</h3>
            <div className="social-links">
              <a href="#" className="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="social-link">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {currentYear} Kopsify. Vinyl recommendations service. 
            Not affiliated with Kops Records or Discogs.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;