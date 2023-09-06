import { Model, DataTypes } from "sequelize"
import sequelize from "../utils/connection.js"
import { hash } from "bcrypt"

const salt = 12
class User extends Model {}

User.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        min: 11,
        max: 11
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
      allowNull: false,
      set(value) {
        this.setDataValue("password", hash(value, salt))
      }
    }
  },
  { sequelize, tableName: "users", paranoid: true }
)

// User.beforeCreate(async (user, options) => {
//   const hashPassword = await bcrypt.hash(user.password.toString(), salt)
//   user.password = hashPassword
// })
export default User
