import mongoose from "mongoose";
import { Request, Response } from "express";
import { User } from "../../models/userModel";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Assuming you have an environment variable for JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export class AuthController {
  // User registration method
  public userRegistration = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      firstName,
      lastName,
      country,
    } = req.body;
    
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        email,
        name: `${firstName} ${lastName}`,
        country,
        password: hashedPassword,
        role: 'super moderator'
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.status(201).json({ msg: "User registered successfully", token });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  };
  // User login method
  public userLogin = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }
      if (user.password) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ msg: "Invalid Credentials" });
        }
      } else {
        return res.status(400).json({ msg: "Invalid Credentials" });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.json({ msg: "User logged in successfully", token ,user });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  };
}
