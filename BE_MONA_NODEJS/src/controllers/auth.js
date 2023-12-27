import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { signinSchema, signupSchema } from "../schema/auth.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import {
  generalAccessToken,
  generalRefreshToken,
} from "../service/jwtService.js";

dotenv.config();

export const signin = async (req, res) => {
  try {
    const { error } = signinSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }

    const { user_email, user_password } = req.body;

    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(400).json({
        message: "Tài khoản không tồn tại",
      });
    }
    const isMatch = await bcrypt.compare(user_password, user.user_password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Mật khẩu không đúng",
      });
    }
    user.password = undefined;
    // tạo access token
    const accessToken = generalAccessToken({
      _id: user._id,
      user_email,
      user_fullName: user.user_fullName,
      user_avatar: user.user_avatar,
      user_role: user.user_role,
    });

    // tạo refresh token
    const refreshToken = generalRefreshToken({
      _id: user._id,
      user_email,
      user_fullName: user.user_fullName,
      user_avatar: user.user_avatar,
      user_role: user.user_role,
    });
    return res.json({
      message: "Đăng nhập thành công",
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const signup = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const { user_email, user_password, user_fullName, user_confirmPassword } =
      req.body;
    const userExist = await User.findOne({ user_email });
    if (userExist) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    const hashPassword = await bcrypt.hash(user_password, 10);

    const user = await User.create({
      user_email,
      user_fullName,
      user_password: hashPassword,
    });

    const accessToken = generalAccessToken({
      _id: user._id,
      user_email,
      user_fullName: user.user_fullName,
      user_avatar: user.user_avatar,
      user_role: user.user_role,
    });
    return res.json({
      message: "Đăng ký thành công",
      user,
      accessToken,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

// REFRESH TOKEN
export const refreshToken = async (req, res) => {
  try {
    // lấy mã token gửi lên từ headers
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(400).json({
        message: "không tìm thấy token. Vui lòng đăng nhập lại",
      });
    }

    // call hàm refreshTokenService() để xác thực token gửi lên có hợp lệ không
    // nếu hợp lệ, trả về payload chứa thông tin tài khoản
    const { payload } = refreshTokenService(token);

    // sau khi lấy được thông tin tài khoản, tạo access token mới
    const accessToken = generalAccessToken(payload);
    return res.status(200).json({
      message: "Refresh access token successfully!",
      accessToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
