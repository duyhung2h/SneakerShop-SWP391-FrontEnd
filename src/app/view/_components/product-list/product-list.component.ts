import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { DiscountProduct } from 'src/app/model/DiscountProduct'
import { OrderDetail } from 'src/app/model/OrderDetail';
import { AuthService } from 'src/app/controller/auth.service';
import { DiscountProductService } from 'src/app/controller/DiscountProductService';
import { FavoriteProductService } from 'src/app/controller/FavoriteProductService';
import { ProductController } from 'src/app/controller/ProductController';
import { TextController } from 'src/app/controller/TextController';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  listCart: OrderDetail[] = []
  txtSearch: any;
  formGroup = new FormGroup({ search: new FormControl() });


  // controller declare
  productController: ProductController = new ProductController(this.productService, this.authService, this.router, this.favoriteProductService, this.notifier);
  textController: TextController = new TextController();
  /**
   * This section declare services
   * 
   * @param productService 
   * @param authService 
   * @param router 
   * @param favoriteProductService 
   * @param notifier 
   */
  constructor(
    private productService: DiscountProductService,
    private authService: AuthService,
    private router: Router,
    private favoriteProductService: FavoriteProductService,
    private notifier: NotifierService
  ) {
  }

  ngOnInit(): void {
  }



  //favorite: end
  /**
   * @param  {any} product
   */
  addCart(product: any) {

    let index = -1;
    console.log("this.listCartProduct");
    console.log(this.listCart);
    try {
      // Try to run this code 
      this.listCart.forEach((item, i) => {
        if (item._discountProduct?._product?._productId == product.product.productId) { index = i; }
      })
    }
    catch (err) {
      // if any error, Code throws the error
      this.listCart = [];
      console.log("is empty");
    }
    console.log(index)
    if (index > -1) {
      this.listCart[index]._orderQuantity += 1;
      console.log("index > -1" + index);
      localStorage.setItem('listOrder', JSON.stringify(this.listCart));
      this.notifier.notify('success', "Đã thêm '" + product.product.name + "' vào giỏ hàng!");
    } else {
      const orderDetaiOn = new OrderDetail();
      orderDetaiOn._orderDetailId = product.product.productId;
      orderDetaiOn._discountProduct = product;
      orderDetaiOn._orderQuantity = 1;
      if (product.voucher) {
        orderDetaiOn._price = product.product?.price
      } else {
        orderDetaiOn._price = product.product?.price
      }

      orderDetaiOn._discountPct = product?.voucher?.discountPct;
      orderDetaiOn._voucherCode = product?.voucher?.voucherCode;

      this.listCart.push(orderDetaiOn);
      localStorage.setItem('listOrder', JSON.stringify(this.listCart));
      console.log(JSON.parse(localStorage['listOrder']));
      this.notifier.notify('success', "Đã thêm '" + product.product.name + "' vào giỏ hàng!");
    }
  }
  /**
   * @param  {any} item
   */
  priceAfterDiscount(item?: DiscountProduct) {
    try {
      if (item?._voucher) {
        let priceAfterDiscount: any = Math.floor(item?._product?._price - (item?._product?._price * item._voucher._discountPct) / 100);
        if (!(priceAfterDiscount instanceof Number)) {
          var errorIn: Error = new Error("Giá / Voucher không hợp lệ!");
          throw errorIn
        }
        console.log("!!!!!!!!" + priceAfterDiscount)
        return priceAfterDiscount
      } else {
        return item?._product?._price;
      }
    } catch (errorIn) {
      // this.notifier.notify('error', ''+errorIn)
      return item?._product?._price;
    }
  }
}
