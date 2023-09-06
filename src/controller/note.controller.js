import Favorite from "../models/favorite.model"
import Note from "../models/note.model.js"
import User from "../models/user.model.js"
import { decodeToken } from "../utils/middleware.js"
import { NOT_FOUND, NO_CONTENT, SERVER_ERROR, SUCCESS } from "../utils/status-codes"

Note.belongsTo(User, { foreignKey: "user_id", targetKey: "id", as: "owner" })

export const createNote = async (req, res) => {
  const { id: user_id } = decodeToken(req)
  try {
    const note = await Note.create({ note: req.body.note, user_id })
  } catch (error) {
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error"
    })
  }
}

export const deleteNote = async (req, res) => {
  const { id: user_id } = decodeToken(req)
  try {
    await Note.destroy({
      where: {
        id: req.params.id,
        user_id
      }
    })
    return res.status(NO_CONTENT).json({
      status: NO_CONTENT,
      message: ""
    })
  } catch (error) {
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error"
    })
  }
}

export const favoriteNote = async (req, res) => {
  const { id: user_id } = decodeToken(req)
  const noteId = req.body.note_id
  try {
    await Favorite.create({
      user_id,
      note_id: noteId
    })
    const note = await Note.findByPk(noteId)
    if (!note) {
      return res.status(NOT_FOUND).json({
        status: NOT_FOUND,
        message: "note not found"
      })
    }

    const totalLikes = note.like + 1
    Note.update({ like: totalLikes }, { where: { id: noteId } })

    return res.status(SUCCESS).json({
      status: SUCCESS,
      message: "favorite"
    })
  } catch (error) {
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error"
    })
  }
}

export const unFavoriteNote = async (req, res) => {
  const { id: user_id } = decodeToken(req)
  const noteId = req.body.note_id
  try {
    const favorite = await Favorite.findOne({
      where: {
        user_id,
        note_id: noteId
      }
    })

    if (!favorite) {
      return res.status(NOT_FOUND).json({
        status: NOT_FOUND,
        message: "note not found"
      })
    }

    await Favorite.destroy({
      user_id,
      note_id: noteId
    })

    const note = await Note.findByPk(noteId)
    if (!note) {
      return res.status(NOT_FOUND).json({
        status: NOT_FOUND,
        message: "note not found"
      })
    }

    const totalLikes = note.like - 1
    Note.update({ like: totalLikes }, { where: { id: noteId } })

    return res.status(NO_CONTENT).json({
      status: NO_CONTENT,
      message: ""
    })
  } catch (error) {
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error"
    })
  }
}

export const getMyNotes = async (req, res) => {
  const { id: user_id } = decodeToken(req)
  try {
    const myNotes = await Note.findAll({
      where: {
        user_id: user_id
      }
    })

    return res.status(NO_CONTENT).json({
      status: NO_CONTENT,
      body: myNotes,
      message: ""
    })
  } catch (error) {
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error"
    })
  }
}

export const getNotes = async (req, res) => {
  const { id: user_id } = decodeToken(req)
  try {
    await Note.findAll({
      attributes: {},
      include: {
        model: User,
        as: "owner",
        attributes: ["id", "first_name", "last_name"]
      }
    })
  } catch (error) {
    return res.status(SERVER_ERROR).json({
      status: SERVER_ERROR,
      message: "server error"
    })
  }
}
