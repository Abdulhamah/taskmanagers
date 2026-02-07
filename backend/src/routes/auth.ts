import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../db/init.js';
import nodemailer from 'nodemailer';

const router = Router();

// Simple password hash (in production, use bcrypt)
const hashPassword = (password: string) => Buffer.from(password).toString('base64');
const verifyPassword = (password: string, hash: string) => hashPassword(password) === hash;

// Email transporter
let transporter: any = null;

// Initialize email transporter
const getEmailTransporter = async () => {
  if (!transporter) {
    // Check if Gmail credentials are provided
    const gmailEmail = process.env.GMAIL_EMAIL || process.env.GMAIL_USER;
    const gmailPassword = process.env.GMAIL_PASSWORD || process.env.GMAIL_APP_PASSWORD;
    
    if (gmailEmail && gmailPassword && gmailEmail.trim() && gmailPassword.trim()) {
      // Use Gmail SMTP
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: gmailEmail,
          pass: gmailPassword
        }
      });
      console.log('✓ Email transporter configured with Gmail');
    } else {
      // Fall back to ethereal email for development
      console.log('⚠ Gmail credentials not found. Using Ethereal Email for development.');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('✓ Ethereal test account created for email testing');
    }
  }
  return transporter;
};

// Helper function to generate 6-digit code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, company, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const db = await getDatabase();
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', email);

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const userId = uuidv4();
    const now = new Date().toISOString();
    const passwordHash = hashPassword(password);

    // Create user with emailVerified = 0 (not verified yet)
    await db.run(
      `INSERT INTO users (id, name, email, password, company, role, emailVerified, createdAt, updatedAt) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, name, email, passwordHash, company || null, role || null, 0, now, now]
    );

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const codeId = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes expiry

    // Save verification code
    await db.run(
      `INSERT INTO emailVerificationTokens (id, userId, token, expiresAt, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [codeId, userId, verificationCode, expiresAt, now]
    );

    // Send verification email (non-blocking - continue even if it fails)
    let previewUrl = '';
    try {
      const transporter = await getEmailTransporter();
      const info = await transporter.sendMail({
        from: process.env.GMAIL_EMAIL || '"TaskMasters" <noreply@taskmanagers.org>',
        to: email,
        subject: 'Verify Your Email - TaskMasters',
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #4f46e5; margin-bottom: 20px;">Verify Your Email</h2>
              <p style="color: #333; font-size: 16px;">Hi ${name},</p>
              <p style="color: #666; line-height: 1.6;">Welcome to TaskMasters! To complete your registration, please verify your email address using the code below:</p>
              <div style="text-align: center; margin: 30px 0; background-color: #f0f4ff; padding: 20px; border-radius: 8px;">
                <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">Your Verification Code:</p>
                <p style="color: #4f46e5; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${verificationCode}</p>
              </div>
              <p style="color: #666; font-size: 14px; margin: 20px 0;">Enter this code on the registration page to verify your email and activate your account.</p>
              <p style="color: #999; font-size: 12px; margin-top: 20px;">⏰ This code expires in 30 minutes.</p>
              <p style="color: #999; font-size: 12px;">If you didn't create this account, you can ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #999; font-size: 12px; text-align: center;">© 2026 TaskMasters | taskmanagers.org | Powered by AI Task Management</p>
            </div>
          </div>
        `,
        text: `Welcome to TaskMasters!\n\nYour email verification code is: ${verificationCode}\n\nEnter this code to verify your email and activate your account.\n\nThis code expires in 30 minutes.\n\nIf you didn't create this account, ignore this email.\n\n---\nTaskMasters | taskmanagers.org`
      });

      console.log('✓ Verification code sent to:', email);
      previewUrl = nodemailer.getTestMessageUrl(info) || '';
      if (previewUrl) console.log('📧 Preview URL:', previewUrl);
    } catch (emailError) {
      console.log('⚠ Email send failed (non-blocking):', emailError instanceof Error ? emailError.message : 'Unknown error');
      console.log('  Code:', verificationCode);
    }
    
    res.status(201).json({
      message: 'Registration successful. Please verify your email.',
      userId,
      name,
      email,
      company,
      role,
      verificationCode, // Include for development/testing
      ...(previewUrl && { previewUrl })
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Verify email code
router.post('/verify-email', async (req, res) => {
  try {
    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ error: 'User ID and code are required' });
    }

    const db = await getDatabase();

    // Find and validate verification code
    const verificationRecord = await db.get(
      `SELECT * FROM emailVerificationTokens WHERE userId = ? AND token = ? AND expiresAt > datetime('now')`,
      [userId, code]
    );

    if (!verificationRecord) {
      return res.status(401).json({ error: 'Invalid or expired verification code' });
    }

    // Mark email as verified
    const now = new Date().toISOString();
    await db.run(
      `UPDATE users SET emailVerified = 1, updatedAt = ? WHERE id = ?`,
      [now, userId]
    );

    // Delete used code
    await db.run(`DELETE FROM emailVerificationTokens WHERE id = ?`, verificationRecord.id);

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = await getDatabase();
    const user = await db.get('SELECT * FROM users WHERE email = ?', email);

    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({ error: 'Please verify your email first' });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const db = await getDatabase();
    const user = await db.get('SELECT id, name, email, company, role, createdAt FROM users WHERE id = ?', req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Helper function to generate 6-digit code
const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const db = await getDatabase();
    const user = await db.get('SELECT id, name FROM users WHERE email = ?', email);

    if (!user) {
      // Don't reveal if email exists or not (security)
      return res.status(200).json({ message: 'If email exists, reset code will be sent' });
    }

    // Generate reset code (6 digits)
    const resetCode = generateResetCode();
    const codeId = uuidv4();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes expiry
    const now = new Date().toISOString();

    // Save reset code to database
    await db.run(
      `INSERT INTO passwordResetTokens (id, userId, token, expiresAt, createdAt) VALUES (?, ?, ?, ?, ?)`,
      [codeId, user.id, resetCode, expiresAt, now]
    );

    // Send email with code
    const transporter = await getEmailTransporter();
    const info = await transporter.sendMail({
      from: process.env.GMAIL_EMAIL || '"TaskMasters" <noreply@taskmanagers.org>',
      to: email,
      subject: 'Password Reset Code - TaskMasters',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #4f46e5; margin-bottom: 20px;">Password Reset Code</h2>
            <p style="color: #333; font-size: 16px;">Hi ${user.name},</p>
            <p style="color: #666; line-height: 1.6;">You requested to reset your password. Use the code below to reset your password on the website:</p>
            <div style="text-align: center; margin: 30px 0; background-color: #f0f4ff; padding: 20px; border-radius: 8px;">
              <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">Your Reset Code:</p>
              <p style="color: #4f46e5; font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${resetCode}</p>
            </div>
            <p style="color: #666; font-size: 14px; margin: 20px 0;">Enter this code on the password reset page to create a new password.</p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">⏰ This code expires in 15 minutes.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            <p style="color: #999; font-size: 12px; text-align: center;">© 2026 TaskMasters | taskmanagers.org | Powered by AI Task Management</p>
          </div>
        </div>
      `,
      text: `Your password reset code is: ${resetCode}\n\nEnter this code on the website to reset your password.\n\nThis code expires in 15 minutes.\n\nIf you didn't request this, ignore this email.`
    });

    console.log('✓ Password reset code sent to:', email);
    
    // Return preview URL if using ethereal (development)
    const previewUrl = process.env.GMAIL_EMAIL ? undefined : nodemailer.getTestMessageUrl(info);
    res.status(200).json({ 
      message: 'Reset code sent successfully',
      ...(previewUrl && { previewUrl })
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// Verify reset code
router.post('/verify-reset-code', async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    const db = await getDatabase();
    
    // Find user by email
    const user = await db.get('SELECT id FROM users WHERE email = ?', email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or code' });
    }

    // Find and validate reset code
    const resetRecord = await db.get(
      `SELECT * FROM passwordResetTokens WHERE userId = ? AND token = ? AND expiresAt > datetime('now')`,
      [user.id, code]
    );

    if (!resetRecord) {
      return res.status(401).json({ error: 'Invalid or expired code' });
    }

    res.status(200).json({ message: 'Code verified successfully', userId: user.id });
  } catch (error) {
    console.error('Verify code error:', error);
    res.status(500).json({ error: 'Failed to verify code' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({ error: 'Email, code, and new password are required' });
    }

    const db = await getDatabase();

    // Find user by email
    const user = await db.get('SELECT id FROM users WHERE email = ?', email);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Find and validate reset code
    const resetRecord = await db.get(
      `SELECT * FROM passwordResetTokens WHERE userId = ? AND token = ? AND expiresAt > datetime('now')`,
      [user.id, code]
    );

    if (!resetRecord) {
      return res.status(401).json({ error: 'Invalid or expired code' });
    }

    // Update user password
    const now = new Date().toISOString();
    const passwordHash = hashPassword(newPassword);

    await db.run(
      `UPDATE users SET password = ?, updatedAt = ? WHERE id = ?`,
      [passwordHash, now, user.id]
    );

    // Delete used code
    await db.run(`DELETE FROM passwordResetTokens WHERE id = ?`, resetRecord.id);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;
