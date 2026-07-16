// templates/contactNotification.js
module.exports.contactNotificationTemplate = (data) => {
  const { name, email, phone, subject, message } = data;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
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
          padding: 30px 20px;
          text-align: center;
          border-radius: 12px 12px 0 0;
        }
        .header h1 {
          color: #ffffff;
          font-size: 24px;
          margin: 0;
          font-weight: 700;
        }
        .content {
          padding: 30px 25px;
        }
        .field {
          margin-bottom: 15px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 6px;
          border-left: 4px solid #0891B2;
        }
        .field-label {
          font-weight: 600;
          color: #0891B2;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .field-value {
          margin-top: 5px;
          color: #1e293b;
        }
        .badge {
          display: inline-block;
          padding: 4px 12px;
          background: #0891B2;
          color: white;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        .divider {
          border: none;
          height: 1px;
          background: #e2e8f0;
          margin: 20px 0;
        }
        .actions {
          margin: 20px 0;
          text-align: center;
        }
        .button {
          display: inline-block;
          padding: 10px 24px;
          background: #0891B2;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          color: #94a3b8;
          font-size: 12px;
          border-top: 1px solid #e2e8f0;
        }
        .timestamp {
          color: #94a3b8;
          font-size: 14px;
        }
        @media (max-width: 480px) {
          .content {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1>📬 New Contact Form Submission</h1>
        </div>

        <!-- Content -->
        <div class="content">
          <p style="font-size: 16px; color: #64748b;">
            <span class="timestamp">${new Date().toLocaleString()}</span>
          </p>

          <div class="field">
            <div class="field-label">👤 Name</div>
            <div class="field-value"><strong>${name}</strong></div>
          </div>

          <div class="field">
            <div class="field-label">📧 Email</div>
            <div class="field-value"><a href="mailto:${email}" style="color: #0891B2;">${email}</a></div>
          </div>

          ${phone ? `
          <div class="field">
            <div class="field-label">📞 Phone</div>
            <div class="field-value"><a href="tel:${phone}" style="color: #0891B2;">${phone}</a></div>
          </div>
          ` : ''}

          ${subject ? `
          <div class="field">
            <div class="field-label">📋 Subject</div>
            <div class="field-value"><span class="badge">${subject}</span></div>
          </div>
          ` : ''}

          <div class="field">
            <div class="field-label">💬 Message</div>
            <div class="field-value" style="background: white; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">
              ${message}
            </div>
          </div>

          <hr class="divider">

          <div class="actions">
            <a href="https://reytechnologies.com/admin/dashboard" class="button">View in Dashboard</a>
          </div>

          <p style="font-size: 14px; color: #64748b; text-align: center;">
            This is an automated notification from your Rey Technologies website.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p>
            Rey Technologies | Innovative Technology Solutions
            <br>
            © 2026 Rey Technologies Limited. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};