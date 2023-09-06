import { Model, DataTypes } from "sequelize"
import sequelize from "../utils/connection.js"

class Note extends Model {}

Note.init(
  {
    id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.STRING, allowNull: false },
    note: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        max: 255
      }
    },
    visibility: { type: DataTypes.STRING, allowNull: true, defaultValue: true },
    likes: { type: DataTypes.INTEGER, defaultValue: 0 }
  },
  { sequelize, tableName: "notes", paranoid: true }
)

export default Note
