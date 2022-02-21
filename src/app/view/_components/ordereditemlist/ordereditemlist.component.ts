import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { OrderDetail } from "src/app/model/OrderDetail";

@Component({
  selector: 'app-ordereditemlist',
  templateUrl: './ordereditemlist.component.html',
  styleUrls: ['./ordereditemlist.component.css']
})
export class OrdereditemlistComponent implements OnInit {

  listCart: OrderDetail[] = []

  constructor(private router: Router,
    private notifier: NotifierService) {
    window.scroll(0, 400);
    try {
      this.listCart = JSON.parse(localStorage['listOrder']);
      console.log("JSON.parse(localStorage.listOrder)");
      console.log(this.listCart);

      if (this.listCart.length == 0) {
      }

    } catch (err) {

      console.log("ordereditemlist ts error constructor");
      console.log(err);

      this.listCart = []
    }
    console.log("this.listCart");
    console.log(this.listCart);

  }

  ngOnInit(): void {
  }

  updateCart() {
    localStorage.setItem('listOrder', JSON.stringify(this.listCart));
  }

  remove(data: OrderDetail) {
    // let index = data.index
    this.listCart.forEach((item, index) => {
      if (item.orderDetailId == data.orderDetailId) {
        console.log("xoa " + item.orderDetailId + data.orderDetailId + data.price);

        this.listCart.splice(index, 1);
      }
    })
    this.updateCart();
  }

  decrease(data: any) {
    if (data.orderonlqty == 1)
      data.orderonlqty = 1
    else
      data.orderonlqty--;
    this.updateCart();
  }

  increase(data: any) {
    if (data.orderonlqty < 100) {
      data.orderonlqty++;
      this.updateCart();
    }
  }

  total() {
    var totalPrice = 0;
    this.listCart.forEach(item => {
      if (item.voucherCode != null) {
        totalPrice = totalPrice + (item.price * (100 - item?.discountPct) / 100) * item?.orderQuantity;
      } else {
        totalPrice = totalPrice + item.price * item?.orderQuantity;
      }

    });
    return totalPrice;
  }

  redirectToCheckout() {
    try {
      if (this.listCart.length == 0) {
        this.notifier.notify('error', "Giỏ hàng của bạn đang trống!");
      } else {
        this.router.navigate(['/checkoutFinal']);
      }
    } catch (err) {
      this.notifier.notify('error', "Giỏ hàng của bạn đang trống!");
    }
  }



  getPrice(price: any) {
    return Number(Math.round(price)).toLocaleString();
  }
  getPriceProduct(item: any) {
    let returnPrice = 0;

    if (item.discountproduct?.voucher) {
      returnPrice = (item.discountproduct?.product?.price * (100 - item.discountPct) / 100)
    } else {
      returnPrice = item.discountproduct?.product?.price
    }

    return Math.round(returnPrice);
  }

  isCartEmpty() {
    try {
      let listCartCheckEmpty: OrderDetail[] = [];
      listCartCheckEmpty = JSON.parse(localStorage['listOrder'])
      let cartQuantity = listCartCheckEmpty.length;
      // console.log("cartQuantity");
      // console.log(cartQuantity);
      if (cartQuantity != 0) {
        return false
      } else {
        return true
      }
    } catch (err) {
      return true
    }
  }
}