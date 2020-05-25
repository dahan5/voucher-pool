import express from 'express';
import { customerController } from '../../controllers/customer';

const router = express.Router();

router.get('/api/vouchers/customers/:email', customerController.find);

export { router as customerShowRouter };
