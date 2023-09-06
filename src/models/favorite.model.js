import { Model, DataTypes } from "sequelize"
import sequelize from "../utils/connection.js"

class Favorite extends Model {}
Favorite.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    note_id: { type: DataTypes.STRING, allowNull: false },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  { sequelize, tableName: "favorites", paranoid: true }
)

export default Favorite
