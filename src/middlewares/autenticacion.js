import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario.js';
import Admin from '../models/Admin.js';

// Método para proteger rutas
const verificarAutenticacion = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({ msg: "Lo sentimos, debes proporcionar un token" });
    }

    const { authorization } = req.headers;

    try {
        const decodedToken = jwt.verify(authorization.split(' ')[1], process.env.JWT_SECRET);
        console.log("🔍 Token decodificado:", decodedToken);  // 🔴 Agregar log

        const { id, rol } = decodedToken;

        if (rol === "usuario") {
            req.usuarioBDD = await Usuario.findById(id).lean().select("-password");
            if (!req.usuarioBDD) {
                return res.status(404).json({ msg: "Usuario no encontrado" });
            }
            console.log("✅ Usuario encontrado en DB:", req.usuarioBDD._id);  // 🔴 Log para verificar el ID recuperado
        } else {
            req.adminBDD = await Admin.findById(id).lean().select("-password");
            if (!req.adminBDD) {
                return res.status(404).json({ msg: "Administrador no encontrado" });
            }
            console.log("✅ Admin encontrado en DB:", req.adminBDD._id);
        }

        next();
    } catch (error) {
        return res.status(401).json({ msg: "Formato del token no válido" });
    }
};


export default verificarAutenticacion;
