// src/modules/blueprint/blueprint.routes.ts

import { Router } from 'express';
import auth from '../../middlewares/auth';
import {
  generateBlueprint,
  getBlueprintHistory,
  getLatestBlueprint,
} from './blueprint.controller';

const router = Router();

// All routes require a logged-in user
router.use(auth());

/**
 * POST   /api/v1/blueprints/generate   → generate a new blueprint
 * GET    /api/v1/blueprints/latest     → fetch most recent blueprint
 * GET    /api/v1/blueprints/history    → fetch all blueprints
 */
router.post('/generate', generateBlueprint);
router.get('/latest', getLatestBlueprint);
router.get('/history', getBlueprintHistory);

export const BlueprintRoutes = router;
