const jwt = require ("jsonwebtoken");
const User = require ("../models/User");

// Small helper function — generates a signed JWT containing the user's ID.
// We'll call this after both successful registration AND login.
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, // the "payload" — data we embed inside the token
    process.env.JWT_SECRET, // a secret key only our server knows, used to sign/verify
    { expiresIn: "1d" } // token becomes invalid after 1 day
  );
};

// @ route POST / register
// @desc Create a new user account 

const registerUser = async(req,res) =>{
    try{
        const{name,email,password} = req.body ;

        // Check if a user with this email already exists 
        const existingUser = await User.findOne({email});
        if (existingUser){
            return res.status(400).json({
                success: false,
                message: "A user with this email already exists",
            });
        }
        // Create the user- password gets hashed automatically 
        // by the pre("save") hook we wrote in User.js

        const user = await User.create({name,email,password});
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data:{id: user._id, name: user.name, email: user.email},
            token,
        });
    } catch(error){
        res.status(400).json({
            success: false,
            message:"Registration Failed",
            error: error.message,
        });
    }
};

// @route POST/login
// @desc  Authenticate an existing user and return a JWT

const loginUser = async (req,res) =>{
    try{
        const{email,password} = req.body;

        const user = await User.findOne({email});
        if(!user){
        // Deliberately vague message — don't reveal whether the
        // email exists or not, for security reasons
        return res.status(401).json({
            success: false,
            message: "Invalid email or password",
        });
        }
        // checks the typed password against the stored hash before issuing a token
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }
        const token = generateToken(user._id);

        res.status(200).json({
            success:true,
            message:"Login successful",
            data:{id:user._id, name: user.name, email:user.email},
            token,
        });
    } catch(error){
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};

module.exports = {registerUser, loginUser};
