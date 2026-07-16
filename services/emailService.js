// services/emailService.js
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');

// Use require instead of import for CommonJS
const { contactConfirmationTemplate } = require('../templates/contactConfirmation');
const { contactNotificationTemplate } = require('../templates/contactNotification');
const { newsletterWelcomeTemplate } = require('../templates/newsletterWelcome');
const { welcomeEmailTemplate } = require('../templates/welcomeEmail');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || 'info@reytechnologies.com';

class EmailService {
  constructor() {
    // Check if we have real email credentials
    const hasRealCredentials = SENDGRID_API_KEY || 
      (process.env.SMTP_USER && process.env.SMTP_PASS);
    
    if (SENDGRID_API_KEY) {
      sgMail.setApiKey(SENDGRID_API_KEY);
      this.useSendGrid = true;
      this.useConsole = false;
      console.log('✅ SendGrid configured for production');
    } else if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      // Try SMTP
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      this.useSendGrid = false;
      this.useConsole = false;
      console.log('📧 SMTP configured for development');
    } else {
      // No email credentials - use console logging
      this.useSendGrid = false;
      this.useConsole = true;
      console.log('📝 Email service running in CONSOLE mode (no emails will be sent)');
    }
  }

  // Send contact confirmation to user
  async sendConfirmationEmail(email, name, data) {
    const html = contactConfirmationTemplate({ ...data, name });
    
    const emailContent = {
      to: email,
      from: {
        email: FROM_EMAIL,
        name: 'Rey Technologies Team'
      },
      subject: 'Thank You for Contacting Rey Technologies',
      html,
    };

    if (this.useConsole) {
      console.log('📧 [CONSOLE MODE] Confirmation email would be sent:');
      console.log('To:', emailContent.to);
      console.log('Subject:', emailContent.subject);
      console.log('HTML Preview:', emailContent.html.substring(0, 200) + '...');
      console.log('---');
      return { success: true, message: 'Email logged to console (development mode)' };
    }

    return this.sendEmail(emailContent);
  }

  // Send notification to admin
  async sendContactNotification(data) {
    const html = contactNotificationTemplate(data);
    
    const emailContent = {
      to: FROM_EMAIL,
      from: {
        email: FROM_EMAIL,
        name: 'Rey Technologies Website'
      },
      subject: `New Contact: ${data.subject || 'Inquiry'} from ${data.name}`,
      html,
    };

    if (this.useConsole) {
      console.log('📧 [CONSOLE MODE] Admin notification would be sent:');
      console.log('To:', emailContent.to);
      console.log('Subject:', emailContent.subject);
      console.log('HTML Preview:', emailContent.html.substring(0, 200) + '...');
      console.log('---');
      return { success: true, message: 'Email logged to console (development mode)' };
    }

    return this.sendEmail(emailContent);
  }

  // Send newsletter welcome email
  async sendNewsletterWelcome(email) {
    const html = newsletterWelcomeTemplate(email);
    
    const emailContent = {
      to: email,
      from: {
        email: FROM_EMAIL,
        name: 'Rey Technologies Team'
      },
      subject: 'Welcome to the Rey Technologies Newsletter! 🎉',
      html,
    };

    if (this.useConsole) {
      console.log('📧 [CONSOLE MODE] Newsletter welcome would be sent:');
      console.log('To:', emailContent.to);
      console.log('Subject:', emailContent.subject);
      console.log('HTML Preview:', emailContent.html.substring(0, 200) + '...');
      console.log('---');
      return { success: true, message: 'Email logged to console (development mode)' };
    }

    return this.sendEmail(emailContent);
  }

  // Send welcome email for user registration
  async sendWelcomeEmail(email, name, company = null) {
    const html = welcomeEmailTemplate({ name, email, company });
    
    const emailContent = {
      to: email,
      from: {
        email: FROM_EMAIL,
        name: 'Rey Technologies Team'
      },
      subject: 'Welcome to Rey Technologies! 🚀',
      html,
    };

    if (this.useConsole) {
      console.log('📧 [CONSOLE MODE] Welcome email would be sent:');
      console.log('To:', emailContent.to);
      console.log('Subject:', emailContent.subject);
      console.log('HTML Preview:', emailContent.html.substring(0, 200) + '...');
      console.log('---');
      return { success: true, message: 'Email logged to console (development mode)' };
    }

    return this.sendEmail(emailContent);
  }

  // Generic send function
  async sendEmail(options) {
    try {
      if (this.useSendGrid) {
        return await sgMail.send(options);
      } else {
        return await this.transporter.sendMail({
          from: `${options.from.name} <${options.from.email}>`,
          to: options.to,
          subject: options.subject,
          html: options.html,
        });
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      console.error('Email error details:', error.response?.body || error.message);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();