import httpStatus from 'http-status';
import type { Request, Response } from 'express';
import config from '../../config/index';
import AppError from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { NotificationServices } from '../Notification/notification.service';
import jwt from 'jsonwebtoken';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  console.log(req.body);
  const result = await AuthServices.loginUser(req.body);
  const { refreshToken, accessToken, needsPasswordChange } = result;

  const isProduction = config.NODE_ENV === "production";

  res.cookie("refreshToken", refreshToken, {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.cookie("accessToken", accessToken, {
    secure: isProduction,
    httpOnly: true,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 15 * 60 * 1000, // 15 mins
  });

  // Superadmin First-Login Security Alert
  try {
    const decoded = jwt.decode(accessToken) as any;
    if (decoded && decoded.role === "superAdmin" && needsPasswordChange) {
      const ip = req.ip || req.connection.remoteAddress || "Unknown IP";
      const userAgent = req.headers["user-agent"] || "Unknown Device";
      const timestamp = new Date().toLocaleString();
      
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #E5E7EB; border-radius: 8px;">
          <h2 style="color: #EF4444;">Superadmin Security Audit Alert</h2>
          <p>A Superadmin has logged into the system for the very first time.</p>
          <div style="background-color: #FEE2E2; padding: 15px; border-radius: 6px; margin: 15px 0;">
            <p style="margin: 0;"><strong>Timestamp:</strong> ${timestamp}</p>
            <p style="margin: 5px 0 0 0;"><strong>IP Address:</strong> ${ip}</p>
            <p style="margin: 5px 0 0 0;"><strong>Browser/Device:</strong> ${userAgent}</p>
          </div>
          <p style="color: #B91C1C; font-size: 13px;"><strong>Warning:</strong> Ensure the default password is changed immediately. If this was not authorized, please take immediate action to secure the platform.</p>
        </div>
      `;

      // Assuming Superadmin notification should go to junayetshiblu0@gmail.com
      // but we need a user ID. For a systemic email, we can omit recipientId and send directly?
      // Wait, our service requires a recipientId for email, unless we modify it. Let's see.
      // I'll import sendEmail directly.
      const { sendEmail } = require('../../../shared/sendEmail');
      sendEmail(
        "junayetshiblu0@gmail.com",
        "CRITICAL: Superadmin First Login Alert",
        htmlBody,
        "A Superadmin has logged in for the first time."
      ).catch((err: any) => console.error("Failed to send superadmin alert", err));
    }
  } catch (err) {
    console.error("Superadmin alert error", err);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: {
      accessToken,
      needsPasswordChange,
    },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { ...passwordData } = req.body;

  const result = await AuthServices.changePassword((req as any).user, passwordData);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is updated succesfully!',
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved succesfully!',
    data: result,
  });
});

const forgetPassword = catchAsync(async (req: Request, res: Response) => {
  const userId = req.body.id;
  const result = await AuthServices.forgetPassword(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reset link is generated succesfully!',
    data: result,
  });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Something went wrong !');
  }

  const result = await AuthServices.resetPassword(req.body, token);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset succesfully!',
    data: result,
  });
});

export const AuthControllers = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
};
