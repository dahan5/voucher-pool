import { Request, Response } from 'express';
import { NotFoundError } from '@feqra/voucher-pool-common';
import { Customer } from '../models/customer';

let customerCtrl = {
  find: async (req: Request, res: Response) => {
    const customer = await Customer.findOne({email: req.params.email});
  
    if (!customer) {
      throw new NotFoundError();
    }
  
    res.send(customer);
  },
  all: async (req: Request, res: Response) => {
    const customer = await Customer.find({});
  
    res.send(customer);
  },
  create: async (req: Request, res: Response) => {
    const { name, email } = req.body;

    const customer = Customer.build({
      name,
      email
    });
    await customer.save();

    res.status(201).send(customer);
  },
  update: async (req: Request, res: Response) => {
    const customer = await Customer.findOne({email: req.params.email});

    if (!customer) {
      throw new NotFoundError();
    }

    customer.set({
      name: req.body.name,
      email: req.params.email
    });
    await customer.save();

    res.send(customer);
  }
}

export { customerCtrl as customerController };
