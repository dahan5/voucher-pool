import { VoucherCode } from '../voucher_code';
import { Customer } from '../customer';
import { SpecialOffer } from '../special_offer';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a ticket
  const customerDoc = Customer.build({
    name: 'Taleb DAHAN',
    email: 'taleb.dahan@feqra.com'
  });
  await customerDoc.save();
  const specialOfferDoc = SpecialOffer.build({
    name: 'Starbucks',
    discount: 10
  });
  await specialOfferDoc.save();
  const voucherCode = VoucherCode.build({
    code: 'CNE8FvoUjg',
    expiresAt: new Date('2022-12-09'),
    usedAt: new Date('2020-05-29'),
    customer: customerDoc,
    specialOffer: specialOfferDoc
  });

  // Save the ticket to the database
  await voucherCode.save();

  // fetch the ticket twice
  const firstInstance = await VoucherCode.findById(voucherCode.id);
  const secondInstance = await VoucherCode.findById(voucherCode.id);

  // make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});

