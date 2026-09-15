const nodemailer = require('nodemailer');

// Configure your SMTP transporter for Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // SSL
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  try {
    console.log(`[Nodemailer] Attempting to send OTP email to ${email}...`);
    const info = await transporter.sendMail({
      from: '"HemoSync Support" <no-reply@hemosync.com>',
      to: email,
      subject: 'Your HemoSync Verification Code',
      text: `Your login verification code is ${otp}. It is valid for 5 minutes.`,
      html: `<b>Your login verification code is ${otp}. It is valid for 5 minutes.</b>`
    });
    console.log(`[Nodemailer] Successfully sent OTP email! MessageId: ${info.messageId}`);
    
    // In dev, you can log the ethereal URL:
    console.log(`[Nodemailer] Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (err) {
    console.error('[Nodemailer] ERROR: SMTP rejection or failure when sending email:');
    console.error(err);
  }
};

module.exports = { sendOTP };