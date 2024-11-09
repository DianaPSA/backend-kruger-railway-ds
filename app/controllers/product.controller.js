//Vamos a definir la funcion que va a ser la que nos permita obtener el listado de productos

import { Product } from "../models/product.model.js";
import logger from "../utils/logger.js";
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ message: error.message });
  }
};

const saveProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).send({
        message: "Product not found",
      });
    }
    res.json(product);
  } catch (error) {
    res.status(400).send(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).send({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).send(error);
  }
};

//price
const findProductsByFilters = async (req, res) => {
  try {
    let queryObject = { ...req.query };
    console.log(queryObject);

    const withOutFields = ["page", "limit", "fields", "sort"];

    withOutFields.forEach((field) => delete queryObject[field]);

    console.log(queryObject);

    //Vamos a reemplazar los operadores por su sintaxis habitual para poder utilizarlos en la consulta
    //Vamos a transformar objeto a una cadena de texto o string para poder reemplazar los operadores
    let stringQuery = JSON.stringify(queryObject);
    console.log(stringQuery);
    stringQuery = stringQuery.replace(
      /\b(gte|gt|lte|lt)\b/g, //busca cualquier expresion que tenga estos operadores dentro de la cadena de texto que se esta pasando
      (match) => `$${match}`
    );
    queryObject = JSON.parse(stringQuery);

    //"price,title"
    let sort = "";
    if (req.query.sort) {
      sort = req.query.sort.split(",").join(" ");
    }

    //price,title,description -> aqui especificamos que campos vamos a retornar de esta consulta
    let selected = "";
    if (req.query.fields) {
      selected = req.query.fields.split(",").join(" ");
    }

    //Paginacion: skip (saltar elementos) y limit (es la cantidad de elementos que vamos a mostrar por pagina)
    //Quiero traer informacion de la primer pagina
    //Pagina 1: page=1, limit=10 -> skip = 0, limit = 10
    //Pagina 2: page=2, limit=10 -> skip = 10, limit = 10
    //Pagina 3: page=3, limit=10 -> skip = 20, limit = 10

    let limit = req.query.limit || 100;
    let page = req.query.page || 1;
    let skip = (page - 1) * limit;

    //"price title" -> esto es lo que deberia recibir el sort
    const products = await Product.find(queryObject)
      .select(selected)
      .sort(sort)
      .limit(limit)
      .skip(skip);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProductsStatistics = async (req, res) => {
  try {
    //Vamos a definir los pasos de nuestro pipeline (es la ejecucion de una secuencia de pasos u operaciones)
    //El primer paso es un match -> vamos a filtrar los productos
    const statistics = await Product.aggregate([
      //Primer paso es un match
      {
        $match: { price: { $gte: 100 } },
      },
      //El segundo paso es procesar los documentos para resolver un proceso complejo
      //Vamos a agrupar todos los productos  y vamos hacer lo siguiente:
      //1. Vamos a contar  cuantos productos hay en total
      //2. Vamos a calcular el promedio de precio de todos los productos
      //3. Vamos a obtener el producto mas barato minimo
      //4. Vamos a obtener el producto mas caro maximo
      {
        $group: {
          //Para poder definir cual es la condicion de agrupamiento usamos el atributo _id
          //Vamos a grupar  todos los productos
          // _id: null,
          _id: "$category",
          count: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      //El tercer paso es aplica un ordenamiento
      {
        $sort: { avgPrice: -1 },
      },
    ]);

    res.json(statistics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllProducts,
  saveProduct,
  updateProduct,
  deleteProduct,
  findProductsByFilters,
  getProductsStatistics,
};
