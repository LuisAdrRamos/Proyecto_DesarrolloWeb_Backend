import mongoose, { Schema, model } from 'mongoose';

const perifericosSchema = new Schema({
    nombre: {
        type: String,
        required: true, // Corregido "require" a "required"
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    switchs: {
        type: String,
        required: true,
        trim: true
    },
    calidad: {
        type: String,
        required: true,
        enum: ['Baja', 'Media', 'Alta']
    },
    categoria: {
        type: String,
        enum: ['Oficina', 'Mecanico', 'Custom'],
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    especificaciones: {
        type: String,
        required: true
    },
    marca: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: false
    }

}, {
    timestamps: true
});

perifericosSchema.methods.comparar = function (otroPeriferico) {
    const comparaciones = {};

    // Comparar calidad
    comparaciones.calidad = this.calidad === otroPeriferico.calidad;

    // Comparar precio
    comparaciones.precio = this.precio === otroPeriferico.precio;

    // Comparar categoría
    comparaciones.categoria = this.categoria === otroPeriferico.categoria;

    // Comparar especificaciones
    comparaciones.especificaciones = {};
    this.especificaciones.forEach((value, key) => {
        comparaciones.especificaciones[key] = value === otroPeriferico.especificaciones.get(key);
    });

    comparaciones.marca = this.marca === otroPeriferico.marca;

    return comparaciones;
};

export default model('Perifericos', perifericosSchema);