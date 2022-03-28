import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { DiscountProduct } from 'src/app/model/DiscountProduct';
import { OrderDetail } from 'src/app/model/OrderDetail';

export class CartController {
  listCart: OrderDetail[] = [];

  /**
   * Cart controller that fetch a list of stored cart items in localStorage, 
   * and handle operations relating to cart, like adding quantity or remove/add new items
   * 
   * This section declare services
   * 
   * @param router 
   * @param notifier 
   */
  constructor(
    public router: Router,
    public notifier: NotifierService
    ) {
    try {
      this.listCart = JSON.parse(localStorage['listOrder']);
      console.log('JSON.parse(localStorage.listOrder)');
      console.log(this.listCart);

      if (this.listCart.length == 0) {
      }
    } catch (err) {
      console.log('ordereditemlist ts error constructor');
      console.log(err);

      this.listCart = [];
    }
    console.log('this.listCart');
    console.log(this.listCart);
  }

  updateCart() {
    localStorage.setItem('listOrder', JSON.stringify(this.listCart));
  }

  remove(data: OrderDetail) {
    // let index = data.index
    this.listCart.forEach((item, index) => {
      if (item._orderDetailId == data._orderDetailId) {
        console.log(
          'xoa ' + item._orderDetailId + data._orderDetailId + data._price
        );

        this.listCart.splice(index, 1);
      }
    });
    this.updateCart();
  }

  decrease(data: OrderDetail) {
    if (data._orderQuantity == 1) data._orderQuantity = 1;
    else data._orderQuantity--;
    this.updateCart();
  }

  increase(data: OrderDetail) {
    if (data._orderQuantity < 100) {
      data._orderQuantity++;
      this.updateCart();
    }
  }

  total() {
    var totalPrice = 0;
    this.listCart.forEach((item) => {
      if (item._discountProduct._voucher?._discountPct > 0) {
        totalPrice =
          totalPrice +
          ((item._price * (100 - item?._discountProduct._voucher?._discountPct)) / 100) *
            item?._orderQuantity;
      } else {
        totalPrice = totalPrice + item._price * item?._orderQuantity;
      }
    });
    return totalPrice;
  }

  redirectToCheckout() {
    try {
      if (this.listCart.length == 0) {
        this.notifier.notify('error', 'Giỏ hàng của bạn đang trống!');
      } else {
        this.router.navigate(['/checkout']);
      }
    } catch (err) {
      this.notifier.notify('error', 'Giỏ hàng của bạn đang trống!');
    }
  }

  getPrice(price: any) {
    try {
      return Number(Math.round(price)).toLocaleString();
    } catch (error) {
      this.notifier.notify('error', 'getPrice loi!');
      return '0';
    }
  }
  priceAfterDiscount(item: DiscountProduct) {
    try {    
      if (item._voucher?._discountPct > 0) {        
        let priceAfterDiscount: any = Math.floor(
          item?._product?._price -
            (item?._product?._price * item._voucher?._discountPct) / 100
        );
        if (typeof priceAfterDiscount != "number") {
          var errorIn: Error = new Error('Giá / Voucher không hợp lệ!');
          throw errorIn;
        }
        // console.log('!!!!!!!!' + priceAfterDiscount);
        return priceAfterDiscount;
      } else {
        return item?._product?._price;
      }
    } catch (errorIn) {
      // this.notifier.notify('error', ''+errorIn)
      // console.log(errorIn);
      return item?._product?._price;
    }
  }

  isCartEmpty() {
    try {
      let listCartCheckEmpty: OrderDetail[] = [];
      listCartCheckEmpty = JSON.parse(localStorage['listOrder']);
      let cartQuantity = listCartCheckEmpty.length;
      if (cartQuantity != 0) {
        return false;
      } else {
        return true;
      }
    } catch (err) {
      return true;
    }
  }
  /**
   * @param  {any} product
   */
  addCart(product: any) {
    console.log(product);

    let index = -1;
    console.log('this.listCartProduct');
    console.log(this.listCart);
    try {
      // Try to run this code
      this.listCart.forEach((item, i) => {
        if (
          item._discountProduct?._product?._productId ==
          product._product._productId
        ) {
          index = i;
        }
      });
    } catch (err) {
      // if any error, Code throws the error
      this.listCart = [];
      console.log('is empty');
    }
    console.log(index);
    if (index > -1) {
      this.listCart[index]._orderQuantity += 1;
      console.log('index > -1' + index);
      localStorage.setItem('listOrder', JSON.stringify(this.listCart));
      this.notifier.notify(
        'success',
        "Đã thêm '" + product._product._name + "' vào giỏ hàng!"
      );
    } else {
      const orderDetaiOn = new OrderDetail(product._discountProductId);
      orderDetaiOn._orderDetailId = product._product._productId;
      orderDetaiOn._discountProduct = product;
      orderDetaiOn._orderQuantity = 1;
      if (product.voucher) {
        orderDetaiOn._price = product._product?._price;
      } else {
        orderDetaiOn._price = product._product?._price;
      }

      // color and size: default for now
      orderDetaiOn._color = "default"
      orderDetaiOn._size = 40

      this.listCart.push(orderDetaiOn);
      localStorage.setItem('listOrder', JSON.stringify(this.listCart));
      console.log(JSON.parse(localStorage['listOrder']));
      this.notifier.notify(
        'success',
        "Đã thêm '" + product._product._name + "' vào giỏ hàng!"
      );
    }
  }
}
