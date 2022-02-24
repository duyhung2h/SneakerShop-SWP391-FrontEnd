import {Product} from "./Product";
import {Voucher} from "./Voucher";

export class DiscountProduct {
  _discountProductId ?: any;
  _product ?: Product;
  _voucher ?: Voucher;

  constructor(discountProductId?: any, product?: Product, voucher?: Voucher){
    this._discountProductId = discountProductId;
    this._product = product;
    this._voucher = voucher;
  }
}
