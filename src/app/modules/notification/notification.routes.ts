import express from 'express';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
import notificationController from './notification.controller';
const router = express.Router();

router.get(
  '/get-notifications',
  auth(
    USER_ROLE.bartender,
    USER_ROLE.superAdmin,
    USER_ROLE.venueOwner,
    USER_ROLE.customer,
  ),
  notificationController.getAllNotification,
);
router.patch('/see-notifications', notificationController.seeNotification);
router.patch(
  '/see-single/:id',
  auth(
    USER_ROLE.bartender,
    USER_ROLE.customer,
    USER_ROLE.venueOwner,
    USER_ROLE.superAdmin,
  ),
  notificationController.seeSingleNotification,
);
export const notificationRoutes = router;
