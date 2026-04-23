
import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env file
dotenv.config();

async function testSMTP() {
  console.log('--- Testing SMTP Configuration ---');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('Port:', process.env.SMTP_PORT);
  console.log('User:', process.env.SMTP_USER);
  
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('SUCCESS: SMTP connection verified!');
    
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME || 'Dalaal App'}" <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_USER, // Send to self
      subject: 'SMTP Test - Dalaal App',
      text: 'If you receive this, the SMTP configuration is working correctly.',
      html: '<b>If you receive this, the SMTP configuration is working correctly.</b>',
    });
    
    console.log('SUCCESS: Test email sent!', info.messageId);
  } catch (error) {
    console.error('FAILURE: SMTP test failed.');
    console.error(error);
  }
}

testSMTP();
