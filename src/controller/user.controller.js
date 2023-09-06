import User from "../models/user.model"
import { SERVER_ERROR, CREATED } from "../utils/status-codes.js"

const signup = async (req, res) => {
  try {
    const { email, password, first_name, last_name, phone } = req.body
    const reg = await User.create({
      first_name,
      last_name,
      phone,
      email,
      password
    })
    return res.status(CREATED).json({
      status: CREATED,
      message: "sign up success"
    })
  } catch (error) {
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error"
    })
  }
}
