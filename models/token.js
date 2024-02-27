const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Token extends Model {}
Token.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expires: {
    type: DataTypes.DATE,
    allowNull: false
  }
},
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'token'
})

module.exports = Token