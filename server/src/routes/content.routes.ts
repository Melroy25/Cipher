import { Router } from "express";
import {
  getAllContent,
  updateContentItem,
  bulkUpdateContent,
} from "../controllers/content.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", getAllContent);
router.post("/", updateContentItem);
router.post("/bulk", bulkUpdateContent);

export default router;

