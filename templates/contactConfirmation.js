// templates/contactConfirmation.js
module.exports.contactConfirmationTemplate = (data) => {
  const { name, email, phone, subject, message } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Contacting Rey Technologies</title>
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
        .divider {
          border: none;
          height: 2px;
          background: linear-gradient(to right, #0891B2, #7C3AED);
          margin: 30px 0;
          opacity: 0.3;
        }
        .info-box {
          background: #f8fafc;
          border-left: 4px solid #0891B2;
          padding: 15px 20px;
          border-radius: 4px;
          margin: 20px 0;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: linear-gradient(135deg, #0891B2 0%, #7C3AED 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin: 20px 0;
        }
        .button:hover {
          opacity: 0.9;
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
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>Thank You for Contacting Us</h1>
          <p>We're excited to connect with you!</p>
        </div>

        <!-- Content -->
        <div class="content">
          <h2>Hello ${name},</h2>
          
          <p>Thank you for reaching out to <strong>Rey Technologies</strong>. We have received your inquiry and our team is reviewing it.</p>

          <div class="info-box">
            <strong>📋 Your Inquiry Summary</strong>
            <br>
            <strong>Subject:</strong> ${subject || 'General Inquiry'}
            <br>
            <strong>Email:</strong> ${email}
            ${phone ? `<br><strong>Phone:</strong> ${phone}` : ''}
          </div>

          <p>We will get back to you within <strong>24 hours</strong> during business days.</p>

          <div style="text-align: center;">
            <a href="https://reytechnologies.com/services" class="button">Explore Our Services</a>
          </div>

          <hr class="divider">

          <p style="font-size: 14px; color: #64748b;">
            <strong>In the meantime, feel free to:</strong>
          </p>
          <ul style="color: #64748b;">
            <li>📖 Read our <a href="https://reytechnologies.com/case-studies" style="color: #0891B2;">Case Studies</a></li>
            <li>💼 Check out our <a href="https://reytechnologies.com/services" style="color: #0891B2;">Services</a></li>
            <li>📱 Follow us on <a href="https://linkedin.com/company/rey-technologies" style="color: #0891B2;">LinkedIn</a></li>
          </ul>

          <hr class="divider">

          <p style="font-size: 14px; color: #64748b;">
            <strong>Need immediate assistance?</strong>
            <br>
            Call us: <a href="tel:+254746160768" style="color: #0891B2;">+254 746 160 768</a>
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <div class="social-links">
            <a href="https://linkedin.com/company/rey-technologies">LinkedIn</a>
            <a href="https://twitter.com/reytechnologies">X</a>
            <a href="https://instagram.com/reytechnologies">Instagram</a>
          </div>
          <p>
            © 2026 Rey Technologies Limited. All rights reserved.
            <br>
            <a href="https://reytechnologies.com/privacy">Privacy Policy</a> | 
            <a href="https://reytechnologies.com/terms">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};