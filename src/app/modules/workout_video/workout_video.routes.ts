import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from '../user/user.constant';
import { workoutVideoControllers } from './workout_video.controller';
import { workoutVideoValidation } from './workout_video.validation';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.superAdmin),
  validateRequest(workoutVideoValidation.createWorkoutVideoValidationSchema),
  workoutVideoControllers.createWorkoutVideo,
);

router.get('/', workoutVideoControllers.getAllWorkoutVideos);

router.get('/:id', workoutVideoControllers.getSingleWorkoutVideo);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin),
  validateRequest(workoutVideoValidation.updateWorkoutVideoValidationSchema),
  workoutVideoControllers.updateWorkoutVideo,
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin),
  workoutVideoControllers.deleteWorkoutVideo,
);

export const workoutVideoRoutes = router;
