import mongoose from "mongoose";

// Objeto que representa el esquema de la orden
// {
//     user: "idDelUser",
//     products: [
//         {
//             product: "idDelProducto",
//             quantity: "cantidad de productos que esta comprando"
//         },
//         {
//             id: "idDelProducto",
//             quantity: "cantidad de productos que esta comprando"
//         }
//     ],
//     comments: [
//         "idDelComentario",
//         "idDelComentario",
//         "idDelComentario"
//     ],
//     totalPrice: "total de la compra",
// }

// De alguna manera yo puedo traer o poblar las referencias con la informacion de los otros modelos
// {
//     user: {
// username: "pepe",
// email: "pepe@pepe.com",
// role: "admin",
// },
//     products: [
//         {
//             id: "idDelProducto",
//             quantity: "cantidad de productos que esta comprando"
//         },
//         {
//             product: "idDelProducto",
//             quantity: "cantidad de productos que esta comprando"
//         }
//     ],
//     comments: [
//         "idDelComentario",
//         "idDelComentario",
//         "idDelComentario"
//     ],
//     totalPrice: "total de la compra",
// }

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "A quantity must be greater than or equal to 1"],
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Order = mongoose.model("orders", orderSchema);
