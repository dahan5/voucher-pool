import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@feqra/voucher-pool-common';
import { customerCreateRouter } from './routes/customer/new';
import { customerShowRouter } from './routes/customer/show';
import { customerIndexRouter } from './routes/customer/index';
import { customerUpdateRouter } from './routes/customer/update';
import { specialOfferCreateRouter } from './routes/special_offer/new';
import { specialOfferShowRouter } from './routes/special_offer/show';
import { specialOfferIndexRouter } from './routes/special_offer/index';
import { specialOfferUpdateRouter } from './routes/special_offer/update';
import { voucherCodeCreateRouter } from './routes/voucher_code/new';
import { voucherCodeShowRouter } from './routes/voucher_code/show';
import { voucherCodeIndexRouter } from './routes/voucher_code/index';
import { voucherCodeUpdateRouter } from './routes/voucher_code/update';
import { voucherCodeValidateRouter } from './routes/voucher_code/validate';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
);
app.use(currentUser);

app.use(customerCreateRouter);
app.use(customerShowRouter);
app.use(customerIndexRouter);
app.use(customerUpdateRouter);
app.use(specialOfferCreateRouter);
app.use(specialOfferShowRouter);
app.use(specialOfferIndexRouter);
app.use(specialOfferUpdateRouter);
app.use(voucherCodeCreateRouter);
app.use(voucherCodeShowRouter);
app.use(voucherCodeIndexRouter);
app.use(voucherCodeUpdateRouter);
app.use(voucherCodeValidateRouter);

var swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('../swagger.json');

app.use('/api/vouchers/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
