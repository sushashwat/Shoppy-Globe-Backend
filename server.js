// Import the Express library we installed earlier
const express  = require("express");

// Create the Express application
const app = express();

// Basic test route - confirms the server is Alive when u visit the homepage 
app.get("/", (req,res)=>{
    res.send("Shoppy-Globe Api is running");
});

// Port the server will listen on
const PORT = 5000;

// Start the server and listen for incoming requests
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});



