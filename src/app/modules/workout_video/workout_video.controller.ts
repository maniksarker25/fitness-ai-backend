import httpStatus from 'http-status';
import catchAsync from '../../utilities/catchasync';
import sendResponse from '../../utilities/sendResponse';
import { workoutVideoServices } from './workout_video.service';

const createWorkoutVideo = catchAsync(async (req, res) => {
  const result = await workoutVideoServices.createWorkoutVideo(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Workout video created successfully',
    data: result,
  });
});

const getAllWorkoutVideos = catchAsync(async (req, res) => {
  const result = await workoutVideoServices.getAllWorkoutVideos(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Workout videos retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleWorkoutVideo = catchAsync(async (req, res) => {
  const result = await workoutVideoServices.getSingleWorkoutVideo(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Workout video retrieved successfully',
    data: result,
  });
});

const updateWorkoutVideo = catchAsync(async (req, res) => {
  const result = await workoutVideoServices.updateWorkoutVideo(
    req.params.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Workout video updated successfully',
    data: result,
  });
});

const deleteWorkoutVideo = catchAsync(async (req, res) => {
  const result = await workoutVideoServices.deleteWorkoutVideo(req.params.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Workout video deleted successfully',
    data: result,
  });
});

export const workoutVideoControllers = {
  createWorkoutVideo,
  getAllWorkoutVideos,
  getSingleWorkoutVideo,
  updateWorkoutVideo,
  deleteWorkoutVideo,
};
