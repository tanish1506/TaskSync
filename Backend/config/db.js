const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        console.log("Attempting connection with:", process.env.MONGO_URL);
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`\x1b[36m%s\x1b[0m`, `MongoDb Connected : ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error : ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;