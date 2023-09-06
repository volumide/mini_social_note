import { compare, hash } from "bcrypt"
import User, { salt } from "../models/user.model.js"
import { SERVER_ERROR, CREATED, BAD_REQUEST, SUCCESS } from "../utils/status-codes.js"
import { accessToken, decodeToken } from "../utils/middleware.js"
import Followers from "../models/follows.model.js"

// User.hasMany(Followers, { foreignKey: "follower_id", sourceKey: "id" })
Followers.belongsTo(User, { foreignKey: "follower_id", targetKey: "id", as: "follower" })

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
    console.log(error)
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error",
      error: error.errors[0].message
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

export const updateProfile = async (req, res) => {
  const token = decodeToken(req)
  try {
    const { password, createdAt, deletedAt, updatedAt, ...data } = req.body
    await User.update(data, { where: { id: token.id } })
    return res.status(SUCCESS).json({
      status: SUCCESS,
      message: "profile updated",
      body: await User.findByPk(token.id, { attributes: { exclude: ["password", "deletedAt"] } })
    })
  } catch (error) {
    console.log(error)
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error",
      error: error.errors
    })
  }
}

export const updatePassword = async (req, res) => {
  const { password, newPassword } = req.body
  // console.log(password, newPassword)
  const { id } = decodeToken(req)

  try {
    const user = await User.findByPk(id)
    const comparePassword = await compare(password, user.dataValues.password)
    if (!comparePassword) {
      return res.status(BAD_REQUEST).json({
        status: BAD_REQUEST,
        message: "incorrect password"
      })
    }
    const psWrd = await hash(newPassword.toString(), salt)
    await User.update({ password: psWrd }, { where: { id: id } })

    return res.status(SUCCESS).json({
      status: SUCCESS,
      message: "password updated"
    })
  } catch (error) {
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error",
      error: error
    })
  }
}

export const follow = async (req, res) => {
  const { id } = decodeToken(req)
  try {
    const findUser = await User.findByPk(req.body.user_id)
    if (!findUser) {
      return res.status(NOT_FOUND).json({
        status: NOT_FOUND,
        message: "user not found"
      })
    }

    const allFollowers = findUser.followers

    await User.update({ followers: allFollowers + 1 }, { where: { id: req.body.user_id } })

    await Followers.create({
      follower_id: id,
      user_id: req.body.user_id
    })

    return res.status(SUCCESS).json({
      status: SUCCESS,
      message: "success"
    })
  } catch (error) {
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error",
      error: error
    })
  }
}

export const unfollow = async (req, res) => {
  const { id } = decodeToken(req)
  try {
    const findUser = await User.findByPk(req.body.user_id)
    if (!findUser) {
      return res.status(NOT_FOUND).json({
        status: NOT_FOUND,
        message: "user not found"
      })
    }

    const allFollowers = parseInt(findUser.followers)
    await User.update({ followers: allFollowers - 1 }, { where: { id: findUser.id } })

    await Followers.destroy({
      where: {
        follower_id: id,
        user_id: req.body.user_id
      }
    })

    return res.status(SUCCESS).json({
      status: SUCCESS,
      message: "success"
    })
  } catch (error) {
    console.log(error)
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error",
      error
    })
  }
}

export const followers = async (req, res) => {
  try {
    const { id } = decodeToken(req)
    console.log(id)
    // return
    const followers = await Followers.findAll({
      where: {
        user_id: id
      },
      include: {
        model: User,
        as: "follower",
        attributes: ["id", "first_name", "last_name"]
      }
    })
    return res.status(SUCCESS).json({
      status: SUCCESS,
      body: followers
    })
  } catch (error) {
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error",
      error
    })
  }
}
