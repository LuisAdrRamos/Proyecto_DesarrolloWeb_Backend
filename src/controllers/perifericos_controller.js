import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Periferico from "../models/Perifericos.js";
import fs from "fs"; // Para eliminar archivos temporales

// Método para listar todos los periféricos
const listarPerifericos = async (req, res) => {
    try {
        const perifericos = await Periferico.find({}).select("-createdAt -updatedAt -__v");
        res.status(200).json(perifericos);
    } catch (error) {
        console.log("Error al listar los periféricos:", error);
        res.status(500).json({ msg: "Error al listar los periféricos", error });
    }
};

// Método para obtener el detalle de un periférico
const detallePeriferico = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ msg: `Lo sentimos, no existe ese periférico` });

    const periferico = await Periferico.findById(id);
    if (!periferico) return res.status(404).json({ msg: "Periférico no encontrado" });

    res.status(200).json(periferico);
};

// Método para registrar un periférico
const registrarPeriferico = async (req, res) => {
    try {
        const { nombre, categoria, precio, calidad, especificaciones, descripcion, switchs, marca } = req.body;

        if (!nombre || !categoria || !precio || !calidad || !descripcion || !switchs || !marca) {
            return res.status(400).json({ msg: "Todos los campos son necesarios" });
        }

        // Obtener URL de la imagen subida a Cloudinary
        let imagenUrl = req.file ? req.file.path : "";

        // Crear el nuevo periférico con la URL de Cloudinary
        const periferico = new Periferico({
            nombre,
            categoria,
            precio,
            calidad,
            especificaciones,
            descripcion,
            switchs,
            marca,
            imagen: imagenUrl, // 🔹 Guardamos la URL de Cloudinary
        });

        await periferico.save();
        res.status(201).json({ msg: `Registro exitoso del periférico ${periferico._id}`, periferico });
    } catch (error) {
        console.error("Error al registrar el periférico:", error);
        res.status(500).json({ msg: "Error al registrar el periférico", error });
    }
};


// Método para actualizar un periférico
const actualizarPeriferico = async (req, res) => {
    const { id } = req.params;
    const { nombre, categoria, precio, calidad, especificaciones, descripcion, switchs, marca, imagen } = req.body;

    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el periférico ${id}` });
    }

    try {
        let imagenUrl = imagen; // Mantener la imagen anterior si no se sube una nueva

        // 🔹 Subir nueva imagen si el usuario selecciona una nueva
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "perifericos",
                use_filename: true,
                unique_filename: false,
            });

            imagenUrl = result.secure_url;
            fs.unlinkSync(req.file.path); // Eliminar archivo temporal
        }

        const perifericoActualizado = await Periferico.findByIdAndUpdate(id, {
            nombre,
            categoria,
            precio,
            calidad,
            especificaciones,
            descripcion,
            switchs,
            marca,
            imagen: imagenUrl, // 🔹 Guardamos la URL de la nueva imagen
        }, { new: true });

        if (!perifericoActualizado) {
            return res.status(404).json({ msg: "Periférico no encontrado" });
        }

        res.status(200).json({ msg: "✅ Periférico actualizado con éxito", periferico: perifericoActualizado });
    } catch (error) {
        console.error("❌ Error al actualizar el periférico:", error);
        res.status(400).json({ msg: "Error al actualizar el periférico", error });
    }
};


// Método para eliminar un periférico
const eliminarPeriferico = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(404).json({ msg: `Lo sentimos, no existe el periférico ${id}` });

    const perifericoEliminado = await Periferico.findByIdAndDelete(id);
    if (!perifericoEliminado)
        return res.status(404).json({ msg: "Periférico no encontrado" });

    res.status(200).json({ msg: "Periférico eliminado exitosamente" });
};

// Exportar los controladores
export {
    detallePeriferico,
    registrarPeriferico,
    actualizarPeriferico,
    eliminarPeriferico,
    listarPerifericos
};