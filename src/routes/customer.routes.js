import { Router } from "express";
import {  registerUser,loginUser, logoutUser } from "../controllers/customer.controllers.js";
import { verifyJWT } from "../middlewares/VerifyJWT.js";

const router = Router()

router.route("/register").post(registerUser)
router.route('/login').post(loginUser)

// secure routes
router.route("/logout").post(verifyJWT,logoutUser)

export default router