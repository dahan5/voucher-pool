import { Request, Response } from 'express';
import { NotFoundError, CustomError } from '@feqra/voucher-pool-common';
import { VoucherCode } from '../models/voucher_code';
import { Generator } from '../services/generator';
import { Customer } from '../models/customer';
import { VoucherAlreadyRedeemedError } from '../errors/voucher-already-redeemed';
import moment from 'moment';
import { VoucherAlreadyExpiredError } from '../errors/voucher-already-expired';
import { SpecialOffer } from '../models/special_offer';

let voucherCodeCtrl = {
  find: async (req: Request, res: Response) => {
    const voucherCode = await VoucherCode.findOne({code: req.params.code});

    if (!voucherCode) {
      throw new NotFoundError();
    }

    res.send(voucherCode);
  },
  all: async (req: Request, res: Response) => {
    let conditions = {} as any;
    if (req.params.email) {
      const customer = await Customer.findOne({email: req.params.email});
      if (customer) {
        conditions['customer'] = customer?.id;
      }
      if (req.params.status) {
        if (req.params.status === 'e') {
          conditions['expiresAt'] = {"$lt": new Date()}
        } else if (req.params.status === 'u') {
          conditions['usedAt'] = { $ne: null }
        } else if (req.params.status === 'n') {
          conditions['usedAt'] = null
        }
      }
    }
    const voucherCode = await VoucherCode.find(conditions)
    .populate('customer').populate('specialOffer');

    res.send(voucherCode);
  },
  create: async (req: Request, res: Response) => {
    const { expiresAt, customerId, offerId } = req.body;
    const code = Generator.generate() as string;

    const voucherCode = VoucherCode.build({
      code: code,
      expiresAt: expiresAt,
      usedAt: null,
      customer: customerId,
      specialOffer: offerId
    });
    await voucherCode.save();

    res.status(201).send(voucherCode);
  },
  update: async (req: Request, res: Response) => {
    const voucherCode = await VoucherCode.findOne({
      code: req.body.code
    }).populate('customer').populate('specialOffer');

    if (!voucherCode) {
      throw new NotFoundError();
    }

    let customer = voucherCode.customer as any;

    if (customer.email === req.body.email) {
      if (voucherCode.usedAt !== null) {
        throw new VoucherAlreadyRedeemedError();
      }
      if (moment().isAfter(voucherCode.expiresAt)) {
        throw new VoucherAlreadyExpiredError();
      }
      voucherCode.set({
        usedAt: new Date()
      });
      await voucherCode.save();
      res.send(voucherCode);
    } else {
      throw new NotFoundError();
    }
  },
  validate: async (req: Request, res: Response) => {
    const voucherCode = await VoucherCode.findOne({
      code: req.body.code
    }).populate('customer').populate('specialOffer');

    if (!voucherCode) {
      throw new NotFoundError();
    }

    let customer = voucherCode.customer as any;

    if (customer.email === req.body.email) {
      if (voucherCode.usedAt !== null) {
        throw new VoucherAlreadyRedeemedError();
      }
      if (moment().isAfter(voucherCode.expiresAt)) {
        throw new VoucherAlreadyExpiredError();
      }
      let specialOffer = voucherCode.specialOffer as any;
      res.send({
        discount: specialOffer.discount,
        name: specialOffer.name
      });
    } else {
      throw new NotFoundError();
    }
  }
}

export { voucherCodeCtrl as voucherCodeController };
