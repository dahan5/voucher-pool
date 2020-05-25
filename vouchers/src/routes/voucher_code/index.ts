import express from 'express';
import { voucherCodeController } from '../../controllers/voucher_code';

const router = express.Router();

router.get('/api/vouchers/voucher_codes', voucherCodeController.all);

export { router as voucherCodeIndexRouter };
