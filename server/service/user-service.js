const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const UserModel = require("../models/user-model");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw new Error(
        `Прользователь с почтовым адресом ${email} уже сущестует`
      );
    }
    const hashPassword = await bcrypt.hash(password, 3);
    const activationLinc = uuid.v4();
    const user = await UserModel.create({ email, password: hashPassword });
    await mailService.sendActivationMail(email, activationLinc);

    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, userDto };
  }
}

module.exports = new UserService();
