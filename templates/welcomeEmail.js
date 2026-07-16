// templates/welcomeEmail.js
module.exports.welcomeEmailTemplate = (data) => {
  const { name, email, company } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Rey Technologies</title>
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
        .header p {
          color: rgba(255, 255, 255, 0.9);
          margin: 10px 0 0 0;
          font-size: 16px;
        }
        .content {
          padding: 40px 30px;
          background: #ffffff;
        }
        .content h2 {
          color: #0891B2;
          font-size: 22px;
          margin-top: 0;
        }
        .welcome-box {
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
          border: 1px solid #86efac;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
          text-align: center;
        }
        .welcome-box .emoji {
          font-size: 48px;
          display: block;
          margin-bottom: 10px;
        }
        .features-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin: 20px 0;
        }
        .feature-card {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }
        .feature-card .icon {
          font-size: 28px;
          display: block;
          margin-bottom: 5px;
        }
        .feature-card .title {
          font-weight: 600;
          font-size: 14px;
          color: #1e293b;
        }
        .feature-card .desc {
          font-size: 12px;
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
          margin: 10px 0;
        }
        .button:hover {
          opacity: 0.9;
          transform: scale(1.02);
        }
        .button-group {
          text-align: center;
          margin: 20px 0;
        }
        .button-group .button {
          margin: 5px 10px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #94a3b8;
          font-size: 12px;
          border-top: 1px solid #e2e8f0;
        }
        .footer a {
          color: #0891B2;
          text-decoration: none;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #0891B2;
          text-decoration: none;
        }
        .highlight {
          color: #0891B2;
          font-weight: 600;
        }
        .company-name {
          color: #7C3AED;
          font-weight: 700;
        }
        @media (max-width: 480px) {
          .container {
            padding: 10px;
          }
          .content {
            padding: 20px;
          }
          .header h1 {
            font-size: 24px;
          }
          .features-grid {
            grid-template-columns: 1fr;
          }
          .button-group .button {
            display: block;
            margin: 10px 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>🚀 Welcome to Rey Technologies!</h1>
          <p>Your journey to innovation begins here</p>
        </div>

        <!-- Content -->
        <div class="content">
          <h2>Hello ${name || 'there'}! 👋</h2>
          
          <p>We're thrilled to have you join the <span class="company-name">Rey Technologies</span> community!</p>

          <div class="welcome-box">
            <span class="emoji">🎉</span>
            <p style="font-size: 18px; font-weight: 600; color: #0891B2; margin: 0;">
              Your account has been successfully created!
            </p>
            ${company ? `<p style="margin: 5px 0 0 0; color: #64748b;">Company: <strong>${company}</strong></p>` : ''}
            <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">
              Email: ${email}
            </p>
          </div>

          <p>Here's what you can do next:</p>

          <div class="features-grid">
            <div class="feature-card">
              <span class="icon">📊</span>
              <div class="title">Dashboard</div>
              <div class="desc">View your projects and analytics</div>
            </div>
            <div class="feature-card">
              <span class="icon">💼</span>
              <div class="title">Services</div>
              <div class="desc">Explore our technology solutions</div>
            </div>
            <div class="feature-card">
              <span class="icon">👥</span>
              <div class="title">Support</div>
              <div class="desc">24/7 expert assistance</div>
            </div>
            <div class="feature-card">
              <span class="icon">📈</span>
              <div class="title">Growth</div>
              <div class="desc">Scale your business with us</div>
            </div>
          </div>

          <div class="button-group">
            <a href="https://reytechnologies.com/dashboard" class="button">Go to Dashboard</a>
            <a href="https://reytechnologies.com/services" class="button" style="background: #64748b;">Explore Services</a>
          </div>

          <hr class="divider">

          <p style="font-size: 14px; color: #64748b;">
            <strong>Need help getting started?</strong>
            <br>
            Our team is here to assist you every step of the way.
          </p>

          <div style="text-align: center; margin: 20px 0;">
            <a href="mailto:support@reytechnologies.com" style="color: #0891B2; text-decoration: none; font-weight: 600;">
              📧 support@reytechnologies.com
            </a>
            <br>
            <a href="tel:+254746160768" style="color: #0891B2; text-decoration: none; font-weight: 600;">
              📞 +254 746 160 768
            </a>
          </div>

          <hr class="divider">

          <p style="font-size: 13px; color: #64748b; text-align: center;">
            <strong>What makes Rey Technologies different?</strong>
            <br>
            We combine <span class="highlight">innovation</span> with <span class="highlight">excellence</span> to deliver 
            technology solutions that transform businesses.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="social-links">
            <a href="https://linkedin.com/company/rey-technologies">LinkedIn</a>
            <a href="https://twitter.com/reytechnologies">X</a>
            <a href="https://instagram.com/reytechnologies">Instagram</a>
            <a href="https://youtube.com/reytechnologies">YouTube</a>
          </div>
          <p>
            © 2026 Rey Technologies Limited. All rights reserved.
            <br>
            <a href="https://reytechnologies.com/privacy">Privacy Policy</a> | 
            <a href="https://reytechnologies.com/terms">Terms of Service</a>
          </p>
          <p style="margin-top: 10px; font-size: 11px;">
            This email was sent to ${email}. 
            <a href="#" style="color: #94a3b8;">Unsubscribe</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};