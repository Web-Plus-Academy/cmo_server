import jwt from "jsonwebtoken";
import AdminSchema from "../models/adminLoginModel.js";

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid Admin" });
    }

    const admin = await AdminSchema.findById(decoded.adminId).select("-password");

    if (!admin) {
      return res.status(404).json({ error: "Admin not Found" });
    }

    // req.admin = admin;

    next();
  } catch (error) {
    console.log("Error in protectedRoute middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default protectRoute;
