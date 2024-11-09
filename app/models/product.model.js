//1. Definir el schema (definiciones de los atributos de documentos, los tipos de datos y validaciones)
//2. Crear el modelo (clase) del producto
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A product must have a title"],
    unique: true, //un producto no puede tener dos titulos iguales
  },
  description: {
    type: String,
    minlength: [5, "A product description must have at least 5 characters"],
    maxlength: [100, "A product description must have at most 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "A product must have a price"],
    min: [0, "A product price must be greater than or equal to 0"],
    max: [10000, "A product price must be less than or equal to 10000"],
  },
  category: {
    type: String,
    required: [true, "A product must have a category"],
  },
});

//Modelo (representacion de la coleccion), este vamos a utilizar para interactuar con la base de datos
export const Product = mongoose.model("products", productSchema);
