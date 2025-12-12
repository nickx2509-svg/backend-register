import { Router } from "express";
import { registerUser } from "../controllers/customer.controllers.js";

const router = Router()

router.route("/api/v1/customers").post(registerUser)

export default router