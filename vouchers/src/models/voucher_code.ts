import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { CustomerDoc } from './customer';
import { SpecialOfferDoc } from './special_offer';

interface VoucherCodeAttrs {
  code: string;
  expiresAt: Date;
  usedAt: any;
  customer: CustomerDoc;
  specialOffer: SpecialOfferDoc;
}

interface VoucherCodeDoc extends mongoose.Document {
  code: string;
  expiresAt: Date;
  usedAt: Date;
  customer: string;
  specialOffer: string;
}

interface VoucherCodeModel extends mongoose.Model<VoucherCodeDoc> {
  build(attrs: VoucherCodeAttrs): VoucherCodeDoc;
}

const voucherCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
      maxlength: 15
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date
    },
    usedAt: {
      type: mongoose.Schema.Types.Date
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customer'
    },
    specialOffer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'special_offer'
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

voucherCodeSchema.plugin(updateIfCurrentPlugin);

voucherCodeSchema.statics.build = (attrs: VoucherCodeAttrs) => {
  return new VoucherCode(attrs);
};
voucherCodeSchema.methods.findByCode = function findByCode(code: string) {
  return VoucherCode.findOne({
    code: code
  });
};

const VoucherCode = mongoose.model<VoucherCodeDoc, VoucherCodeModel>('voucher_code', voucherCodeSchema);

export { VoucherCode };
