import request from 'supertest';
import { app } from '../../app';

const createCustomer = (inputName: string, inputEmail: string) => {
  return request(app).post('/api/vouchers/customers').set('Cookie', global.signin()).send({
    name: inputName,
    email: inputEmail,
  });
};

const createSpecialOffer = (inputName: string, inputDiscount: number) => {
  return request(app).post('/api/vouchers/offers').set('Cookie', global.signin()).send({
    name: inputName,
    discount: inputDiscount
  });
};

it('can fetch a list of customers', async () => {
  await createCustomer('Taleb DAHAN 1', 'taleb.dahan.1@feqra.com');
  await createCustomer('Taleb DAHAN 2', 'taleb.dahan.2@feqra.com');
  await createCustomer('Taleb DAHAN 3', 'taleb.dahan.3@feqra.com');

  const response = await request(app).get('/api/vouchers/customers').send().expect(200);

  expect(response.body.length).toEqual(3);
});

it('can fetch a list of special offers', async () => {
  await createSpecialOffer('Starbucks 1', 10);
  await createSpecialOffer('Starbucks 2', 20);
  await createSpecialOffer('Starbucks 3', 30);

  const response = await request(app).get('/api/vouchers/offers').send().expect(200);

  expect(response.body.length).toEqual(3);
});
