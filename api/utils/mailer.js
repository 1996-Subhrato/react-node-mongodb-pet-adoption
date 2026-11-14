const nodemailer = require('nodemailer');
require('./env');

const EMAIL_USER = process.env.EMAIL_USER || 'BlueStacks9397@gmail.com';
const EMAIL_PASS = process.env.EMAIL_PASS || 'oycmncthprujlxmy';

let transporter = null;
try {
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    });
} catch (err) {
    console.warn('Mail transporter initialization warning:', err.message);
}

async function sendOtpEmail(toEmail, otp) {
    const mailOptions = {
        from: `"Adopet - Pet Adoption" <${EMAIL_USER}>`,
        to: toEmail,
        subject: 'Your OTP for Password Reset - Adopet',
        text: `Your OTP for password reset is: ${otp}. It will expire in 10 minutes.\n\nIf you did not request this, please ignore this email.`,
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2 style="color: #ff9900;">Adopet Password Reset</h2>
                <p>Hello,</p>
                <p>We received a request to reset your password. Use the following One-Time Password (OTP) to proceed:</p>
                <div style="font-size: 24px; font-weight: bold; letter-spacing: 4px; padding: 12px; background: #f4f4f4; width: fit-content; border-radius: 6px; margin: 16px 0;">
                    ${otp}
                </div>
                <p>This code will expire in <strong>10 minutes</strong>.</p>
                <p>If you did not make this request, you can safely ignore this email.</p>
            </div>
        `
    };

    try {
        if (transporter) {
            await transporter.sendMail(mailOptions);
            return { success: true };
        } else {
            console.log(`[DEV OTP NOTIFICATION] To: ${toEmail} | OTP: ${otp}`);
            return { success: true, simulated: true };
        }
    } catch (error) {
        console.warn(`[DEV OTP FALLBACK] Mail delivery failed (${error.message}). OTP for ${toEmail}: ${otp}`);
        // Return success with simulated flag so testing/dev flow doesn't block
        return { success: true, simulated: true, error: error.message };
    }
}

module.exports = {
    sendOtpEmail
};

