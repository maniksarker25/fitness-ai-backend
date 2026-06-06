// src/modules/weeklyPlan/weeklyPlan.controller.ts

import { Request, Response } from 'express';
import httpStatus from 'http-status';

import AppError from '../../error/appError';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import {
  generateNextWeekService,
  generateWeek1Service,
  getAllCheckinsService,
  getAllWeeklyPlansService,
  getCheckinService,
  getWeeklyPlanService,
  submitCheckinService,
} from './weeklyPlan.service';

// ─────────────────────────────────────────────────────────────────────────────
// Generation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/weekly-plans/generate/week-1
 * Body: { blueprintId: string, startDate: string (YYYY-MM-DD, Monday) }
 */
export const generateWeek1 = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId)
    throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication required');

  const { blueprintId, startDate } = req.body as {
    blueprintId?: string;
    startDate?: string;
  };

  if (!blueprintId)
    throw new AppError(httpStatus.BAD_REQUEST, 'blueprintId is required');
  if (!startDate || !startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'startDate is required in YYYY-MM-DD format',
    );
  }

  const result = await generateWeek1Service(userId, blueprintId, startDate);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Week 1 plan generated successfully',
    data: result,
  });
});

/**
 * POST /api/v1/weekly-plans/generate/next
 * Body: { blueprintId: string, weekNumber: 2|3|4, startDate: string }
 */
export const generateNextWeek = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId)
      throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication required');

    const { blueprintId, weekNumber, startDate } = req.body as {
      blueprintId?: string;
      weekNumber?: number;
      startDate?: string;
    };

    if (!blueprintId)
      throw new AppError(httpStatus.BAD_REQUEST, 'blueprintId is required');
    if (!weekNumber || ![2, 3, 4].includes(Number(weekNumber))) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'weekNumber must be 2, 3, or 4',
      );
    }
    if (!startDate || !startDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'startDate is required in YYYY-MM-DD format',
      );
    }

    const result = await generateNextWeekService(
      userId,
      blueprintId,
      Number(weekNumber),
      startDate,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: `Week ${weekNumber} plan generated successfully`,
      data: result,
    });
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Queries
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/v1/weekly-plans/:blueprintId/week/:weekNumber
 */
export const getWeeklyPlan = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId)
    throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication required');

  const week = parseInt(req.params.weekNumber, 10);
  if (isNaN(week) || week < 1 || week > 4) {
    throw new AppError(httpStatus.BAD_REQUEST, 'weekNumber must be 1–4');
  }

  const plan = await getWeeklyPlanService(req.params.blueprintId, week);
  if (!plan) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `Week ${week} plan not found for this blueprint`,
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Week ${week} plan retrieved successfully`,
    data: plan,
  });
});

/**
 * GET /api/v1/weekly-plans/:blueprintId/all
 */
export const getAllWeeklyPlans = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId)
      throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication required');

    const plans = await getAllWeeklyPlansService(req.params.blueprintId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Weekly plans retrieved successfully',
      data: plans,
    });
  },
);

// ─────────────────────────────────────────────────────────────────────────────
// Check-in
// ─────────────────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/weekly-plans/checkin
 * Body: { blueprintId, weeklyPlanId, weekNumber, currentWeight,
 *         workoutCompletionRate, mealCompletionRate, energyLevel, recoveryLevel, notes? }
 */
export const submitCheckin = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId)
    throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication required');

  const requiredFields = [
    'blueprintId',
    'weeklyPlanId',
    'weekNumber',
    'currentWeight',
    'workoutCompletionRate',
    'mealCompletionRate',
    'energyLevel',
    'recoveryLevel',
  ];

  const missing = requiredFields.filter(
    (k) => req.body[k] === undefined || req.body[k] === null,
  );
  if (missing.length) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Missing required fields: ${missing.join(', ')}`,
    );
  }

  const {
    blueprintId,
    weeklyPlanId,
    weekNumber,
    currentWeight,
    workoutCompletionRate,
    mealCompletionRate,
    energyLevel,
    recoveryLevel,
    notes,
  } = req.body;

  const checkin = await submitCheckinService({
    userId,
    blueprintId,
    weeklyPlanId,
    weekNumber: Number(weekNumber),
    currentWeight: Number(currentWeight),
    workoutCompletionRate: Number(workoutCompletionRate),
    mealCompletionRate: Number(mealCompletionRate),
    energyLevel: Number(energyLevel),
    recoveryLevel: Number(recoveryLevel),
    notes,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: `Week ${weekNumber} check-in submitted successfully`,
    data: checkin,
  });
});

/**
 * GET /api/v1/weekly-plans/:blueprintId/checkin/:weekNumber
 */
export const getCheckin = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  if (!userId)
    throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication required');

  const week = parseInt(req.params.weekNumber, 10);
  const checkin = await getCheckinService(req.params.blueprintId, week);

  if (!checkin) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `No check-in found for Week ${week}`,
    );
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Week ${week} check-in retrieved successfully`,
    data: checkin,
  });
});

/**
 * GET /api/v1/weekly-plans/:blueprintId/checkins
 */
export const getAllCheckins = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId)
      throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication required');

    const checkins = await getAllCheckinsService(req.params.blueprintId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Check-ins retrieved successfully',
      data: checkins,
    });
  },
);
