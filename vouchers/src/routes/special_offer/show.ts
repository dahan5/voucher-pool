import express from 'express';
import { specialOfferController } from '../../controllers/special_offer';

const router = express.Router();

router.get('/api/vouchers/offers/:id', specialOfferController.find);

export { router as specialOfferShowRouter };
