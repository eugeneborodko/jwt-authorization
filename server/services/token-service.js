const jwt = require('jsonwebtoken')
const TokenModel = require('../models/token-model')

class TokenService {
  async generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: '30m',
    })
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {
      expiresIn: '30d',
    })
    return {
      accessToken,
      refreshToken,
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({ where: { userId } })
    if (tokenData) {
      tokenData.refreshToken = refreshToken
      return tokenData.save()
    }
    const token = await TokenModel.create({ userId, refreshToken })
    return token
  }

  async removeToken(refreshToken) {
    const token = await TokenModel.destroy({ where: { refreshToken } })
    return token
  }

  validateAccessToken(token) {
    try {
      const user = jwt.verify(token, process.env.JWT_ACCESS_TOKEN)
      return user
    } catch (err) {
      return null
    }
  }

  validateRefreshToken(token) {
    try {
      const user = jwt.verify(token, process.env.JWT_REFRESH_TOKEN)
      return user
    } catch (err) {
      return null
    }
  }

  async findToken(refreshToken) {
    const token = await TokenModel.findOne({ where: { refreshToken } })
    return token
  }
}

module.exports = new TokenService()
