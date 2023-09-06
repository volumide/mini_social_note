import express, { json } from "express"
import cors from "cors"
import { PORT } from "./src/utils/env.js"
import connection from "./src/utils/connection.js"
import routes from "./src/routes.js"

const router = express.Router()
const app = express()
app.use(cors({ origin: "*" }))
app.use(json())

routes(router)
app.use("/api/v1", router)

// connection.sync()
app.listen(PORT, () => console.log(`app running on port ${PORT}`))
console.clear()
