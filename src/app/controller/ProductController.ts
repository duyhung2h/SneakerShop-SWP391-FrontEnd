import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
import { Category } from 'src/app/model/Category';
import { DiscountProduct } from 'src/app/model/DiscountProduct';
import { OrderDetail } from 'src/app/model/OrderDetail';
import { AuthService } from 'src/app/db/auth.service';
import { DiscountProductService } from 'src/app/db/DiscountProductService';
import { FavoriteProductService } from 'src/app/db/FavoriteProductService';

export class ProductController {
  listProductSearched: DiscountProduct[] = [];
  listProduct: DiscountProduct[] = [];
  listProductCore: any = [];
  listProductFavorite: DiscountProduct[] = [];
  listCart: OrderDetail[] = [];
  
  skip = 0;
  pageSize = 8;
  listPage: number[] = [];
  selectedFavoriteIndex = -1;

  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

  
  /**
   * Product controller that fetch a list of Product through DiscountProductService, 
   * and handle checking favorite products in list / add, remove favorite products
   * 
   * This section declare services
   *
   * @param productService
   * @param authService
   * @param router
   * @param favoriteProductService
   * @param notifier
   */
  constructor(
    public productService: DiscountProductService,
    public authService: AuthService,
    public router: Router,
    public favoriteProductService: FavoriteProductService,
    public notifier: NotifierService
  ) {
    // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    try {
      this.loadData();
    } catch (err) {}
    try {
      if (this.authService.userModel != null) {
        this.loadProductFavorite();
      }
    } catch (err) {}
  }

  /**
   * @param  {DiscountProduct|any} product
   */
  viewDetail(product: DiscountProduct | any) {
    this.router.navigate(['/detail'], {
      queryParams: { DiscountProductId: product.DiscountProductId },
    });
  }
  /**
   * On page change, show list of products according to page number
   * 
   * @param  {any} index
   */
  pageChange(index: any) {
    this.skip = index * this.pageSize;
  }
  /**
   * Load table list number according to number of product shown per page and number of products
   */
  listPages(listProductSearched: DiscountProduct[]) {
    let i = 0;
    let add = 0;
    
    this.listPage = [];
    for (i; i < listProductSearched.length; i++) {
      if (i % this.pageSize == 0) {
        this.listPage.push(add);
        add++;
      }
    }
  }

  /**
   * remove product with status = 0
   * 
   * @param  {DiscountProduct[]} listProduct
   */
  removeUnwantedProductFromList(listProduct: DiscountProduct[]) {
    listProduct.forEach((item, i) => {
      if (item._product?._status == 0) {
        listProduct.splice(i, 1);
      }
    });
    return listProduct;
  }
  /**
   * Load product data from API through DiscountProductService
   */
  async loadData() {
    let data: DiscountProduct[] = await this.productService.getAllProduct();
    console.log(data);
    this.listProductCore = data
    this.listProduct = data
    if (window.location.pathname == '/home'){
      this.listProductSearched = data
    }
    if (this.listProduct.length == 0) {
      this.notifier.notify('error', 'L???i hi???n th??? list s???n ph???m!');
    }
    // this.listProduct = this.removeUnwantedProductFromList(this.listProduct)
    this.isLoading.next(true)
    this.listPages(this.listProductSearched)
    console.log(data)
    return this.listProduct
  }

  /**
   * update favorite product list to session
   */
  updateFavorite() {
    localStorage.setItem(
      'listProductFavorite',
      JSON.stringify(this.listProductFavorite)
    );
  }

  /**
   * lam viec voi favorite
   */
  loadProductFavorite() {
    this.favoriteProductService
      .getFavoriteProduct(this.authService.userModel.customer?.customerId)
      .then((data) => {
        console.log('getFavoriteProduct');
        console.log(data);

        this.listProductFavorite = data;
        this.isLoading.next(true);

        this.updateFavorite();
      });
  }
  /**
   * Check if the product is favorited if user hover over a product
   * 
   * @param  {any} product
   */
  checkFavorite(product: any) {
    let listProductFavorite: DiscountProduct[] = [];

    this.favoriteProductService
      .getFavoriteProduct(this.authService.userModel.customer?.customerId)
      .then((data) => {
        // console.log('getFavoriteProduct');
        // console.log(data);

        listProductFavorite = data;
        this.isLoading.next(true);
        for (let item of listProductFavorite) {
          if (item._product?._productId == product.product.productId) {
            console.log('listProductFavorite: product da ton tai');
            this.selectedFavoriteIndex = product.product.productId;

            return;
          }
        }
        // console.log('listProductFavorite: product chua ton tai');
        this.selectedFavoriteIndex = -1;
      });
  }

  /**
   * Add product to customer favorite list
   * 
   * @param  {any} product
   */
  addFavorite(product: any) {
    this.favoriteProductService
      .getFavoriteProduct(this.authService.userModel.customer?.customerId)
      .then((data) => {
        console.log('getFavoriteProduct');
        console.log(data);
        this.listProductFavorite = data;
        this.isLoading.next(true);
        const idIndex = this.listProductFavorite.findIndex(
          (productFavoriteItem) =>
            productFavoriteItem._product?._productId ==
            product.product.productId
        );
        if (idIndex != -1) {
          console.log('listProductFavorite: product da ton tai');
          //remove mon an khoi list favorite
          this.favoriteProductService
            .removeFavoriteProduct(
              this.authService.userModel.customer?.customerId,
              product.product.productId
            )
            .then((data) => {
              console.log('this.favoriteProductService.removeFavoriteProduct');
              console.log(data);
              console.log('idIndex');
              console.log(idIndex);
            });
          this.listProductFavorite.splice(idIndex, 1);
          this.updateFavorite();
          this.notifier.notify(
            'success',
            "???? x??a '" + product.product.name + "' kh???i s???n ph???m y??u th??ch!"
          );
          return;
        } else {
          console.log('listProductFavorite: product chua ton tai');
          //add product vao list favorite
          this.favoriteProductService
            .addFavoriteProduct(
              this.authService.userModel.customer?.customerId,
              product.product.productId
            )
            .then((data) => {
              console.log('this.favoriteProductService.addFavoriteProduct');
              console.log(data);
            });
          this.listProductFavorite.push(product);
          this.updateFavorite();
          this.notifier.notify(
            'success',
            "S???n ph???m '" +
              product.product.name +
              "' ???? ???????c th??m v??o y??u th??ch!"
          );
          return;
        }
      });
  }
}
