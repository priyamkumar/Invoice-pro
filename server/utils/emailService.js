import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendInvoiceEmail(clientEmail, invoiceData, pdfBuffer) {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: clientEmail,
        subject: `Invoice ${invoiceData.invoiceNumber} from ${invoiceData.companyInfo.name}`,
        html: this.generateInvoiceEmailTemplate(invoiceData),
        attachments: [
          {
            filename: `Invoice-${invoiceData.invoiceNumber}.pdf`,
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      };

      const result = await this.transporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send email');
    }
  }

  generateInvoiceEmailTemplate(invoiceData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${invoiceData.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .invoice-details { background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 14px; color: #6c757d; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Invoice from ${invoiceData.companyInfo.name}</h2>
            <p>Thank you for your business!</p>
          </div>
          
          <p>Dear Valued Customer,</p>
          
          <p>Please find attached your invoice for the services/products provided.</p>
          
          <div class="invoice-details">
            <strong>Invoice Details:</strong><br>
            Invoice Number: ${invoiceData.invoiceNumber}<br>
            Date: ${new Date(invoiceData.date).toLocaleDateString()}<br>
            Amount: ₹${invoiceData.grandTotal.toFixed(2)}
          </div>
          
          <p>If you have any questions about this invoice, please don't hesitate to contact us.</p>
          
          <div class="footer">
            <p>Best regards,<br>
            ${invoiceData.companyInfo.name}<br>
            ${invoiceData.companyInfo.email}<br>
            ${invoiceData.companyInfo.phone}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service verification failed:', error);
      return false;
    }
  }
}

export default new EmailService();