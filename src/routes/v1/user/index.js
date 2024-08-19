import { Router } from "express";
import { authenticate, authorize } from "../../../middlewares/auth.middleware.js";
import { deleteStory, findStoriesByUserId, findStoryById, updateStory, createStory } from "../../../controllers/user/upload.controller.js";
import { upload } from "../../../config/lib/multer.js";

const router = Router();

router.use(authenticate);
router.use(authorize(["USER"]));

router.get("/", (req, res) => {
  res.json("Welcome, User!");
});

router.get("/story/:id", findStoryById);
router.get("/story/user/:id", findStoriesByUserId);
router.post("/story", upload.single("image"), createStory);
router.put("/story/:id", upload.single("image"), updateStory);
router.delete("/story/:id", deleteStory);

export default router;
