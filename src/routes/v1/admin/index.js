import { Router } from "express";
import { authenticate, authorize } from "../../../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticate);
router.use(authorize(["ADMIN"]));

router.get("/", (req, res) => {
  res.json("Welcome, Admin!");
});

export default router;
