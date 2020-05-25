import express from 'express';
import { customerController } from '../../controllers/customer';

const router = express.Router();

router.get('/api/vouchers/customers', customerController.all);

export { router as customerIndexRouter };
