import mongoose from 'mongoose';

interface CustomerAttrs {
  name: string;
  email: string;
}

export interface CustomerDoc extends mongoose.Document {
  name: number;
  email: string;
}

interface CustomerModel extends mongoose.Model<CustomerDoc> {
  build(attrs: CustomerAttrs): CustomerDoc;
}

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
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

customerSchema.statics.build = (attrs: CustomerAttrs) => {
  return new Customer(attrs);
};

const Customer = mongoose.model<CustomerDoc, CustomerModel>('customer', customerSchema);

export { Customer };
