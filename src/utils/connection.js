import Sequelize from "sequelize"
import { DBTABLE, HOST, PASSWORD, USERNAME } from "./env.js"

const dialect = "mysql"
const options = {
  host: HOST,
  dialect
}

const sequelize = new Sequelize(DBTABLE, USERNAME, PASSWORD, options)

sequelize
  .authenticate()
  .then(() => console.log("connection successful"))
  .catch((err) => console.log("mysql connection error"))

export default sequelize
