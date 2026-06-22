const mongoose = require("mongoose");
const bcrypt =  require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required: [true, "Name is required"],
            trim: true
        },
        email: {
            type: String,
            required:[true, "Email is required"],
            unique: true, // no two users can register with the same email
            lowercase: true, // normalize "John@Test.com" and "john@test.com" as the same
            trim:true,
        },
        password:{
            type: String,
            required:[true, "Password is required"],
            minlength:  [6, "Password must be atleast 6 characters"],
        },
    },
    {
        timestamps:true,
    }
);

// This is a "pre-save hook" — mongoose automatically runs this function
// right before any User document is saved to the database.
  userSchema.pre("save", async function () {
  // Only hash the password if it's new or has been changed —
  // otherwise, every time we save a user for ANY reason, we'd
  // accidentally hash an already-hashed password (breaking login).
  if(!this.isModified("password")){
    return;
  }

  // Generate a salt and hash the plain-text password with it 
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// A custom method we can call on any user document later,
// e.g. user.comparePassword("whatTheyTyped")

userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

