const { validationResult } = require('express-validator')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')
const userModel = require('../models/user-model')
const userService = require('../service/user-service')

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
      }
      const { email, password } = req.body
      const userData = await userService.registration(email, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body
      const userData = await userService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true
      })
      return res.json(userData)
    } catch (e) {
      next(e)
    }
  }

  async logout(req, res, next) {
    try {
      res.json(['logout', '426'])
    } catch (e) {
      next(e)
    }
  }

  async activate(req, res, next) {
    try {
      const activationlink = req.params.link || ''
      await userService.activate(activationlink)
      return res.redirect(process.env.CLIENT_URL)
    } catch (e) {
      next(e)
    }
  }

  async refresh(req, res, next) {
    try {
      res.json(['refresh', '426'])
    } catch (e) {
      next(e)
    }
  }

  async getUsers(req, res, next) {
    try {
      let users = await userModel.find({})
      users = users.map((u) => {
        return UserDto(u)
      })
      return res.json(users)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = new UserController()
