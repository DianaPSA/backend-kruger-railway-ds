import mongoose from "mongoose";

//Comentario estructura
// {
//     user: "1234",
//     message: "hola mundo",
//     createeAt: "2022-10-05T00:00:00.000Z"
// }
//De alguna manera debemos poder llegar a obtene rla informacion del usuario que hizo el comentario
// {
//     user:{
//         username: "1234",
//         email: "prueba@hotmail.com",
//         role: "admin"
//     },
//     message: "hola mundo",
//     createeAt: "2022-10-05T00:00:00.000Z"
// }

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createeAt: {
    type: Date,
    default: Date.now,
  },
});

export const Comment = mongoose.model("comments", commentSchema);
