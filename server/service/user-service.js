const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const UserModel = require('../models/user-model')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ email })
    if (candidate) {
      throw ApiError.BadRequest(
        `Прользователь с почтовым адресом ${email} уже сущестует`
      )
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuid.v4()
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink
    })
    await mailService.sendActivationMail(
      email,
      `${process.env.API_URL}/api/activate/${activationLink}`
    )

    const userDto = UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, userDto }
  }
  async activate(activationLink) {
    const user = await UserModel.findOne({ activationLink })

    if (!user) {
      throw ApiError.BadRequest('Неккоректная ссылка активации')
    }
    user.isActivated = true
    await user.save()
  }
  async login(email, password) {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw ApiError.BadRequest('Пользователь не зарегистрирован')
    }
    const isPassEquale = await bcrypt.compare(password, user.password)
    if (!isPassEquale) {
      throw ApiError.BadRequest('Неверный пароль')
    }
    const userDto = UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return { ...tokens, user: userDto }
  }
}

module.exports = new UserService()
