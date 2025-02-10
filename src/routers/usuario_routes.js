import verificarAutenticacion from "../middlewares/autenticacion.js";
import { Router } from 'express';
import { 
    registrarUsuario, 
    loginUsuario, 
    listarUsuarios, 
    actualizarUsuario, 
    detalleUsuario, 
    eliminarUsuario, 
    perfilUsuario, 
    recuperarPassword, 
    comprobarTokenPassword, 
    nuevoPassword, 
    actualizarPassword,
    confirmarUsuario 
} from "../controllers/usuario_controller.js";

const router = Router();

// 🔹 Rutas públicas
router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.get("/confirmar/:token", confirmarUsuario);

// Rutas para recuperación de contraseña y confirmación de correo
router.post("/recuperar-password", recuperarPassword);
router.get("/recuperar-password/:token", comprobarTokenPassword);
router.post("/nuevo-password/:token", nuevoPassword);

// 🔹 Rutas protegidas (requieren autenticación)
router.get("/perfil/:id", verificarAutenticacion, perfilUsuario);
router.put("/actualizar/:id", verificarAutenticacion, actualizarUsuario);
router.put("/actualizar-password", verificarAutenticacion, actualizarPassword);
router.delete("/eliminar/:id", verificarAutenticacion, eliminarUsuario);

// 🔹 Rutas protegidas para administradores
router.get("/", verificarAutenticacion, listarUsuarios);

export default router;
