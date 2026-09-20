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
    if (process.env.RESEND_API_KEY) {
      console.log(`[Resend] Attempting to send OTP email to ${email}...`);
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'HemoSync <onboarding@resend.dev>',
          to: 'prathibhaprabhu6@gmail.com',
          subject: 'Your HemoSync Verification Code',
          html: `<b>Login attempt for ${email}</b><br><br><b>Your login verification code is ${otp}. It is valid for 5 minutes.</b>`
        })
      });
      const data = await res.json();
      if (res.ok) {
        console.log(`[Resend] Successfully sent OTP email! ID: ${data.id}`);
      } else {
        console.error(`[Resend] ERROR: ${JSON.stringify(data)}`);
      }
      return;
    }

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