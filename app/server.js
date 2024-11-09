import express from "express";
import { connectDB } from "./db/db.js";
import productRoutes from "./routes/product.router.js";
import userRoutes from "./routes/user.router.js";
import authRoutes from "./routes/auth.router.js";
import logsRoutes from "./routes/logs.router.js";
import ordersRoutes from "./routes/order.router.js";
import configs from "./configs/configs.js";
import cors from "cors";

const app = express();

//1. Middleware para parsear el request (agregar configuracion para que soporte formato json)
app.use(express.json());
app.use(cors()); //con esto nuestro backend va a aceptar peticiones de cualquier lado, lo ideal es limitar desde un dominio de front end especifico.

//2. Conectamos la BD
connectDB();

//3. Definimos las rutas
app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/logs", logsRoutes);
app.use("/orders", ordersRoutes);

//3. Levantamos la aplicacion
app.listen(configs.PORT, () => {
  console.log(`Servidor iniciado en el puerto ${configs.PORT}`);
});
