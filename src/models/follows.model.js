import { Model, DataTypes } from "sequelize"
import sequelize from "../utils/connection.js"

class Followers extends Model {}
Followers.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    follower_id: { type: DataTypes.STRING, allowNull: false },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  { sequelize, tableName: "followers", paranoid: true }
)

export default Followers
