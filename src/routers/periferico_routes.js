import { Router } from 'express';
import upload from "../config/multer.js"; // Configuración de multer para subir imágenes
const router = Router();

import {
    detallePeriferico,
    registrarPeriferico,
    actualizarPeriferico,
    eliminarPeriferico,
    listarPerifericos

} from "../controllers/perifericos_controller.js";

import verificarAutenticacion from "../middlewares/autenticacion.js";

// Ruta para registrar un periférico
router.post("/registro", verificarAutenticacion, upload.single("imagen"), registrarPeriferico);

// Ruta para listar todos periféricos
router.get("/listar", listarPerifericos);

// Ruta para ver el detalle de un periférico
router.get("/detalle/:id", detallePeriferico);

// Ruta para actualizar un periférico (ahora con multer)
router.put("/actualizar/:id", verificarAutenticacion, upload.single("imagen"), actualizarPeriferico);

// Ruta para eliminar un periférico
router.delete("/eliminar/:id", verificarAutenticacion, eliminarPeriferico);

export default router;
