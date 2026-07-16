// templates/newsletterWelcome.js
module.exports.newsletterWelcomeTemplate = (email) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to the Rey Technologies Newsletter</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #1e293b;
          margin: 0;
          padding: 0;
          background-color: #f8fafc;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        .header {
          background: linear-gradient(135deg, #0891B2 0%, #7C3AED 100%);
          padding: 40px 20px;
          text-align: center;
          border-radius: 12px 12px 0 0;
        }
        .header h1 {
          color: #ffffff;
          font-size: 28px;
          margin: 0;
          font-weight: 700;
        }
        .content {
          padding: 40px 30px;
        }
        .features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 20px 0;
        }
        .feature-item {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .feature-item .icon {
          font-size: 24px;
          display: block;
          margin-bottom: 5px;
        }
        .feature-item .label {
          font-size: 13px;
          color: #64748b;
        }
        .divider {
          border: none;
          height: 2px;
          background: linear-gradient(to right, #0891B2, #7C3AED);
          margin: 30px 0;
          opacity: 0.3;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #0891B2 0%, #7C3AED 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #94a3b8;
          font-size: 12px;
          border-top: 1px solid #e2e8f0;
        }
        .unsubscribe {
          color: #94a3b8;
          font-size: 12px;
        }
        @media (max-width: 480px) {
          .features {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🎉 Welcome to the Rey Technologies Newsletter!</h1>
        </div>

        <!-- Content -->
        <div class="content">
          <h2>Hello,</h2>
          <p>You've been successfully subscribed to our newsletter. We're excited to keep you updated!</p>

          <div class="features">
            <div class="feature-item">
              <span class="icon">🚀</span>
              <div class="label">Tech Insights</div>
            </div>
            <div class="feature-item">
              <span class="icon">📰</span>
              <div class="label">Company News</div>
            </div>
            <div class="feature-item">
              <span class="icon">🎯</span>
              <div class="label">Exclusive Offers</div>
            </div>
            <div class="feature-item">
              <span class="icon">💡</span>
              <div class="label">Best Practices</div>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="https://reytechnologies.com" class="button">Visit Our Website</a>
          </div>

          <hr class="divider">

          <p style="font-size: 14px; color: #64748b; text-align: center;">
            You're receiving this because you subscribed to the Rey Technologies newsletter.
          </p>

          <p class="unsubscribe">
            <a href="#" style="color: #94a3b8;">Unsubscribe</a> at any time.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>
            © 2026 Rey Technologies Limited. All rights reserved.
            <br>
            <a href="https://reytechnologies.com/privacy" style="color: #0891B2;">Privacy Policy</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};