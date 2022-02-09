const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDto = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

class UserService {
  async registration(email, password) {
    const candidate = await UserModel.findOne({ where: { email } })
    if (candidate) {
      throw ApiError.badRequest(`user with ${email} email already exists`)
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = `${process.env.API_URL}/api/activate/${uuid.v4()}`
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    })
    await mailService.sendActivationMail(email, activationLink)
    const userDto = new UserDto(user)
    const tokens = await tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

  async login(email, password) {
    const user = await UserModel.findOne({ where: { email } })
    if (!user) {
      throw ApiError.badRequest(`User with email ${email} not found`)
    }
    const isPasswordsEqual = await bcrypt.compare(password, user.password)
    if (!isPasswordsEqual) {
      throw ApiError.badRequest(`Wrong password`)
    }
    const userDto = new UserDto(user)
    const tokens = await tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

  async logout(refreshToken) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  async activate(activationLink) {
    const user = await UserModel.findOne({ where: { activationLink } })
    if (!user) {
      throw ApiError.badRequest('user not found')
    }
    user.isEmailActivated = true
    await user.save()
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.unauthorized()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDataBase = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDataBase) {
      throw ApiError.unauthorized()
    }
    const user = await UserModel.findOne({ where: { id: userData.id } })
    const userDto = new UserDto(user)
    const tokens = await tokenService.generateTokens({ ...userDto })
    await tokenService.saveToken(userDto.id, tokens.refreshToken)

    return {
      ...tokens,
      user: userDto,
    }
  }

  async getAll() {
    const users = await UserModel.findAll()
    return users
  }
}

module.exports = new UserService()
