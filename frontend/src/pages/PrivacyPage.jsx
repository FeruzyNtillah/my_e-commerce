import React from 'react';
import './StaticPages.css';

const PrivacyPage = () => {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-content">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: February 17, 2026</p>

          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>
              Welcome to ShopHub. We respect your privacy and are committed to protecting your
              personal data. This privacy policy will inform you about how we look after your
              personal data when you visit our website and tell you about your privacy rights.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. Information We Collect</h2>
            <p>We may collect, use, store and transfer different kinds of personal data about you:</p>
            <ul>
              <li><strong>Identity Data:</strong> first name, last name, username</li>
              <li><strong>Contact Data:</strong> email address, telephone numbers, billing address, delivery address</li>
              <li><strong>Financial Data:</strong> payment card details (processed securely through our payment providers)</li>
              <li><strong>Transaction Data:</strong> details about payments and products you have purchased from us</li>
              <li><strong>Technical Data:</strong> IP address, browser type, device information, operating system</li>
              <li><strong>Usage Data:</strong> information about how you use our website and services</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. How We Use Your Information</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul>
              <li>To process and deliver your orders</li>
              <li>To manage your account and provide customer support</li>
              <li>To send you important updates about your orders and account</li>
              <li>To improve our website and services</li>
              <li>To detect and prevent fraud</li>
              <li>To send you marketing communications (with your consent)</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Data Security</h2>
            <p>
              We have implemented appropriate security measures to prevent your personal data from
              being accidentally lost, used, or accessed in an unauthorized way. We use SSL encryption
              for all data transmissions and store your data on secure servers.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Data Sharing</h2>
            <p>
              We may share your personal data with third parties including:
            </p>
            <ul>
              <li>Payment processors to handle transactions securely</li>
              <li>Delivery companies to fulfill your orders</li>
              <li>Analytics providers to help us improve our services</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p>We never sell your personal data to third parties.</p>
          </section>

          <section className="policy-section">
            <h2>6. Your Rights</h2>
            <p>Under data protection laws, you have rights including:</p>
            <ul>
              <li>The right to access your personal data</li>
              <li>The right to correct inaccurate data</li>
              <li>The right to request deletion of your data</li>
              <li>The right to object to processing of your data</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>7. Cookies</h2>
            <p>
              Our website uses cookies to distinguish you from other users and enhance your
              experience. Cookies are small text files stored on your device. You can control
              cookies through your browser settings.
            </p>
          </section>

          <section className="policy-section">
            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any
              significant changes by posting the new policy on this page and updating the
              "Last Updated" date.
            </p>
          </section>

          <section className="policy-section">
            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy or our privacy practices,
              please contact us at:
            </p>
            <p>
              Email: feruzykarim4@gmail.com<br />
              Phone: +(255) 693 641 585<br />
            Address: Kunduchi Mtongani, Dar es Salaam, Tanzania.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;