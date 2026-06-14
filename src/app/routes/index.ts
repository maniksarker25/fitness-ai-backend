import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.routes';

import { ManageRoutes } from '../modules/manage-web/manage.routes';
import { notificationRoutes } from '../modules/notification/notification.routes';

import { BlueprintRoutes } from '../modules/blueprint/blueprint.routes';
import { normalUserRoutes } from '../modules/normalUser/normalUser.routes';
import { supportRoutes } from '../modules/support/support.routes';
import { userRoutes } from '../modules/user/user.routes';
import { WeeklyPlanRoutes } from '../modules/weekly-plan/weeklyPlan.routes';
import { workoutVideoRoutes } from '../modules/workout_video/workout_video.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    router: authRoutes,
  },
  {
    path: '/user',
    router: userRoutes,
  },

  {
    path: '/manage',
    router: ManageRoutes,
  },
  {
    path: '/normal-user',
    router: normalUserRoutes,
  },

  {
    path: '/support',
    router: supportRoutes,
  },
  {
    path: '/workout-video',
    router: workoutVideoRoutes,
  },
  {
    path: '/notification',
    router: notificationRoutes,
  },
  {
    path: '/blueprint',
    router: BlueprintRoutes,
  },
  {
    path:"/weekly-plan",
    router:WeeklyPlanRoutes
  }
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));

export default router;
