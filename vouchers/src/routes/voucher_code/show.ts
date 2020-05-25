import express from 'express';
import { voucherCodeController } from '../../controllers/voucher_code';

const router = express.Router();

router.get('/api/vouchers/voucher_codes/:email/:status', voucherCodeController.all);

export { router as voucherCodeShowRouter };
