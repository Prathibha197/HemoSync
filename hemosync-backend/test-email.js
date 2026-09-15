require('dotenv').config();
const { sendOTP } = require('./src/utils/email');

async function testEmail() {
  console.log('Testing Nodemailer with Gmail SMTP...');
  console.log('Using EMAIL_USER:', process.env.EMAIL_USER);
  
  try {
    await sendOTP(process.env.EMAIL_USER, '123456');
    console.log('Test completed.');
  } catch (err) {
    console.error('Test failed:', err);
  }
}

testEmail();
