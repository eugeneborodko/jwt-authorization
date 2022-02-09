const userService = require('../services/user-service')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(ApiError.badRequest('Validation error', errors.array()))
      }
      const { email, password } = req.body
      const maxAge = 30 * 24 * 60 * 60 * 1000
      const user = await userService.registration(email, password)
      res.cookie('refreshToken', user.refreshToken, { maxAge, httpOnly: true })
      return res.json(user)
    } catch (err) {
      next(err)
    }
  }

  async login(req, res, next) {
    try {
      const maxAge = 30 * 24 * 60 * 60 * 1000
      const { email, password } = req.body
      const user = await userService.login(email, password)
      res.cookie('refreshToken', user.refreshToken, { maxAge, httpOnly: true })
      return res.json(user)
    } catch (err) {
      next(err)
    }
  }

  async logout(req, res, next) {
    try {
      const {refreshToken} = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    } catch (err) {
      next(err)
    }
  }

  async activate(req, res, next) {
    try {
      const activationLink = `${process.env.API_URL}/api/activate/${req.params.link}`
      await userService.activate(activationLink)
      return res.redirect(process.env.CLIENT_URL)
    } catch (err) {
      next(err)
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const maxAge = 30 * 24 * 60 * 60 * 1000
      const user = await userService.refresh(refreshToken)
      res.cookie('refreshToken', user.refreshToken, { maxAge, httpOnly: true })
      return res.json(user)

    } catch (err) {
      next(err)
    }
  }

  async getAll(req, res, next) {
    try {
      const users = await userService.getAll()
      return res.json(users)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = new UserController()
