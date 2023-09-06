import { compare } from "bcrypt"
import User from "../models/user.model"
import { SERVER_ERROR, CREATED, BAD_REQUEST, SUCCESS } from "../utils/status-codes.js"
import { accessToken } from "../utils/middleware"

export const signup = async (req, res) => {
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

export const login = async (req, res) => {
  try {
    const { email, password: pss } = req.body
    const user = await User.findOne({ where: { email: email } })

    if (!user) {
      return res.status(NOT_FOUND).json({
        status: NOT_FOUND,
        message: "user not found"
      })
    }

    const verifyPassword = compare(pss, user.password)

    if (!verifyPassword) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        message: "invalid password"
      })
    }

    const {
      dataValues: { password, ...data }
    } = user

    const token = accessToken(data)
    return res.status(SUCCESS).json({
      status: SUCCESS,
      token,
      body: data,
      message: ""
    })
  } catch (error) {
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error"
    })
  }
}
