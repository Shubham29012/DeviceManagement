const mongoose=require('mongoose');
const logger = require('./logger');
const connectDatabase=async() => {
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI);
        logger.info(`MONGO DB CONNECTED: ${conn.connection.host}`);
    }
    catch(error){
        logger.info('Database connection failed',error);
        process.exit(1);
    }
}
module.exports={connectDatabase}