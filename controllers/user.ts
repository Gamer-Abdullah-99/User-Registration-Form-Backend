import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user";
import dotenv from "dotenv";

dotenv.config();

const accessTokenValue = process.env.ACCESS_TOKEN_SECRET;

//@desc Register User
//@route POST /users/register
//@access public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  //Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);
  console.log("Hashed Password", hashedPassword);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });
  console.log("User created", user);

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "Register the user" });
});

//@desc Login User
//@route POST /users/login
//@access public
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ email });
  //compare password
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: { username: user.username, email: user.email, id: user.id },
      },
      accessTokenValue,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or password is not valid");
  }
});

//@desc Current User
//@route GET /users/current
//@access private
const currentUser = asyncHandler(async (req: Request, res: Response) => {
  res.json(req.user);
});

export { registerUser, loginUser, currentUser };
