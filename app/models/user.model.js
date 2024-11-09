import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { type } from "os";

const userShema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["admin", "user"], //Este atributo solo puede tomar estos valores
    default: "user",
  },
  resetPasswordToken: String, //Para poder generar un identificador unico que vamos a enviar al usuario (correo)
  resetPasswordExpires: Date, //Para poder definir la fecha de expiracion del token
  //Va a tener un valor cuando yo decida borrar el usuario. borrado logico
  deletedAt: {
    type: Date,
    default: null,
  },
});

//Vamos a aplicar un pre book (proceso que se va a ejecutar antes de guardarse el usuario en la base de datos BDD)
//El primer parametro de nuestro pre hook, es la operacion a la cual  vamos a aplicar el hook
userShema.pre("save", async function (next) {
  const user = this; //this -> es el objeto que estamos guardando en la base de datos

  //Solo si se esta modificando el atributo password vamos a proceder a hashear la contrasena
  if (user.isModified("password")) {
    try {
      //Primer paso para hashear la contrasena, es generar un salt (va a ser generado de manera randomica)
      const salt = await bcrypt.genSalt(10);

      //segundo paso, es hashear la contrasena
      //1234 -> %$&&&^%$78965423
      const hash = await bcrypt.hash(user.password, salt);

      //tercer paso, es asignar la contrasena hasheada al atributo password
      user.password = hash;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

//Vamos a crear un hook que se encargue de eliminar la contrasena del objeto que se va a devolver al cliente
userShema.post("find", function (docs, next) {
  //docs es un arreglo de objetos que se han devuelto de la base de datos
  docs.forEach((doc) => {
    doc.password = undefined; //le quitamos la contrasena del objeto
  });

  next();
});

//Vamos a extender la funcionalidad de nuestro schema, de manera que tenga un metodo
//que nos permita comparar la contrasena que el usuario esta enviado con la contrasena hasheada en la base de datos
//Recibe como parametro el password que envia el cliente para autenticarse
userShema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//Vamos a agregar un metodo a nuestro schema que nos permita generar un token de reseteo de contrasena
userShema.methods.generateResetToken = function () {
  //Generamos la cadena randomica en formato hexadecimal (formato que se usa para representar cualquier cadena en nuestro computador)
  const resetTolken = crypto.randomBytes(20).toString("hex");

  //Vamos a guardar el token hasheado, para que sea seguro
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetTolken)
    .digest("hex");

  //Vamos a definir la fecha de expiracion del token
  this.resetPasswordExpires = Date.now() + 3600000; //1 hora

  return resetTolken;
};
export const User = mongoose.model("users", userShema);
