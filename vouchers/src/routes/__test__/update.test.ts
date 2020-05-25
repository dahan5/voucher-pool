import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Customer } from '../../models/customer';
import { SpecialOffer } from '../../models/special_offer';
import { VoucherCode } from '../../models/voucher_code';

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/vouchers/offers/${id}`)
    .set('Cookie', global.signin())
    .send({
      name: 'IKEA Update 404',
      discount: 20
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/vouchers/offers/${id}`)
    .send({
      name: 'IKEA Update 401',
      discount: 20
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid name or discount', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/vouchers/offers')
    .set('Cookie', cookie)
    .send({
      name: '',
      discount: 20
    });

  await request(app)
    .put(`/api/vouchers/offers/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      price: 20
    })
    .expect(400);

  await request(app)
    .put(`/api/vouchers/offers/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Testing',
      price: -10,
    })
    .expect(400);
});

it('validates a voucher code', async () => {
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
      name: 'Taleb DAHAN Update',
      email: 'taleb.dahan.update@feqra.com'
    })
    .expect(201);

  await request(app)
    .post('/api/vouchers/offers')
    .set('Cookie', global.signin())
    .send({
      name: 'Starbucks Update',
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
  expect(customer.email).toEqual('taleb.dahan.update@feqra.com');
  expect(offer.discount).toEqual(10);
  expect(vouchers[0].usedAt).toEqual(null);

  await request(app)
    .post('/api/vouchers/voucher_codes/validate')
    .set('Cookie', global.signin())
    .send({
      code: vouchers[0].code,
      email: customers[0].email
    })
    .expect(200);
  vouchers = await VoucherCode.find({}).populate('customer').populate('specialOffer');
});
