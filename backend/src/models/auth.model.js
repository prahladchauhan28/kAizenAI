import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullname:{
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    }
  },
  password: { 
    type: String, 
    required: true
 },
},{
    timestamps: true,
});

const Usermodel = mongoose.model("User", userSchema);

export default Usermodel;
