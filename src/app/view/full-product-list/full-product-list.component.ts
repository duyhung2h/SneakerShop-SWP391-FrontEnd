import {
  ChangeDetectorRef,
  Component,
  Injectable,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, delay } from 'rxjs';
import { UserModel } from 'src/app/model/UserModel';
import { AuthService } from 'src/app/controller/auth.service';
import { CategoryService } from 'src/app/controller/CategoryService';
import { DiscountProductService } from 'src/app/controller/DiscountProductService';
import { FavoriteProductService } from 'src/app/controller/FavoriteProductService';
import { Category } from 'src/app/model/Category';
import { DiscountProduct } from 'src/app/model/DiscountProduct';
import { OrderDetail } from 'src/app/model/OrderDetail';
import { NotifierService } from 'angular-notifier';
import { TextController } from 'src/app/controller/TextController';
import { ProductController } from 'src/app/controller/ProductController';
import { CategoryController } from 'src/app/controller/CategoryController';
declare var $: any;

@Injectable({ providedIn: 'any' })
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
    this.categoryController.formGroup.value.search =
      this.categoryController.txtSearch;
  }

  ngOnInit(): void {}

  async fetchSearchedList() {
    this.categoryController = new CategoryController(
      this.activatedRoute,
      this.categoryService,
      this.productController
    );
    await this.categoryController.getSearchedProducts();
    return await JSON.parse(localStorage['loadedListProductSearched']);
  }

  refreshProductList() {
    // this.router
    //   .navigateByUrl('/home', { skipLocationChange: true })
    //   .then(() => {
        this.router
          .navigate(['/product-list'], {
            queryParams: {
              selectedCategoryIndex:
                this.categoryController.selectedCategoryIndex,
              selectedSortValue: this.categoryController.selectedSortValue,
              selectedSortNameValue:
                this.categoryController.selectedSortNameValue,
              selectedSortPriceValue:
                this.categoryController.selectedSortPriceValue,
              searchText: this.txtSearch,
            },
          })
          .then(() => {
            window.location.reload()
            console.log(
              '%c full product list refresh',
              'color: orange; background-color: #222222;'
            );
          });
      // });
  }
}
