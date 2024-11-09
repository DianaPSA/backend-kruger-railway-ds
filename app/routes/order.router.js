import express from "express";
import {
  createOrder,
  getOrderByUserId,
  addCommentToOrder,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrder);
//Servicio que nos permita obtener el listado de ordenes por userId
router.get("/:userId", getOrderByUserId);
//Servicio para agregar comentarios a una orden
//1.Primero necesito la orden a la cual vamos a agregar los comentarios -->
//id de la orden que vamos a recibir un path param
router.post("/:orderId/comment", addCommentToOrder);

export default router;
