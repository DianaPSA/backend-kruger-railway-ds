import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { Comment } from "../models/comment.model.js";
// Función para calcular el precio total de la orden
const createOrder = async (req, res) => {
  try {
    // Para crear la orden primero necesitamos calcular el total de la orden
    const { products, userId, comments } = req.body;
    // products = [{product: 1, quantity: 2}, {product: 2, quantity: 3}]

    // Calcular el precio total de la orden
    let totalPrice = 0;

    const productsPromises = products.map(async (item) => {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }
      totalPrice += product.price * item.quantity;
      return product;
    });

    await Promise.all(productsPromises);

    // Crear la orden
    const order = new Order({
      user: userId,
      products,
      comments,
      totalPrice,
    });

    await order.save();

    res.status(201).json({ message: "Orden creada correctamente", order });
  } catch (error) {
    res.status(500).json({ message: "Error al crear la orden", error });
  }
};

// Función para obtener el listado de órdenes por userId
const getOrderByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .populate("user")
      .populate("comments")
      .exec();

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay ordenes para este usuario" });
    }
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las órdenes", error });
  }
};

const addCommentToOrder = async (req, res) => {
  try {
    //Primero vamos a obtener el Id de la orden de nuestro path param
    const { orderId } = req.params;
    //luego necesitamos saber el Id el usuario que esta haciendo el comentario
    //Necesitamos el  mensaje o comentario que escribio el usuario
    //Esto los vamos a obtener del cuerpo de la peticion --> req.body
    const { userId, message } = req.body;
    //vamos a crear el comentario en nuestra base de datos
    const comment = new Comment({
      user: userId,
      message,
    });

    await comment.save();

    //Vamos a relacionar el comentario con la orden
    //Primero necesito buscar la orden con el id que recibi en el path param
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Orden no encontrada" });
    }

    //comments: ["id comentario 1, id comentario 2"]
    //Vamos asociar el comentario que anteriormente insertamos en la base de datos
    //a la orden que acabamos de encontrar
    order.comments.push(comment._id);

    //Vamos a guardar la orden con el nuevo comentario en nuestra base de datos
    await order.save();
    res.status(201).json({ message: "Comentario agregado correctamente" });
    //Si por alguna razon no se pudo agregar el comentario a la orden, hacemos rollback (Transacciones)
    //caso contrario el comentario quedaria en el aire
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el comentario", error });
  }
};
export { createOrder, getOrderByUserId, addCommentToOrder };
