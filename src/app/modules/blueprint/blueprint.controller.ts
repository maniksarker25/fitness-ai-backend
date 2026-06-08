// src/modules/blueprint/blueprint.controller.ts

import { Request, Response } from 'express';
import httpStatus from 'http-status';

import AppError from '../../error/appError';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import { NormalUser } from '../normalUser/normalUser.model';
import {
  generateBlueprintService,
  getBlueprintHistoryService,
  getLatestBlueprintService,
} from './blueprint.service';

/**
 * POST /api/v1/blueprints/generate
 *
 * Generates a new 30-day blueprint for the authenticated user.
 * Fetches the user profile from MongoDB, runs the RAG + LLM pipeline,
 * persists the result, and returns it.
 */
export const generateBlueprint = catchAsync(async (req, res) => {
  const userId = req.user?.id; 

  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication required');
  }

  const user = await NormalUser.findOne({ user:userId }).lean();

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User profile not found. Please complete your profile before generating a blueprint.',
    );
  }

  const result = await generateBlueprintService(user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blueprint generated successfully',
    data: result,
  });
});

/**
 * GET /api/v1/blueprints/latest
 *
 * Returns the most recently generated blueprint for the authenticated user.
 */
export const getLatestBlueprint = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication required');
    }

    const blueprint = await getLatestBlueprintService(userId);

    if (!blueprint) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'No blueprint found. Generate your first blueprint to get started.',
      );
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blueprint retrieved successfully',
      data: blueprint,
    });
  },
);

/**
 * GET /api/v1/blueprints/history
 *
 * Returns all blueprints for the authenticated user, newest first.
 */
export const getBlueprintHistory = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Authentication required');
    }

    const blueprints = await getBlueprintHistoryService(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blueprint history retrieved successfully',
      data: blueprints,
    });
  },
);
