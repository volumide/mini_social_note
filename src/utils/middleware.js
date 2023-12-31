import jwt from "jsonwebtoken"
import jwtDecode from "jwt-decode"

export const accessToken = (user) => jwt.sign(user, "token")

export const authorize = (req, res, next) => {
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
    }
    req.user = user
    next()
  })
}

export const decodeToken = (req) => {
  const auth = req.headers["authorization"]
  const token = auth.split(" ")[1]
  return jwtDecode(token)
}
