import React from 'react';
import './StaticPages.css';

const AboutPage = () => {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-content">
          <h1>About ShopHub</h1>
          
          <section className="about-section">
            <h2>Our Story</h2>
            <p>
              Founded in 2024, ShopHub started with a simple mission: to make online shopping
              easier, more accessible, and more enjoyable for everyone. What began as a small
              project has grown into a comprehensive e-commerce platform serving thousands of
              customers worldwide.
            </p>
          </section>

          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              We believe in providing high-quality products at competitive prices while delivering
              exceptional customer service. Our platform connects buyers with trusted sellers,
              ensuring a seamless shopping experience from browsing to delivery.
            </p>
          </section>

          <section className="about-section">
            <h2>Why Choose ShopHub?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>🛡️ Secure Shopping</h3>
                <p>Your data is protected with industry-standard encryption and security measures.</p>
              </div>
              <div className="feature-card">
                <h3>📦 Fast Delivery</h3>
                <p>We partner with reliable logistics providers to ensure timely delivery of your orders.</p>
              </div>
              <div className="feature-card">
                <h3>💳 Easy Returns</h3>
                <p>Not satisfied? Our hassle-free return policy makes it easy to return products.</p>
              </div>
              <div className="feature-card">
                <h3>🎧 24/7 Support</h3>
                <p>Our customer support team is always ready to help you with any questions.</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Our Values</h2>
            <ul className="values-list">
              <li><strong>Customer First:</strong> Your satisfaction is our top priority.</li>
              <li><strong>Quality Assurance:</strong> We carefully vet all products and sellers on our platform.</li>
              <li><strong>Transparency:</strong> Clear pricing, honest reviews, and open communication.</li>
              <li><strong>Innovation:</strong> Constantly improving our platform with the latest technology.</li>
              <li><strong>Sustainability:</strong> Committed to eco-friendly practices and responsible sourcing.</li>
            </ul>
          </section>

          <section className="about-section">
            <h2>Join Our Community</h2>
            <p>
              With over 10,000+ products across multiple categories and a growing community of
              satisfied customers, ShopHub is your one-stop destination for all your shopping needs.
              Join us today and experience the difference!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;