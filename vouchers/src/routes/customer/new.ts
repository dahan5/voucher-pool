import express from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@feqra/voucher-pool-common';
import { customerController } from '../../controllers/customer';

const router = express.Router();

router.post(
  '/api/vouchers/customers',
  requireAuth,
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Email must be valid')
  ],
  validateRequest,
  customerController.create
);

export { router as customerCreateRouter };
