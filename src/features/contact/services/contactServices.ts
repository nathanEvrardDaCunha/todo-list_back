import nodemailer from 'nodemailer';
import { MAILER_CONFIG } from '../../authentication/constants/authConstants.js';
import { validateEmail } from '../../authentication/validations/authValidation.js';
import {
    validateMessage,
    validateName,
} from '../validations/contactValidation.js';

export async function sendContactMessageService(
    name: any,
    email: any,
    message: any
): Promise<void> {
    const validatedName = validateName(name);
    const validatedEmail = validateEmail(email);
    const validatedMessage = validateMessage(message);

    const transporter = nodemailer.createTransport({
        host: MAILER_CONFIG.EMAIL_HOST,
        port: parseInt(MAILER_CONFIG.EMAIL_PORT || '587'),
        secure: false,
        auth: {
            user: MAILER_CONFIG.EMAIL_USER,
            pass: MAILER_CONFIG.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: validatedEmail,
        to: MAILER_CONFIG.EMAIL_FROM,
        subject: `Contact Form Message from ${validatedName}`,
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Contact Form Message</h2>
                <p><strong>From:</strong> ${validatedName} (${validatedEmail})</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="white-space: pre-wrap;">${validatedMessage}</p>
                </div>
            </div>
        `,
    };

    await transporter.verify();
    await transporter.sendMail(mailOptions);
}
