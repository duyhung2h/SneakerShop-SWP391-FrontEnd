import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
import { Category } from 'src/app/model/Category';
import { DiscountProduct } from 'src/app/model/DiscountProduct';
import { OrderDetail } from 'src/app/model/OrderDetail';
import { AuthService } from 'src/app/controller/auth.service';
import { DiscountProductService } from 'src/app/controller/DiscountProductService';
import { FavoriteProductService } from 'src/app/controller/FavoriteProductService';
import { Attribute } from '../model/Attribute';
import { Product } from '../model/Product';
import { Voucher } from '../model/Voucher';

export class ProductController {
  listProductSearched: DiscountProduct[] = [];
  listProduct: DiscountProduct[] = [];
  listProductCore: any[] = [];
  listCategory: Category[] = [];
  listProductFavorite: DiscountProduct[] = [];
  listCart: OrderDetail[] = [];
  skip = 0;
  pageSize = 8;
  listPage: number[] = [];
  txtSearch: any;
  formGroup = new FormGroup({ search: new FormControl() });
  selectedFavoriteIndex = -1;

  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  );

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
    public authService: AuthService,
    private router: Router,
    private favoriteProductService: FavoriteProductService,
    private notifier: NotifierService
  ) {
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
   * @param  {any} index
   */
  pageChange(index: any) {
    this.skip = index * this.pageSize;
  }
  /**
   * Add pages to product page
   */
  listPages() {
    let i = 0;
    let add = 0;
    for (i; i < this.listProduct.length; i++) {
      if (i % this.pageSize == 0) {
        this.listPage.push(add);
        add++;
      }
    }
  }

  //remove product with status = 0
  /**
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
   * Load product data
   */
  loadData() {
    this.productService.getAllProduct().then(
      (coreData) => {
        console.log('%c getAllProduct', 'color: blue;', coreData.data.items);
        console.log('getAllProduct', coreData.data.items);
        //add to top
        coreData.data.items.forEach((item: any) => {
          // let productCategory = new Category(item.category.CategoryId, item.category.CategoryName, item.category.CategoryDescription)
          let productCategories: Category[] = [];
          item.category.forEach((itemCategory: any) => {
            let category = new Category(
              itemCategory.CategoryId,
              itemCategory.CategoryName,
              itemCategory.CategoryDescription
            );
            productCategories.unshift(category);
          });
          let productAttributes: Attribute[] = [];
          item.attributes.forEach((itemAttribute: any) => {
            let attribute = new Attribute(
              itemAttribute.AttributeId,
              itemAttribute.AttributeName,
              itemAttribute.AttributeDescription,
              itemAttribute.AttributeImage
            );
            productAttributes.unshift(attribute);
          });
          let product = new Product(
            item.ProductId,
            item.ProductName,
            productCategories[0],
            item.Price,
            '',
            '',
            item.ProductImage,
            productAttributes
          );
          let voucher = new Voucher();
          let discountProduct = new DiscountProduct(
            item.ProductId,
            product,
            voucher
          );
          this.listProductCore.unshift(discountProduct)
        });

        // console.table(this.listProductCore);

        this.listProduct = this.listProductCore;
        this.listProductSearched = this.listProductCore;
        // console.table(this.listProduct);
        if (this.listProduct.length == 0) {
          this.notifier.notify('error', 'Lỗi hiển thị list sản phẩm!');
        }
        // this.listProduct = this.removeUnwantedProductFromList(this.listProduct)
        this.isLoading.next(true);
        this.listPages();
      },
      (error) => {
        this.notifier.notify('error', 'Lỗi hiển thị list sản phẩm!');
      }
    );
    
    console.log(this.listProductSearched);
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
   * @param  {any} product
   */
  checkFavorite(product: any) {
    // console.table(this.listProduct);

    let listProductFavorite: DiscountProduct[] = [];

    this.favoriteProductService
      .getFavoriteProduct(this.authService.userModel.customer?.customerId)
      .then((data) => {
        console.log('getFavoriteProduct');
        console.log(data);

        listProductFavorite = data;
        this.isLoading.next(true);
        for (let item of listProductFavorite) {
          if (item._product?._productId == product.product.productId) {
            console.log('listProductFavorite: product da ton tai');
            this.selectedFavoriteIndex = product.product.productId;

            return;
          }
        }
        console.log('listProductFavorite: product chua ton tai');
        this.selectedFavoriteIndex = -1;
      });
  }

  /**
   * Add product to customer favorite list
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
            "Đã xóa '" + product.product.name + "' khỏi sản phẩm yêu thích!"
          );
          return;
        } else {
          console.log('listProductFavorite: product chua ton tai');
          //add mon an vao list favorite
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
            "Sản phẩm '" +
              product.product.name +
              "' đã được thêm vào yêu thích!"
          );
          return;
        }
      });
  }
}
