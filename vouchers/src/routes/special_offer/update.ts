import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, requireAuth } from '@feqra/voucher-pool-common';
import { specialOfferController } from '../../controllers/special_offer';

const router = express.Router();

router.put(
  '/api/vouchers/offers/:id',
  requireAuth,
  [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('discount')
      .isFloat({ gt: 0, lt: 100 })
      .withMessage('Discount must be provided and must be greater than 0 and less than 100'),
  ],
  validateRequest,
  specialOfferController.update
);

export { router as specialOfferUpdateRouter };
