import express from 'express';
import PaymentController from './payment.controller';

const router = express.Router();

router.post('/make-withdraw', PaymentController.makeWithDraw);

export const paymentRoutes = router;
