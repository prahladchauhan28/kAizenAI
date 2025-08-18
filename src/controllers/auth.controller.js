import Usermodel from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// register controller!
async function registerUser(req, res) {
  const {
    fullname: { firstname, lastname },
    email,
    password,
  } = req.body;

  const isUserExists = await Usermodel.findOne({ email });

  if (isUserExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await Usermodel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
    },
  });
}

// login controller!
async function loginUser(req, res) {

  const {email,password}=req.body;

  const user= await Usermodel.findOne({email}) ;

  if(!user)
  {
    return res.status(404).json({ message: "Invalid email or password" });
  }

  const isPasswordcheck=await bcrypt.compare(password, user.password);
  if(!isPasswordcheck)
  {
    return res.status(404).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.cookie("token", token);

  res.status(200).json({
    message: "User logged in successfully",
    user: {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
    },
  });
}

// logout controller!
function logoutUser(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
} 

export { registerUser, loginUser, logoutUser   };
