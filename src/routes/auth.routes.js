import express from "express"; 
import { registerUser,loginUser,logoutUser } from "../controllers/auth.controller.js"; 

const router = express.Router();


// register api!
router.post("/register", registerUser);
// login api!
router.post("/login", loginUser);

// logout api!
router.get("/logout", logoutUser);


export default router;