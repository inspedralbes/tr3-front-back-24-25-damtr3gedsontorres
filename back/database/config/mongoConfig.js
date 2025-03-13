const mongoose = require('mongoose');
const path = require('path');
// require('dotenv').config({ path: path.join(__dirname, '..', '..', 'environment', '.env') });  // Cargar variables de entorno desde .env
// // Agregar logs para ver si las variables de entorno están correctas
// console.log('MONGO_URI:', process.env.MONGO_URI);  // Verifica si se carga correctamente la URI
// console.log('MONGO_DB:', process.env.MONGO_DB);    // Verifica si se carga correctamente el nombre de la base de datos

// const mongoUri = process.env.MONGO_URI;  // URI base de MongoDB
// const dbName = process.env.MONGO_DB;  // Nombre de la base de datos

// Conectar a MongoDB usando Mongoose
// const connectDB = async () => {
//     try {
//         console.log(`Conectando a la base de datos: ${mongoUri}/${dbName}`);
//         await mongoose.connect(`${mongoUri}/${dbName}`, {  // Concatenamos la URI y el nombre de la DB
//         });
//         console.log(`Conexión exitosa a la base de datos: ${dbName}`);
//     } catch (error) {
//         console.error('Error al conectar a MongoDB:', error);
//         process.exit(1);  // Terminar el proceso si hay error
//     }
// };

const mongoUri = 'mongodb://root:example@mongodb:27017'; // Usuario, contraseña, host y DB


const connectDB = async () => {
    try {
        console.log(`Conectando a la base de datos: ${mongoUri}`);
        await mongoose.connect(mongoUri, {
        });
        console.log(`Conexión exitosa a la base de datos`);
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);  // Terminar el proceso si hay error
    }
};
connectDB();

module.exports = connectDB;
