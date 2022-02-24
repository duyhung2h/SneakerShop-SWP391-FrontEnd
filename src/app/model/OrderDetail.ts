import {DiscountProduct} from "./DiscountProduct";

export class OrderDetail {
  _orderDetailId?: any;
  _discountProduct?: DiscountProduct;
  _orderQuantity?: any;
  _voucherCode?: any;
  _price?: any;
  _discountPct?: any;


	constructor(orderDetailId?: number, discountProduct?: DiscountProduct, orderQuantity?: number, voucherCode?: any, price?: number, discountPct?: any) {
		this._orderDetailId = orderDetailId;
		this._discountProduct = discountProduct;
		this._orderQuantity = orderQuantity;
		this._voucherCode = voucherCode;
		this._price = price;
		this._discountPct = discountPct;
	}
  
}
