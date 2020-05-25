import express from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@feqra/voucher-pool-common';
import { specialOfferController } from '../../controllers/special_offer';

const router = express.Router();

router.post(
  '/api/vouchers/offers',
  requireAuth,
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('discount')
      .isFloat({ gt: 0, lt: 100 })
      .withMessage('Discount must be greater than 0 and less than 100'),
  ],
  validateRequest,
  specialOfferController.create
);

export { router as specialOfferCreateRouter };
