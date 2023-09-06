import { follow, followers, login, signup, unfollow, updatePassword, updateProfile } from "./controller/auth.controller.js"
import { createNote, deleteNote, favoriteNote, getMyNotes, getNotes, unFavoriteNote } from "./controller/note.controller.js"
import { authorize } from "./utils/middleware.js"

const routes = (app) => {
  // user route
  app.post("/signup", signup)
  app.post("/signin", login)
  app.put("/update/profile", authorize, updateProfile)
  app.put("/update/password", authorize, updatePassword)
  app.get("/followers", authorize, followers)
  app.post("/follow", authorize, follow)
  app.put("/unfollow", authorize, unfollow)

  //   note route
  app.post("/note/create", authorize, createNote)
  app.delete("/note/delete/:id", authorize, deleteNote)
  app.post("/note/favorite", authorize, favoriteNote)
  app.put("/note/favorite/remove", authorize, unFavoriteNote)
  app.post("/note/all/", authorize, getNotes)
  app.post("/note/user/", authorize, getMyNotes)
}

export default routes
