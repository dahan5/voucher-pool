import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the offer is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/vouchers/offers/${id}`).send().expect(404);
});

it('returns the offer if the offer is found', async () => {
  const name = 'IKEA';
  const discount = 20;

  const response = await request(app)
    .post('/api/vouchers/offers')
    .set('Cookie', global.signin())
    .send({
      name,
      discount
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/vouchers/offers/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.name).toEqual(name);
  expect(ticketResponse.body.discount).toEqual(discount);
});
