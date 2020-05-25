import express from 'express';
import { body } from 'express-validator';
import { validateRequest, requireAuth } from '@feqra/voucher-pool-common';
import { voucherCodeController } from '../../controllers/voucher_code';

const router = express.Router();

router.post(
  '/api/vouchers/voucher_codes/validate',
  requireAuth,
  [
    body('code').not().isEmpty().withMessage('Code is required'),
    body('email').not().isEmpty().withMessage('Email is required')
  ],
  validateRequest,
  voucherCodeController.validate
);

export { router as voucherCodeValidateRouter };
