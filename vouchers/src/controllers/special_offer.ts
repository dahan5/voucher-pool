import { Request, Response } from 'express';
import { NotFoundError } from '@feqra/voucher-pool-common';
import { SpecialOffer } from '../models/special_offer';

let specialOfferCtrl = {
  find: async (req: Request, res: Response) => {
    try {
      const specialOffer = await SpecialOffer.findById(req.params.id);

      if (!specialOffer) {
        throw new NotFoundError();
      }

      res.send(specialOffer);
    } catch (e) {
      throw new NotFoundError();
    }
  },
  all: async (req: Request, res: Response) => {
    const specialOffer = await SpecialOffer.find({});

    res.send(specialOffer);
  },
  create: async (req: Request, res: Response) => {
    const { name, discount } = req.body;

    const specialOffer = SpecialOffer.build({
      name,
      discount
    });
    await specialOffer.save();

    res.status(201).send(specialOffer);
  },
  update: async (req: Request, res: Response) => {
    try {
      const specialOffer = await SpecialOffer.findById(req.params.id);

      if (!specialOffer) {
        throw new NotFoundError();
      }

      specialOffer.set({
        name: req.body.name,
        discount: req.body.discount
      });
      await specialOffer.save();

      res.send(specialOffer);
    } catch (e) {
      throw new NotFoundError();
    }
  }
}

export { specialOfferCtrl as specialOfferController };
