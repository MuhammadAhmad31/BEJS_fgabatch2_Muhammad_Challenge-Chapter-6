import { Router } from "express";
import admin from "./admin/index.js";
import login from "./auth/index.js";
import user from "./user/index.js";
const router = Router();

router.use("/", login);
router.use("/admin", admin);
router.use("/user", user);

export default router;
