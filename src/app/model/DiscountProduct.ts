import {Product} from "./Product";
import {Voucher} from "./Voucher";

export class DiscountProduct {
  _discountProductId ?: any;
  _product ?: Product;
  _voucher?: Voucher = new Voucher;

  constructor(discountProductId?: any, product?: Product, voucher?: Voucher, ){
    this._discountProductId = discountProductId;
    this._product = product;
    this._voucher = new Voucher;
    this._voucher = voucher;
  }
}
