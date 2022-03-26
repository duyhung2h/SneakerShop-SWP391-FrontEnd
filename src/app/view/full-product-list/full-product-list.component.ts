import {
  Component,
  Injectable,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/db/auth.service';
import { CategoryService } from 'src/app/db/CategoryService';
import { DiscountProductService } from 'src/app/db/DiscountProductService';
import { FavoriteProductService } from 'src/app/db/FavoriteProductService';
import { NotifierService } from 'angular-notifier';
import { CategoryController } from 'src/app/controller/CategoryController';
declare var $: any;

// @Injectable({ providedIn: 'any' })
@Component({
  selector: 'app-full-product-list',
  templateUrl: './full-product-list.component.html',
  styleUrls: ['./full-product-list.component.css'],
})
export class FullProductListComponent extends CategoryController implements OnInit {
  // controller declare
  // categoryController: CategoryController = new CategoryController(
  //   this.activatedRoute,
  //   this.categoryService,
  //   this.productController
  // );
  /**
   * This section declare services
   *
   * @param productService
   * @param router
   * @param activatedRoute
   * @param authService
   * @param categoryService
   * @param favoriteProductService
   * @param notifier
   */
  constructor(
    activatedRoute: ActivatedRoute,
    categoryService: CategoryService,
    productService: DiscountProductService,
    authService: AuthService,
    router: Router,
    favoriteProductService: FavoriteProductService,
    notifier: NotifierService
  ) {
    super(activatedRoute, categoryService, productService, authService, router, favoriteProductService, notifier)
    // this.categoryController = new CategoryController(
    //   this.activatedRoute,
    //   this.categoryService,
    //   this.productController
    // );
    console.log("full productlits component start");
    
  }

  ngOnInit(): void {}

  async fetchSearchedList() {
    await this.getSearchedProducts()
    // this.categoryController = new CategoryController(
    //   this.activatedRoute,
    //   this.categoryService,
    //   this.productController
    // );
    // console.log(this.categoryController.selectedSortValue);
        // alert(JSON.parse(localStorage['loadedListProductSearched']))
    
    return await JSON.parse(localStorage['loadedListProductSearched']);
    // return this.listProductSearched;
  }
}
