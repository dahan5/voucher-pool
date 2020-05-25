import shortid from 'shortid';
shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
shortid.worker(1);

export class Generator {

  static generate() {
    return 'C' + shortid.generate() as string;
  }
}