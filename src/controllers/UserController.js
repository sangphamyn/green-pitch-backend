const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");
// Register
const register = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    let message = {};
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const vietnamesePhoneNumberRegex =
      /^(?:0|\+84)(?:3[2-9]|5[2689]|7[06-9]|8[1-9]|9\d)\d{7}$/;
    if (!name) message["name"] = "Cần điền tên";
    if (!email) message["email"] = "Cần điền email";
    else if (!reg.test(email)) message["email"] = "Email không hợp lệ";
    if (!phone) message["phone"] = "Cần điền số điện thoại";
    else if (!vietnamesePhoneNumberRegex.test(phone))
      message["phone"] = "Số điện thoại không hợp lệ";
    if (!password) message["password"] = "Cần điền mật khẩu";
    if (password && password.length < 6)
      message["password"] = "Mật khẩu ít nhất 6 kí tự";
    if (!confirmPassword)
      message["confirmPassword"] = "Cần điền xác nhận mật khẩu";
    if (password && confirmPassword && password !== confirmPassword)
      message["confirmPassword"] = "Mật khẩu không khớp";
    if (Object.keys(message).length > 0)
      return res.status(200).json({
        status: "error",
        message: message,
      });
    const response = await UserService.register(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
// Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    let message = {};
    const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const vietnamesePhoneNumberRegex =
      /^(?:0|\+84)(?:3[2-9]|5[2689]|7[06-9]|8[1-9]|9\d)\d{7}$/;
    if (!username) message["username"] = "Cần điền email hoặc số điện thoại";
    else if (!reg.test(username) && !vietnamesePhoneNumberRegex.test(username))
      message["username"] = "Email hoặc số điện thoại không hợp lệ";
    if (!password) message["password"] = "Cần điền mật khẩu";
    if (Object.keys(message).length > 0)
      return res.status(200).json({
        status: "error",
        message: message,
      });
    const response = await UserService.login(req.body);
    const { refresh_token, ...newReponse } = response;
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      path: "/",
    });
    return res.status(200).json({ ...newReponse, refresh_token });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getDetailsUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(200).json({
        status: "error",
        message: "Cần id",
      });
    }
    const response = await UserService.getDetailsUser(userId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const refreshToken = async (req, res) => {
  try {
    let token = req.cookies.refreshToken;
    if (!token) {
      return res.status(200).json({
        status: "error",
        message: "Thiếu token",
      });
    }
    const response = await JwtService.refreshTokenJwtService(token);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  register,
  login,
  refreshToken,
  getDetailsUser,
};
