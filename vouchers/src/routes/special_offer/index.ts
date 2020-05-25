import express from 'express';
import { specialOfferController } from '../../controllers/special_offer';

const router = express.Router();

router.get('/api/vouchers/offers', specialOfferController.all);

export { router as specialOfferIndexRouter };
