// Import mongoose - the library that lets us talk to Mongo DB easily
const mongoose = require("mongoose");

// This function connects our app to the MongoDB database
const connectDB = async ()=>{
    try{
        // mongoose.connect() takes the connection string from our .env file and establishes the connection
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch(error){
        // If connection fails, log the error and stop the app
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
