import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../../models/userModel"; // Adjust the import path as necessary

// This assumes you have an environment variable for your secret key
const SECRET_KEY = process.env.JWT_SECRET_KEY || "your_jwt_secret";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expecting "Bearer [token]"

  if (!token) {
    return res.status(401).json({ message: "Authorization token is required" });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;

    // Extract user ID or other identifying information from token
    const userId = decoded.userId; // Adjust according to how your token is structured

    if (!userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Fetch the user details from your database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the user to the request object
    req.user = user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
