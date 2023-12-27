import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/user.js";
import nodemailer from "nodemailer";
// import crypto from "crypto";

dotenv.config();

export const searchUser = async (req, res) => {
  const {
    _page = 1,
    _limit = 10,
    _sort = "createAt",
    _order = "asc",
    _keywords = "",
  } = req.query;

  const option = {
    page: _page,
    limit: _limit,
    sort: {
      [_sort]: _order === "desc" ? 1 : -1,
    },
  };
  try {
    const users = await User.paginate({}, option);
    if (!users.docs || users.docs.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy tài khoản",
      });
    }

    const searchData = (users) => {
      return users?.docs?.filter((item) =>
        item?.user_fullName?.toLowerCase().includes(_keywords)
      );
    };

    const searchDataUser = await searchData(users);
    const userResponse = await { ...users, docs: searchDataUser };

    res.status(200).json({
      message: "Lấy thành công ",
      userResponse,
      pagination: {
        currentPage: users.page,
        totalPages: users.totalPages,
        totalItems: users.totalDocs,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      return res.status(401).json({
        message: "không tìm thấy tài khoản nào",
      });
    }
    const totalUser = await User.count();
    return res.status(200).json({
      success: true,
      users,
      totalUser,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản",
      });
    }
    return res.status(200).json({
      user,
      message: "Lấy sản phẩm thành công",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const formData = req.body;
  const { email } = req.body;
  try {
    const checkEmail = await User.findOne({ email });
    if (checkEmail && checkEmail._id !== id) {
      return res.status(400).json({
        success: false,
        message: "Email đã tồn tại",
      });
    }
    const user = await User.findByIdAndUpdate(id, formData);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản",
      });
    }
    return res.status(200).json({
      message: "Cập nhật tài khoản thành công",
      user,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const removeUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản",
      });
    }
    return res.json({
      message: "Xoá tài khoản thành công",
      user,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, password, confirmPassword, rePassword, newPassword } =
      req.body;

    // KIỂM TRA USER CÓ TỒN TẠI HAY K
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Không tìm thấy tài khoản",
      });
    }
    const checkPasword = await bcrypt.compare(password, user.password);
    if (!checkPasword) {
      return res.status(400).json({
        message: "Không tìm thấy Mật khẩu. Vui lòng nhập lại",
      });
    }
    const reCheckPasword = await bcrypt.compare(rePassword, user.password);
    if (!reCheckPasword) {
      return res.status(400).json({
        message: "Không tìm thấy Mật khẩu. Vui lòng nhập lại",
      });
    }
    const sameOldPasword = await bcrypt.compare(newPassword, user.password);
    if (!sameOldPasword) {
      return res.status(400).json({
        message: "Bạn vừa nhập lại mật khẩu cũ. Vui lòng điền mật khẩu khác",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const userChangePassword = await User.findByIdAndUpdate(
      { _id: user._id },
      { password: hashPassword },
      { new: true }
    );

    return res.status(200).json({
      message: "Thay đổi mật khẩu thành công",
      userChangePassword,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

//QUÊN MẬT KHẨU
export const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Không tìm thấy tài khoản",
      });
    }

    // TẠO MÃ XÁC THỰC NGẪU NHIÊN
    // const verifyToken = crypto.randomBytes(3).toString("hex").toUpperCase();

    //LƯU MÃ VÀO DB, CONLLECTION USER
    // user.verifyToken = verifyToken;
    await user.save();

    // GỬI EMAIL ĐẾN ĐỊA CHỈ NGƯỜI DÙNG YÊU CẦU ĐẶT LẠI MẬT KHẨU
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      service: "gmail",
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: process.env.EMAIL_SENDER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // GỬI EMAIL VỚI TRANSPORTER ĐÃ ĐƯỢC CONFIG XONG
    const info = await transporter.sendMail({
      from: `"MONA MEDIA 🍏" ${process.env.EMAIL_SENDER}`,
      to: email, // list of receivers
      subject: "Reset your password", // Subject line
      html: `<p style="font-size: 16px; color: #002140; font-weight: 600;">You have requested to reset your password. Please enter the verification code:</p>
      <p><strong style="font-size: 18px; color: #E98C81;">${verifyToken}</strong></p>`, // html body
    });

    if (!info) {
      return res.status(400).json({
        message:
          "Mã đặt lại mật khẩu của bạn đã được gửi đến emai. Vui lòng kiểm tra lại <3",
      });
    }
    return res.status(200).json({
      message:
        "Mã đặt lại mật khẩu đã được gửi đến email. Vui lòng kiểm tra lại.",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

//MIDDLE WARE VERIFYTOKEN EMAIL TOKEN
export const verifyToken = async (req, res, next) => {
  const { email, verifyToken } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Can't find the account to verify!",
      });
    }
    //
    const storeToken = user.verifyToken;
    // Check xem token người dùng gửi lên có khớp với token trong db không
    if (!verifyToken || (verifyToken && verifyToken !== storeToken)) {
      return res.status(400).json({
        message: "Invalid verification code! Please check again.",
      });
    }
    res.status(200).json({
      message: "Xác minh thành công. Bạn có thể đổi lại mật khẩu ngay bây giờ",
    });
    next();
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

//RESETPASSWORD
export const resetPassword = async (req, res) => {
  const { email, password, verifyToken } = req.body;
  try {
    const user = await User.findOne({ email, verifyToken });
    if (!user) {
      return res.status(400).json({
        message: "Không tìm thấy tài khoản!",
      });
    }
    const hashPassword = await bcrypt.compare(password, 10);
    user.password = hashPassword;
    await user.save();

    // Sau khi đã reset mật khẩu, đặt verifyToken trong db thành rỗng
    user.verifyToken = "";
    await user.save();

    return res.status(200).json({
      message: "Bạn đã đổi mật khẩu thành công. Vui lòng đăng nhập lại",
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
