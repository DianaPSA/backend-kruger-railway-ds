//En este archivo unicamente vamos a tener la conexion hacia nuestra base de datos

import mongoose from "mongoose";

//Funcion que se va a encargar de hacer la conexion hacia nuestra base de datos
export const connectDB = async () => {
  try {
    //despues de .net/ agrega el nombre de la base de datos products para que se cree
    await mongoose.connect(
      "mongodb+srv://dianas:admin1234@krugerbackendds.hhwef.mongodb.net/products?retryWrites=true&w=majority&appName=KrugerBackendDS"
    );
    console.log("Conectado a la base de datos");
  } catch (error) {
    console.error("Error al conectar con la base de datos", error);
  }
};
