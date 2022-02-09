const { DataTypes } = require('sequelize')
const db = require('../db')

const User = db.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  isEmailActivated: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  activationLink: { type: DataTypes.STRING, allowNull: false },
})

module.exports = User
