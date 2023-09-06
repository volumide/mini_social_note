import jwt from "jsonwebtoken"
import jwtDecode from "jwt-decode"

export const accessToken = (user) => jwt.sign(user, "token")

export const middleware = (req, res, next) => {
  const auth = req.headers["authorization"]
  const token = auth ? auth.split(" ")[1] : ""
  if (!token)
    return res.status(401).json({
      "message": "unauthorized"
    })
  jwt.verify(token, "token", (err, user) => {
    if (err) {
      return res.status(400).json({
        "message": err.message
      })
    } else {
      req.user = user
      next()
    }
  })
}

export const decodeToken = (req) => {
  const token = req.header.authorization
  if (!token) return false
  const dT = token.split(" ")
  if (dT[0] !== "Bearer".toLowerCase()) return false
  return jwtDecode(dT[1])
}
