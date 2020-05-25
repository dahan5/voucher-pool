import { CustomError } from '@feqra/voucher-pool-common';

export class VoucherAlreadyExpiredError extends CustomError {
  statusCode = 400;
  reason = 'Voucher already expired';

  constructor() {
    super('Voucher already expired');

    Object.setPrototypeOf(this, VoucherAlreadyExpiredError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
