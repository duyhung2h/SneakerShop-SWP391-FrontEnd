import { DiscountProduct } from './DiscountProduct';
import { DiscountProductService } from '../db/DiscountProductService';
import { Voucher } from './Voucher';

export class OrderDetail {
  _orderDetailId?: any;
  _discountProduct: DiscountProduct = new DiscountProduct;
  _orderQuantity?: any;
  _price?: any;
  _color?: any;
  _size?: any;

  /**
   * declare a new product
   * 
   * voucher is optional for product in OrderHistory with pre-registered voucher
   * 
   * @param productId //required
   * @param voucher
   * @param orderDetailId 
   * @param orderQuantity 
   * @param price 
   * @param color 
   * @param size 
   */
  constructor(
    // discountProduct?: DiscountProduct,
    productId: number,
    voucher?: Voucher,
    orderDetailId?: number,
    orderQuantity?: number,
    price?: number,
    color?: any,
    size?: any
  ) {
    this._orderDetailId = orderDetailId;
    this._orderQuantity = orderQuantity;
    this._price = price;
    this._color = color;
    this._size = size;
    this.loadProductById(productId, voucher);
  }

  async loadProductById(productId: number, voucher?: Voucher) {
    await DiscountProductService.loadProductById(
      productId
    ).then((data) => {
		this._discountProduct = data
      if (voucher != undefined) {
		this._discountProduct._voucher = data._voucher
      }
    });
  }
}
