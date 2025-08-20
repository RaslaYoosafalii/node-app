

const mongoose = require('mongoose')// imported mongoose

const connectDB = async () =>{
    try{
        const conn = await mongoose.connect('mongodb://localhost:27017/userAuth', {})// connect to mongodb that run on local system 
        console.log('mongodb connected ')
      }catch(error){
      console.error(error);
      process.exit(1);
      }
}

module.exports = connectDB;