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
import { ProductController } from 'src/app/controller/ProductController';
import { CategoryController } from 'src/app/controller/CategoryController';
declare var $: any;

// @Injectable({ providedIn: 'any' })
@Component({
  selector: 'app-full-product-list',
  templateUrl: './full-product-list.component.html',
  styleUrls: ['./full-product-list.component.css'],
})
export class FullProductListComponent implements OnInit {
  txtSearch: any;
  // controller declare
  productController: ProductController = new ProductController(
    this.productService,
    this.authService,
    this.router,
    this.favoriteProductService,
    this.notifier
  );
  categoryController: CategoryController = new CategoryController(
    this.activatedRoute,
    this.categoryService,
    this.productController
  );
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
    private productService: DiscountProductService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private categoryService: CategoryService,
    private favoriteProductService: FavoriteProductService,
    private notifier: NotifierService
  ) {
    // alert()
    this.categoryController = new CategoryController(
      this.activatedRoute,
      this.categoryService,
      this.productController
    );
  }

  ngOnInit(): void {}

  async fetchSearchedList() {
    await new CategoryController (
      this.activatedRoute,
      this.categoryService,
      this.productController).getSearchedProducts();
    this.categoryController = new CategoryController(
      this.activatedRoute,
      this.categoryService,
      this.productController
    );
    console.log(this.categoryController.selectedSortValue);
    
    return await JSON.parse(localStorage['loadedListProductSearched']);
  }
}
