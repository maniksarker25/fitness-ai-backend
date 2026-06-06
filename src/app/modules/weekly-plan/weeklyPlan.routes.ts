// src/modules/weeklyPlan/weeklyPlan.routes.ts

import { Router } from 'express';
import auth from '../../middlewares/auth';
import {
  generateNextWeek,
  generateWeek1,
  getAllCheckins,
  getAllWeeklyPlans,
  getCheckin,
  getWeeklyPlan,
  submitCheckin,
} from './weeklyPlan.controller';

const router = Router();

router.use(auth());

// ── Generation ────────────────────────────────────────────────────────────────
router.post('/generate/week-1', generateWeek1); // no prior context needed
router.post('/generate/next', generateNextWeek); // uses prev plan + check-in

// ── Plan reads ────────────────────────────────────────────────────────────────
router.get('/:blueprintId/all', getAllWeeklyPlans);
router.get('/:blueprintId/week/:weekNumber', getWeeklyPlan);

// ── Check-ins ─────────────────────────────────────────────────────────────────
router.post('/checkin', submitCheckin);
router.get('/:blueprintId/checkins', getAllCheckins);
router.get('/:blueprintId/checkin/:weekNumber', getCheckin);

export const WeeklyPlanRoutes = router;
