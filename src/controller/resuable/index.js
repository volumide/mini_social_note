import Favorite from "../../models/favorite.model.js"

const favorite = async (note_id, user_id) => {
  return await Favorite.findOne({
    where: { note_id, user_id }
  })
}

export default favorite
