import request from 'supertest';
import { app } from '../../app';
import { Customer } from '../../models/customer';
import { SpecialOffer } from '../../models/special_offer';
import { VoucherCode } from '../../models/voucher_code';

it('has a route handler listening to /api/vouchers/voucher_codes for post requests', async () => {
  const response = await request(app).post('/api/vouchers/voucher_codes').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  await request(app).post('/api/vouchers/voucher_codes').send({}).expect(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/vouchers/voucher_codes')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid expiry date is provided', async () => {
  await request(app)
    .post('/api/vouchers/voucher_codes')
    .set('Cookie', global.signin())
    .send({
      expiresAt: '2000-01-01',
      offerId: '5ecb6b1724cf95001a40171e',
      customerId: '5ecb6b1724cf95001a40171d'
    })
    .expect(400);

  await request(app)
    .post('/api/vouchers/voucher_codes')
    .set('Cookie', global.signin())
    .send({
      offerId: '5ecb6b1724cf95001a40171e',
      customerId: '5ecb6b1724cf95001a40171d'
    })
    .expect(400);
});

it('returns an error if an invalid discount is provided', async () => {
  await request(app)
    .post('/api/vouchers/offers')
    .set('Cookie', global.signin())
    .send({
      name: 'Correct Name',
      discount: -10
    })
    .expect(400);

  await request(app)
    .post('/api/vouchers/offers')
    .set('Cookie', global.signin())
    .send({
      name: 'Correct Name'
    })
    .expect(400);
});

it('creates a voucher with valid inputs', async () => {
  let customers = await Customer.find({});
  expect(customers.length).toEqual(0);
  let offers = await SpecialOffer.find({});
  expect(offers.length).toEqual(0);
  let vouchers = await VoucherCode.find({});
  expect(vouchers.length).toEqual(0);

  await request(app)
    .post('/api/vouchers/customers')
    .set('Cookie', global.signin())
    .send({
      name: 'Taleb DAHAN New',
      email: 'taleb.dahan.new@feqra.com'
    })
    .expect(201);

  await request(app)
    .post('/api/vouchers/offers')
    .set('Cookie', global.signin())
    .send({
      name: 'Starbucks',
      discount: 10
    })
    .expect(201);

  customers = await Customer.find({});
  offers = await SpecialOffer.find({});

  await request(app)
    .post('/api/vouchers/voucher_codes')
    .set('Cookie', global.signin())
    .send({
      expiresAt: '2022-05-05',
      offerId: offers[0].id,
      customerId: customers[0].id
    })
    .expect(201);

  vouchers = await VoucherCode.find({}).populate('customer').populate('specialOffer');
  let customer = vouchers[0].customer as any;
  let offer = vouchers[0].specialOffer as any;
  expect(vouchers.length).toEqual(1);
  expect(customer.email).toEqual('taleb.dahan.new@feqra.com');
  expect(offer.discount).toEqual(10);
});
