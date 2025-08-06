import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
});

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(emailData: EmailData) {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@ikigaivilla.com',
      to: emailData.to,
      subject: emailData.subject,
      html: emailData.html,
      text: emailData.text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Email templates
export function generateBookingConfirmationEmail(data: {
  customerName: string;
  roomName: string;
  checkIn: string;
  checkOut: string;
  totalAmount: string;
}) {
  return {
    subject: 'Xác nhận đặt phòng - Ikigaivilla',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #d11e0f; color: white; padding: 20px; text-align: center;">
          <h1>Ikigaivilla</h1>
          <p>Xác nhận đặt phòng</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Xin chào ${data.customerName},</h2>
          <p>Cảm ơn bạn đã đặt phòng tại Ikigaivilla. Dưới đây là thông tin chi tiết:</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Thông tin đặt phòng:</h3>
            <p><strong>Phòng:</strong> ${data.roomName}</p>
            <p><strong>Ngày check-in:</strong> ${data.checkIn}</p>
            <p><strong>Ngày check-out:</strong> ${data.checkOut}</p>
            <p><strong>Tổng tiền:</strong> ${data.totalAmount}</p>
          </div>
          
          <p>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận chi tiết.</p>
          
          <p>Trân trọng,<br>Đội ngũ Ikigaivilla</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© 2024 Ikigaivilla. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Xác nhận đặt phòng - Ikigaivilla
      
      Xin chào ${data.customerName},
      
      Cảm ơn bạn đã đặt phòng tại Ikigaivilla.
      
      Thông tin đặt phòng:
      - Phòng: ${data.roomName}
      - Ngày check-in: ${data.checkIn}
      - Ngày check-out: ${data.checkOut}
      - Tổng tiền: ${data.totalAmount}
      
      Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
      
      Trân trọng,
      Đội ngũ Ikigaivilla
    `
  };
}

export function generateContactFormEmail(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  return {
    subject: 'Liên hệ mới từ website - Ikigaivilla',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #d11e0f; color: white; padding: 20px; text-align: center;">
          <h1>Ikigaivilla</h1>
          <p>Liên hệ mới</p>
        </div>
        
        <div style="padding: 20px;">
          <h2>Thông tin liên hệ:</h2>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Tên:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Điện thoại:</strong> ${data.phone}</p>
            <p><strong>Nội dung:</strong></p>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <p>Vui lòng phản hồi trong thời gian sớm nhất.</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
          <p>© 2024 Ikigaivilla. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Liên hệ mới từ website - Ikigaivilla
      
      Thông tin liên hệ:
      - Tên: ${data.name}
      - Email: ${data.email}
      - Điện thoại: ${data.phone}
      - Nội dung: ${data.message}
      
      Vui lòng phản hồi trong thời gian sớm nhất.
    `
  };
} 