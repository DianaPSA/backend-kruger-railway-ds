//Vamos a trabajar en un servicio que nos permita obtener el listado de productos

import express from "express";
import {
  getAllProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
  findProductsByFilters,
  getProductsStatistics,
} from "../controllers/product.controller.js";

import authenticationMiddleware from "../middlewares/authentication.middleware.js";
import authorizationMiddleware from "../middlewares/authorization.middleware.js";

const router = express.Router(); //Agrupar en pequenos grupos las rutas que vamos a tener

//Cada vez que el usuario solicite alguna de estas rutas va a consumir el authenticador
//Se puede definir un middleware global o un middleware especifico para cada ruta
router.use(authenticationMiddleware);

//Vamos a definir que rol puede acceder a cada uno de los servicios

//Acceso para todos
router.get(
  "/",
  authorizationMiddleware(["admin", "author", "user"]),
  getAllProducts
); //Solamente pueden acceder los usuarios que tengan el rol admin, author
//Acceso para admin y author
router.post("/", authorizationMiddleware(["admin", "author"]), saveProduct); //Una vez definida la ruta debemos definir el controlador
router.put("/:id", authorizationMiddleware(["admin", "author"]), updateProduct); //Acceso para admin y author
router.delete("/:id", authorizationMiddleware(["admin"]), deleteProduct); //Acceso para admin
router.get(
  "/statistics",
  authorizationMiddleware(["admin", "author", "user"]),
  getProductsStatistics
); //Acceso para todos
//Acceso para todos
router.get(
  "/by-filters",
  authorizationMiddleware(["admin", "author", "user"]),
  findProductsByFilters
); //{{host}}/products/by-filters?price[gte]=30&price[lt]=300&limit=10&page=1&sort=price
//{{host}}/products/by-filters?price=2000&limit=10&page=1&sort=price

export default router;
