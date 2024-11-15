import { User } from "../models/user.model.js";
import sendEmail from "../utils/email.js";
const saveUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const users = await User.find({ deletedAt: null });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendWelcomeEmail = async (req, res) => {
  try {
    // Obtener el correo, asunto y mensaje desde el cuerpo de la solicitud
    const { email, subject, message } = req.body;
    // Enviar el correo electrónico
    await sendEmail({ email, subject, message });
    res.json({ message: "Correo de bienvenida enviado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      deletedAt: new Date(),
    });
    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { saveUser, getUser, sendWelcomeEmail, deleteUser };
