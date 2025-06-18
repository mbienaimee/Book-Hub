import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User, { IUser } from "../models/User";

const router = express.Router();
const SECRET = process.env.JWT_SECRET || "your-secret-key";

router.post("/signup", async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password || role !== "admin") {
    return res.status(400).json({ error: "Invalid data" });
  }
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user: IUser = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, SECRET, {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: { id: user._id, username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
