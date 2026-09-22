import { Router } from "express";
import { getAllMedia, handleUpload, handleDeleteMedia } from "../controllers/media.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = Router();

router.use(requireAuth);

router.get("/", getAllMedia);
router.post("/upload", upload.single("file"), handleUpload);
router.delete("/:id", handleDeleteMedia);

export default router;

