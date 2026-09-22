import { Router } from "express";
import {
  getAllDomains,
  getDomainById,
  createDomain,
  updateDomain,
  deleteDomain,
} from "../controllers/domains.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use(requireAuth);

router.get("/", getAllDomains);
router.get("/:id", getDomainById);
router.post("/", createDomain);
router.put("/:id", updateDomain);
router.delete("/:id", deleteDomain);

export default router;

