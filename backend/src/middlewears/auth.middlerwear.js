import Usermodel from "../models/auth.model.js";
import jwt from "jsonwebtoken";

async function authMiddleware(req, res, next) {
    const { token } = req.cookies;

    if(!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    const user = await Usermodel.findById(req.userId);
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;
