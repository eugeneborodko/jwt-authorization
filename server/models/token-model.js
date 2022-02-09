const { DataTypes } = require('sequelize')
const db = require('../db')

const Token = db.define('token', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  refreshToken: { type: DataTypes.STRING, allowNull: false },
})

module.exports = Token
