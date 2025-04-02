const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', 'environment', '.env') });  // Cargar variables de entorno desde .env

// Agregar logs para ver si las variables de entorno están correctas
// console.log('MONGO_URI:', process.env.MONGO_URI);  // Verifica si se carga correctamente la URI
// console.log('MONGO_DB:', process.env.MONGO_DB);    // Verifica si se carga correctamente el nombre de la base de datos

// Usar la URI de MongoDB Atlas directamente
const mongoUri = process.env.MONGO_ATLAS_URI || 'mongodb+srv://a23edstorcev:Alegre2018@cluster0.grsuc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = process.env.MONGO_DB || 'tr3_mongo_db';  // Nombre de la base de datos

// Conectar a MongoDB usando Mongoose
const connectDB = async () => {
    try {
        console.log(`Conectando a MongoDB Atlas...`);
        
        // Para MongoDB Atlas, no necesitamos concatenar la base de datos a la URI
        // ya que la base de datos se especifica en la URI o se puede especificar en las opciones
        await mongoose.connect(mongoUri, {
            dbName: dbName, // Especificar el nombre de la base de datos
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log(`Conexión exitosa a MongoDB Atlas - Base de datos: ${dbName}`);
    } catch (error) {
        console.error('Error al conectar a MongoDB Atlas:', error);
        process.exit(1);  // Terminar el proceso si hay error
    }
};

connectDB();

module.exports = connectDB;
