import app from "./server.js";
import connection from "./database.js";

const port = process.env.PORT || 3000;

// Conectar a la base de datos antes de iniciar el servidor
connection().then(() => {
  app.listen(port, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${port}`);
  });
});
