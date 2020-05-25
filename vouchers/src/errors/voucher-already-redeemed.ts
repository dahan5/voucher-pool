import { CustomError } from '@feqra/voucher-pool-common';

export class VoucherAlreadyRedeemedError extends CustomError {
  statusCode = 400;
  reason = 'Voucher already redeemed';

  constructor() {
    super('Voucher already redeemed');

    Object.setPrototypeOf(this, VoucherAlreadyRedeemedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}
