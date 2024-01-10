const validateToken = require("../middleware/validateTokenHandler");
import express from "express";
import { registerUser, loginUser, currentUser } from "../controllers/user";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.get("/current", validateToken, currentUser);

export default userRouter;
