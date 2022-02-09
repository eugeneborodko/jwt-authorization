const ApiError = require('../exceptions/api-error')
const tokenService = require('../services/token-service')

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
      return next(ApiError.unauthorized())
    }
    const accessToken = authorizationHeader.split(' ')[1]
    console.log('accessToken: ', accessToken)
    if (!accessToken) {
      return next(ApiError.unauthorized())
    }
    const userData = tokenService.validateAccessToken(accessToken)
    if (!userData) {
      return next(ApiError.unauthorized())
    }
    console.log('userData: ', userData)
    req.user = userData
    next()
  } catch (err) {
    return next(ApiError.unauthorized())
  }
}
