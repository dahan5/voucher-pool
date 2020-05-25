import express from 'express';
import { body, sanitize, check } from 'express-validator';
import { requireAuth, validateRequest } from '@feqra/voucher-pool-common';
import { voucherCodeController } from '../../controllers/voucher_code';
import moment from 'moment';

const router = express.Router();

router.post(
  '/api/vouchers/voucher_codes',
  requireAuth,
  [
    body('expiresAt').not().isEmpty().withMessage('Expiration date is required'),
    body('offerId').not().isEmpty().withMessage('Offer is required'),
    body('customerId').not().isEmpty().withMessage('Customer is required'),
    check('expiresAt').toDate().custom((expiresAt, { req }) => {
      if (moment().isAfter(expiresAt)) {
        throw new Error('Expiration date should be after today');
      }
      return true;
    })
  ],
  validateRequest,
  voucherCodeController.create
);

export { router as voucherCodeCreateRouter };
