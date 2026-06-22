// Load environment variables from .env into process.env
// This MUST be one of the very first lines, before anything tries to use process.env 
require("dotenv").config();

// Import the Express library we installed earlier
const express  = require("express");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
// Connects to MongoDB before the app starts handling requests 
connectDB();

// Create the Express application
const app = express();

// Express can read JSON request bodies
app.use(express.json());

// Tell express to use the product routes for any URL starting with /products
app.use("/products", productRoutes);
app.use("/", authRoutes);

// Basic test route - confirms the server is Alive when u visit the homepage 
app.get("/", (req,res)=>{
    res.send("Shoppy-Globe Api is running");
});

// Port comes from .env, falls back to 5100 if not set (good practice)
const PORT = process.env.PORT || 5100;

// Start the server and listen for incoming requests
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});



