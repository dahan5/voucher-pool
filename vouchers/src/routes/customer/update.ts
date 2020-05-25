import express from 'express';
import { body } from 'express-validator';
import { validateRequest, requireAuth } from '@feqra/voucher-pool-common';
import { customerController } from '../../controllers/customer';

const router = express.Router();

router.put(
  '/api/vouchers/customers/:email',
  requireAuth,
  [
    body('name').not().isEmpty().withMessage('Name is required')
  ],
  validateRequest,
  customerController.update
);

export { router as customerUpdateRouter };
