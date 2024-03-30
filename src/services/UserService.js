const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const register = (user) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, phone, password, role } = user;
    try {
      let existingUser = await User.findOne({ email: email });
      let message = {};
      if (existingUser) {
        message["email"] = "Email đã đăng ký";
        resolve({
          status: "error",
          message: message,
        });
        return;
      }
      existingUser = await User.findOne({ phone: phone });
      if (existingUser) {
        message["phone"] = "Số điện thoại đã đăng ký";
        resolve({
          status: "error",
          message: message,
        });
        return;
      }
      const hash = bcrypt.hashSync(password, 10);
      const createdUser = await User.create({
        name,
        email,
        phone,
        password: hash,
        role,
      });
      if (createdUser) {
        resolve({
          status: "success",
          message: "Đăng ký thành công",
          data: createdUser,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const login = (user) => {
  return new Promise(async (resolve, reject) => {
    const { username, password, role } = user;
    try {
      const existingUser = await User.findOne({
        $or: [{ email: username }, { phone: username }],
      });
      let message = {};
      if (existingUser === null) {
        message["username"] = "Email hoặc số điện thoại chưa đăng ký";
        resolve({
          status: "error",
          message: message,
        });
        return;
      }
      const comparePassword = bcrypt.compareSync(
        password,
        existingUser.password
      );

      if (!comparePassword) {
        message["password"] = "Sai mật khẩu";
        resolve({
          status: "error",
          message: message,
        });
        return;
      }
      if (existingUser.role != role) {
        if (existingUser.role == 2) {
          message["permission"] = "Bạn đã là chủ sân";
          resolve({
            status: "error",
            message: message,
          });
        }
        if (existingUser.role == 1) {
          message["permission"] = "Bạn đã là cầu thủ";
          resolve({
            status: "error",
            message: message,
          });
        }
        return;
      }
      const access_token = await genneralAccessToken({
        id: existingUser.id,
        role: existingUser.role,
      });
      const refresh_token = await genneralRefreshToken({
        id: existingUser.id,
        role: existingUser.role,
      });

      resolve({
        status: "success",
        message: "Đăng nhập thành công",
        access_token,
        refresh_token,
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({
        _id: id,
      });
      if (user === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCESS",
        data: user,
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  register,
  login,
  getDetailsUser,
};
