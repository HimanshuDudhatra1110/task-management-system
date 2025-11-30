import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const authenticateUser = async (req, res, next) => {
  try {
    // get token from cookies
    const token = req.cookies.token;

    // check if token exists
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // decode token and add user data to the request
    const decoded = jwt.decode(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(401).json({ message: "Access denied. Token invalid." });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Verification Error:", err); // Log for debugging
    return res
      .status(401)
      .json({ message: "Invalid or expired token.", error: err.message });
  }
};
