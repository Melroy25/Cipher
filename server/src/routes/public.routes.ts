import { Router } from "express";
import {
  getPublicMembers,
  getPublicProjects,
  getPublicEvents,
  getPublicActivities,
  getPublicDomains,
  getPublicContent,
  getPublicInitialData,
} from "../controllers/public.controller.js";

const router = Router();

router.get("/initial", getPublicInitialData);
router.get("/members", getPublicMembers);
router.get("/projects", getPublicProjects);
router.get("/events", getPublicEvents);
router.get("/activities", getPublicActivities);
router.get("/domains", getPublicDomains);
router.get("/content", getPublicContent);

export default router;

