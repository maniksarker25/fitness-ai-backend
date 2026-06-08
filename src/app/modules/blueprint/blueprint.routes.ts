// src/modules/blueprint/blueprint.routes.ts

import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import {
  generateBlueprint,
  getBlueprintHistory,
  getLatestBlueprint,
} from './blueprint.controller';

const router = Router();

// All routes require a logged-in user

/**
 * POST   /api/v1/blueprints/generate   → generate a new blueprint
 * GET    /api/v1/blueprints/latest     → fetch most recent blueprint
 * GET    /api/v1/blueprints/history    → fetch all blueprints
 */
router.post('/generate',auth(USER_ROLE.user), generateBlueprint);
router.get('/latest', getLatestBlueprint);
router.get('/history', getBlueprintHistory);

export const BlueprintRoutes = router;
