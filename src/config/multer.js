import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

// Configurar almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "perifericos", // Carpeta en Cloudinary
    format: async () => "jpeg", // Formato de imagen
    public_id: (req, file) => Date.now() + "-" + file.originalname, // Nombre único
  },
});

const upload = multer({ storage });

export default upload;
