import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { VoucherCode } from './voucher_code';

interface SpecialOfferAttrs {
  name: string;
  discount: number;
}

export interface SpecialOfferDoc extends mongoose.Document {
  name: string;
  price: number;
  isUsed(): Promise<boolean>;
}

interface SpecialOfferModel extends mongoose.Model<SpecialOfferDoc> {
  build(attrs: SpecialOfferAttrs): SpecialOfferDoc;
  findByEvent(event: {
    id: string
  }): Promise<SpecialOfferDoc | null>;
}

const specialOfferSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

specialOfferSchema.plugin(updateIfCurrentPlugin);

specialOfferSchema.statics.findByEvent = (event: { id: string }) => {
  return SpecialOffer.findOne({
    _id: event.id
  });
};
specialOfferSchema.statics.build = (attrs: SpecialOfferAttrs) => {
  return new SpecialOffer(attrs);
};
specialOfferSchema.methods.isUsed = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingVoucherCode = await VoucherCode.findOne({
    specialOffer: this
  });

  return !!existingVoucherCode;
};

const SpecialOffer = mongoose.model<SpecialOfferDoc, SpecialOfferModel>('special_offer', specialOfferSchema);

export { SpecialOffer };
