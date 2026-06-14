// src/modules/weeklyPlan/weeklyPlan.routes.ts

import { Router } from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import {
  generateNextWeek,
  generateWeek1,
  getAllCheckins,
  getAllWeeklyPlans,
  getCheckin,
  getWeeklyPlan,
  submitCheckin,
  getTodayActivity,
} from './weeklyPlan.controller';

const router = Router();


// ── Generation ────────────────────────────────────────────────────────────────
router.post('/generate/week-1',auth(USER_ROLE.user), generateWeek1); // no prior context needed
router.post('/generate/next', generateNextWeek); // uses prev plan + check-in

// ── Plan reads ────────────────────────────────────────────────────────────────
router.get('/today', auth(USER_ROLE.user), getTodayActivity);
router.get('/:blueprintId/all', getAllWeeklyPlans);
router.get('/:blueprintId/week/:weekNumber', getWeeklyPlan);

// ── Check-ins ─────────────────────────────────────────────────────────────────
router.post('/checkin', submitCheckin);
router.get('/:blueprintId/checkins', getAllCheckins);
router.get('/:blueprintId/checkin/:weekNumber', getCheckin);

export const WeeklyPlanRoutes = router;
