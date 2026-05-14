/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */

import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import config from '../../config';
import AppError from '../../error/appError';
import { registrationSuccessEmailBody } from '../../mailTemplate/registerSucessEmail';
import sendEmail from '../../utilities/sendEmail';
import { upsertDevice } from '../device/device.service';
import { INormalUser } from '../normalUser/normalUser.interface';
import { NormalUser } from '../normalUser/normalUser.model';
import SuperAdmin from '../superAdmin/superAdmin.model';
import { USER_ROLE } from './user.constant';
import { TUserRole } from './user.interface';
import { User } from './user.model';
import { createToken } from './user.utils';
const generateVerifyCode = (): number => {
  return Math.floor(100000 + Math.random() * 900000);
};

const registerUser = async (
    payload: INormalUser & {
        password: string;
        confirmPassword: string;
        playerId?: string;
        platform: 'ios' | 'android' | 'web'
    }
) => {
    const { password, confirmPassword, playerId,platform='android', ...userData } = payload;

    if (password !== confirmPassword) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Password and confirm password doesn't match"
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email: userData.email });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const verifyCode = generateVerifyCode();

        let user: any;
        let profile: any;

        if (existingUser && existingUser.isVerified) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'This email already exists and is verified'
            );
        }

        if (existingUser && !existingUser.isVerified) {
            user = await User.findByIdAndUpdate(
                existingUser._id,
                {
                    password: hashedPassword,
                    role:"user",
                    verifyCode,
                    codeExpireIn: new Date(Date.now() + 5 * 60000),
                },
                { new: true, session }
            );

            if (existingUser.profileId) {
                    await NormalUser.deleteOne({
                        _id: existingUser.profileId,
                    }).session(session);
            }
        }

        if (!existingUser) {
            const userPayload = {
                email: userData.email,
                phone: userData.phone,
                password: hashedPassword,
                role:'user',
                verifyCode,
                codeExpireIn: new Date(Date.now() + 5 * 60000),
            };

            [user] = await User.create([userPayload], { session });
        }

            const normalUserProfilePayload = {
                ...userData,
                user: user._id,
            };
            [profile] = await NormalUser.create([normalUserProfilePayload], { session });
       

        await User.findByIdAndUpdate(
            user._id,
            { profileId: profile._id },
            { session }
        );

          if (playerId) {
            await upsertDevice(user._id.toString(), playerId, platform);
        }

        sendEmail({
            email: userData.email,
            subject: 'Activate Your Account',
            html: registrationSuccessEmailBody(
                profile.name,
                parseInt(user.verifyCode.toString())
            ),
        });

        await session.commitTransaction();
        session.endSession();

        return profile;
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

const verifyCode = async (email: string, verifyCode: number) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.codeExpireIn < new Date(Date.now())) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Verify code is expired');
  }
  if (verifyCode !== user.verifyCode) {
    throw new AppError(httpStatus.BAD_REQUEST, "Code doesn't match");
  }
  await User.findOneAndUpdate(
    { email: email },
    { isVerified: true },
    { new: true, runValidators: true },
  );

  const jwtPayload = {
    id: user?._id,
    profileId: user.profileId,
    email: user?.email,
    role: user?.role as TUserRole,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );
  return {
    accessToken,
    refreshToken,
  };
};

const resendVerifyCode = async (email: string) => {
  const user = await User.findOne({ email: email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const verifyCode = generateVerifyCode();
  const updateUser = await User.findOneAndUpdate(
    { email: email },
    { verifyCode: verifyCode, codeExpireIn: new Date(Date.now() + 5 * 60000) },
    { new: true, runValidators: true },
  );
  if (!updateUser) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Something went wrong . Please again resend the code after a few second',
    );
  }
  sendEmail({
    email: user.email,
    subject: 'Activate Your Account',
    html: registrationSuccessEmailBody('Dear', updateUser.verifyCode),
  });
  return null;
};

const updateUserProfile = async (userData: JwtPayload, payload: any) => {
  let result = null;
  if (userData.role == USER_ROLE.superAdmin) {
    result = await SuperAdmin.findByIdAndUpdate(userData.profileId, payload, {
      new: true,
      runValidators: true,
    });
  }

  return result;
};

const roleModelMap: Record<string, any> = {
  [USER_ROLE.superAdmin]: SuperAdmin,
};

const getUserProfile = async (userData: JwtPayload) => {
  const Model = roleModelMap[userData.role];

  if (!Model) {
    throw new Error('Invalid role');
  }

  const result = await Model.findById(userData.profileId).populate({
    path: 'user',
    select: 'isBlocked email role',
  });

  return result;
};

const changeUserStatus = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const result = await User.findByIdAndUpdate(
    id,
    { isBlocked: !user.isBlocked },
    { new: true, runValidators: true },
  );
  return result;
};

const deleteAccount = async (userData: JwtPayload, password: string) => {
  const user = await User.findById(userData.id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'Account not found');
  }

  return null;
};

const userServices = {
  verifyCode,
  resendVerifyCode,
  changeUserStatus,
  updateUserProfile,
  getUserProfile,
  deleteAccount,
  registerUser
};

export default userServices;
