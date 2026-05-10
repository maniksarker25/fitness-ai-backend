import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { normalUserValidation } from './normalUser.validation';
import { normalUserControllers } from './normalUser.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.get(
  '/',
  auth(USER_ROLE.superAdmin),
  normalUserControllers.getAllUsers
);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin),
  normalUserControllers.getSingleUser
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin),
  validateRequest(normalUserValidation.updateNormalUserValidationSchema),
  normalUserControllers.updateUser
);

router.delete(
  '/:id',
  auth(USER_ROLE.superAdmin),
  normalUserControllers.deleteUser
);

export const normalUserRoutes = router;
