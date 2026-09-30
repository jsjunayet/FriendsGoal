import type { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import config from '../config/index';
import AppError from '../errors/AppError';
import type { TUserRole } from '../modules/User/user.interface';
import { User } from '../modules/User/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.accessToken ||
      (authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader);

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string
    ) as JwtPayload;

    const { role, userId, iat } = decoded;

    // checking if user exists in User or Member
    let user = await User.isUserExistsByCustomId(userId);
    if (!user) {
      const member = await (await import("../modules/Member/member.model")).Member.findById(userId);
      if (member) {
        user = {
          _id: member._id,
          id: member.id || member._id.toString(),
          email: member.email,
          role: (member.role as any) || "member",
          status: member.status,
          isDeleted: member.isDeleted,
        } as any;
      }
    }

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found !");
    }

    const isDeleted = user?.isDeleted;
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "This user is deleted !");
    }

    // checking if the user is blocked
    const userStatus = user?.status;

    if (userStatus === 'blocked') {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
    }

    if (
      user.passwordChangedAt &&
      User.isJWTIssuedBeforePasswordChanged(
        user.passwordChangedAt,
        iat as number,
      )
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized !');
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You are not authorized  hi!',
      );
    }

    (req as any).user = { ...(decoded as any), _id: user._id, id: user.id || user._id, email: user.email };
    next();
  });
};

export default auth;
