import jwt from 'jsonwebtoken';
import {
    hashPassword,
    validateUsername,
    validateEmail,
    validatePassword,
    isPasswordMatch,
    generateRandomPassword,
} from '../validations/authValidation.js';
import { JWT_CONFIG } from '../../../constants/jwtConstants.js';
import {
    createUser,
    fetchUserByEmail,
    isEmailUnavailable,
    isUsernameUnavailable,
    setPasswordByUserId,
    setRefreshTokenById,
    setRefreshTokenToNull,
} from '../../../models/user/userModels.js';
import {
    ConflictError,
    NotFoundError,
    UnauthorizedError,
} from '../../../utils/errors/ClientError.js';
import { validateRefreshToken } from '../../../utils/validation/genericValidation.js';
import nodemailer from 'nodemailer';
import { MAILER_CONFIG } from '../constants/authConstants.js';

export async function registerService(
    username: any,
    email: any,
    password: any
): Promise<void> {
    const newUsername = validateUsername(username);
    const newEmail = validateEmail(email);
    const newPassword = validatePassword(password);

    const dbUsername = await isUsernameUnavailable(newUsername);
    if (dbUsername) {
        throw new ConflictError('Username is not available !');
    }

    const dbEmail = await isEmailUnavailable(newEmail);
    if (dbEmail) {
        throw new ConflictError('Email is not available !');
    }

    const hashedPassword = await hashPassword(newPassword);

    await createUser(newUsername, newEmail, hashedPassword);

    const user = await fetchUserByEmail(newEmail);
    if (!user) {
        throw new NotFoundError('User should exist in database !');
    }

    const refreshToken = jwt.sign({ id: user.id }, JWT_CONFIG.REFRESH_TOKEN, {
        expiresIn: '14d',
    });

    await setRefreshTokenById(refreshToken, user.id);
}

interface LoginResult {
    refreshToken: string;
    accessToken: string;
}

export async function loginService(
    email: any,
    password: any
): Promise<LoginResult> {
    const newEmail = validateEmail(email);
    const newPassword = validatePassword(password);

    const user = await fetchUserByEmail(newEmail);
    if (!user) {
        throw new UnauthorizedError('Invalid Credentials !');
    }

    const passwordMatch = await isPasswordMatch(newPassword, user.password);

    if (!passwordMatch) {
        throw new UnauthorizedError('Invalid Credentials !');
    }

    const accessToken = jwt.sign({ id: user.id }, JWT_CONFIG.ACCESS_TOKEN, {
        expiresIn: '5m',
    });

    const refreshToken = jwt.sign({ id: user.id }, JWT_CONFIG.REFRESH_TOKEN, {
        expiresIn: '14d',
    });

    await setRefreshTokenById(refreshToken, user.id);

    return {
        refreshToken: refreshToken,
        accessToken: accessToken,
    };
}

export async function logoutService(refreshToken: any): Promise<void> {
    const newRefreshToken = validateRefreshToken(refreshToken);

    await setRefreshTokenToNull(newRefreshToken);
}

export async function resetPasswordService(email: any): Promise<void> {
    const newEmail = validateEmail(email);

    const user = await fetchUserByEmail(newEmail);
    if (!user) {
        return;
    }

    const temporaryPassword = generateRandomPassword(16);

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
        from: MAILER_CONFIG.EMAIL_FROM,
        to: newEmail,
        subject: 'Password Reset - Temporary Password',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Password Reset Request</h2>
                <p>Hello,</p>
                <p>You have requested a password reset for your account. Your temporary password is:</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <strong style="font-size: 18px; color: #007bff;">${temporaryPassword}</strong>
                </div>
                <p><strong>Important:</strong> Please change this temporary password immediately after logging in for security reasons.</p>
                <p>If you did not request this password reset, please ignore this email and contact support.</p>
                <p>Best regards,<br>Your Support Team</p>
            </div>
        `,
    };

    await transporter.verify();
    console.log('SMTP connection verified');

    const hashedPassword = await hashPassword(temporaryPassword);

    await setPasswordByUserId(hashedPassword, user.id);

    await transporter.sendMail(mailOptions);
    console.log('Password reset email sent successfully to:', newEmail);
}
