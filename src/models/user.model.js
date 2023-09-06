import { Model, DataTypes } from "sequelize"
import sequelize from "../utils/connection.js"
import { hash } from "bcrypt"

export const salt = 12
class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    followers: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [11]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
        // customeValidate(value) {
        //   const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        //   if (!regex.test(email)) throw new Error("invalid email format")
        // }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  { sequelize, tableName: "users", paranoid: true }
)

User.beforeCreate(async (user, options) => {
  console.clear()
  console.log(options)
  const hashPassword = await hash(user.password.toString(), salt)
  user.password = hashPassword
})
export default User
