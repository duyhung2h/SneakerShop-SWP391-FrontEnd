import { Component, Host, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { DiscountProduct } from 'src/app/model/DiscountProduct';
import { AuthService } from 'src/app/db/auth.service';
import { DiscountProductService } from 'src/app/db/DiscountProductService';
import { FavoriteProductService } from 'src/app/db/FavoriteProductService';
import { ProductController } from 'src/app/controller/ProductController';
import { TextController } from 'src/app/controller/TextController';
import { FullProductListComponent } from '../../full-product-list/full-product-list.component';
import { CartController } from 'src/app/controller/CartController';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'any' })
@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [FullProductListComponent],
})
export class ProductListComponent extends CartController implements OnInit {
  environment = environment;
  listProductSearched: DiscountProduct[] = [];
  txtSearch: any;
  formGroup = new FormGroup({ search: new FormControl() });

  // controller declare
  productController: ProductController = new ProductController(
    this.productService,
    this.authService,
    this.router,
    this.favoriteProductService,
    this.notifier
  );
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
    router: Router,
    private favoriteProductService: FavoriteProductService,
    notifier: NotifierService,
    @Host() parentComponent?: FullProductListComponent
  ) {
    super(router, notifier);
    try {
      this.loadSearchedData(parentComponent);
      
    this.reloadListProductSearched()
    } catch (error) {
      this.notifier.notify(
        'error',
        'Lỗi hiển thị list sản phẩm tìm kiếm constructor!'
      );
    }
    // this.listCart = JSON.parse(localStorage['listCart'])
  }
  async loadSearchedData(parentComponent?: FullProductListComponent) {
    try {
      this.productController.listProductSearched =
        await parentComponent?.fetchSearchedList();
      this.productController.listPages(
        this.productController.listProductSearched
      );
      console.log(this.productController.listProductSearched);
    } catch (error) {
      this.notifier.notify('error', 'Lỗi hiển thị list sản phẩm tìm kiếm!');
    }
    // await this.delay(10000);
  }
  arraysAreEqual(ary1: any[],ary2: any[]){
    return (ary1.join('') == ary2.join(''));
  }
  

  timeout = 10000
  async reloadListProductSearched() {
    // console.log(this.timeout);
    while (this.timeout > 0) {
      console.log(this.timeout);
      this.listProductSearched = JSON.parse(localStorage['loadedListProductSearched']);
      // console.log(this.listProductSearched);
      // console.log(this.productController.listProductSearched);
      
      await this.wait(100);
      if (!this.arraysAreEqual(this.productController.listProductSearched, this.listProductSearched)){
        this.productController.listProductSearched = this.listProductSearched;
        console.log(this.productController.listProductSearched != this.listProductSearched);
        
        this.productController.listPages(this.productController.listProductSearched)
        // console.log(this.timeout);
        
        this.timeout = 1000
      }else {
        this.timeout = this.timeout - 1
      }
    }
  }

  wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  ngOnInit(): void {}
  /**
   * @param  {any} product
   */
  // override addCart(product: any) {
  //   alert(this.productController.listProductSearched);
  //   this.productController.listProductSearched = JSON.parse(
  //     localStorage['loadedListProductSearched']
  //   );
  // }

  //favorite: end
}
