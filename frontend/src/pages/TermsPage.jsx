import React from 'react';
import './StaticPages.css';

const TermsPage = () => {
  return (
    <div className="static-page">
      <div className="container">
        <div className="static-content">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: February 17, 2026</p>

          <section className="policy-section">
            <h2>1. Agreement to Terms</h2>
            <p>
              By accessing and using ShopHub, you accept and agree to be bound by the terms and
              provision of this agreement. If you do not agree to these terms, please do not use
              our services.
            </p>
          </section>

          <section className="policy-section">
            <h2>2. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current
              information. Failure to do so constitutes a breach of the Terms.
            </p>
            <ul>
              <li>You are responsible for safeguarding your account password</li>
              <li>You must notify us immediately of any unauthorized use of your account</li>
              <li>You may not use another person's account without permission</li>
              <li>You must be at least 18 years old to create an account</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>3. Product Information and Pricing</h2>
            <p>
              We strive to provide accurate product descriptions and pricing. However:
            </p>
            <ul>
              <li>We do not warrant that product descriptions or other content is accurate or error-free</li>
              <li>Prices are subject to change without notice</li>
              <li>We reserve the right to limit quantities and refuse service</li>
              <li>Images are for illustration purposes and may differ from actual products</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>4. Orders and Payment</h2>
            <p>
              By placing an order, you warrant that:
            </p>
            <ul>
              <li>You are legally capable of entering into binding contracts</li>
              <li>The payment information you provide is accurate and complete</li>
              <li>You will pay all charges incurred at the prices in effect when incurred</li>
            </ul>
            <p>
              We reserve the right to refuse or cancel any order for any reason, including
              product availability, errors in pricing, or suspected fraud.
            </p>
          </section>

          <section className="policy-section">
            <h2>5. Shipping and Delivery</h2>
            <ul>
              <li>Delivery times are estimates and not guaranteed</li>
              <li>Risk of loss passes to you upon delivery to the carrier</li>
              <li>You are responsible for providing accurate shipping information</li>
              <li>We are not responsible for delays caused by shipping carriers or customs</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>6. Returns and Refunds</h2>
            <p>
              Our Return Policy forms part of these Terms of Service. Please review our Return
              Policy for detailed information about returns, refunds, and exchanges.
            </p>
            <ul>
              <li>Returns must be initiated within 30 days of delivery</li>
              <li>Products must be unused and in original packaging</li>
              <li>Certain items may not be eligible for return</li>
              <li>Refunds will be processed to the original payment method</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>7. Prohibited Uses</h2>
            <p>You may not use our website:</p>
            <ul>
              <li>In any way that violates any applicable law or regulation</li>
              <li>To transmit any unlawful, threatening, or harassing material</li>
              <li>To impersonate or attempt to impersonate another person</li>
              <li>To engage in any automated use of the system (bots, scrapers)</li>
              <li>To interfere with or disrupt the website or servers</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>8. Intellectual Property</h2>
            <p>
              The website and its entire contents, features, and functionality are owned by
              ShopHub and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p>You may not:</p>
            <ul>
              <li>Reproduce, distribute, or create derivative works from our content</li>
              <li>Use our trademarks without written permission</li>
              <li>Remove any copyright or proprietary notices</li>
            </ul>
          </section>

          <section className="policy-section">
            <h2>9. Disclaimer of Warranties</h2>
            <p>
              Our website and services are provided "as is" without warranties of any kind, either
              express or implied. We do not warrant that the website will be uninterrupted,
              error-free, or free of viruses or other harmful components.
            </p>
          </section>

          <section className="policy-section">
            <h2>10. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, ShopHub shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising out of your use of
              the website or services.
            </p>
          </section>

          <section className="policy-section">
            <h2>11. Indemnification</h2>
            <p>
              You agree to indemnify and hold ShopHub harmless from any claims, damages, losses,
              liabilities, and expenses arising out of your use of the website or violation of
              these Terms.
            </p>
          </section>

          <section className="policy-section">
            <h2>12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the website constitutes acceptance
              of the modified terms.
            </p>
          </section>

          <section className="policy-section">
            <h2>13. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the
              State of New York, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="policy-section">
            <h2>14. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <p>
              Email: feruzykarim4@gmail.com<br />
              Phone: +(255) 693 641 585<br />
              Address: Kunduchi Mtongani, Dar es Salaam, Tanzania
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;