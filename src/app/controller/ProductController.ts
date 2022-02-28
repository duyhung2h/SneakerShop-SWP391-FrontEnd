import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject } from 'rxjs';
import { Category } from 'src/app/model/Category';
import { DiscountProduct } from 'src/app/model/DiscountProduct'
import { OrderDetail } from 'src/app/model/OrderDetail';
import { UserModel } from 'src/app/model/UserModel';
import { AuthService } from 'src/app/controller/auth.service';
import { DiscountProductService } from 'src/app/controller/DiscountProductService';
import { FavoriteProductService } from 'src/app/controller/FavoriteProductService';

export class ProductController{
    listProduct: DiscountProduct[] = [];
    listProductCore: any[] = []
    listCategory: Category[] = [];
    listProductFavorite: DiscountProduct[] = [];
    listCart: OrderDetail[] = []
    public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    skip = 0;
    pageSize = 8;
    listPage: number[] = [];
    txtSearch: any;
    formGroup = new FormGroup({ search: new FormControl() });
  
  
    userModel: UserModel
    guestIsViewing = false;
  
  
    selectedFavoriteIndex = -1
  
    constructor(private productService: DiscountProductService,
      private authService: AuthService,
      private router: Router,
      private favoriteProductService: FavoriteProductService,
      private notifier: NotifierService) {
  
      //lay user, kiem tra xem la user hay guest
      try {
        this.userModel = this.authService.currentUserValue
        console.log("%c current user value", 'color: orange;')
        console.log({ "current user value": this.authService.currentUserValue })
        if (this.userModel != null) {
          this.guestIsViewing = false;
        } else {
          this.guestIsViewing = true;
        }
      } catch (error) {
        console.log("ERROR: Cannot get userModel")
        this.userModel = new UserModel
        this.guestIsViewing = true;
      }
      console.log("this.guestIsViewing")
      console.log(this.guestIsViewing)
  
  
  
  
      //tao moi neu localstorage ko co du lieu
      try {
        if (this.listProduct.length == 0) {
          try {
            this.loadData();
          } catch (err) {
          }
        }
      } catch (err) {
        this.loadData();
      }
      try {
        if (this.listProductFavorite.length == 0) {
          try {
            if (this.userModel != null) {
              this.loadProductFavorite();
            }
          } catch (err) {
          }
        }
      } catch (err) {
        if (this.userModel != null) {
          this.loadProductFavorite();
        }
      }
    }
  
  /**
   * Load product data
   */
   loadData() {
    this.productService.getAllProduct().then(coreData => {
      console.log("%c getAllProduct", 'color: blue;', coreData.data.items)
      console.log("getAllProduct", coreData.data.items)
      //add to top
      coreData.data.items.forEach((item: any) => {
        // let productCategory = new Category(item.category.CategoryId, item.category.CategoryName, item.category.CategoryDescription)
        let productCategories: Category[] = []
        item.category.forEach((itemCategory: any) => {
          let category = new Category(itemCategory.CategoryId, itemCategory.CategoryName, itemCategory.CategoryDescription)
          productCategories.unshift(category)
        })
        let productAttributes: Attribute[] = []
        item.attributes.forEach((itemAttribute: any) => {
          let attribute = new Attribute(itemAttribute.AttributeId, itemAttribute.AttributeName, itemAttribute.AttributeDescription, itemAttribute.AttributeImage)
          productAttributes.unshift(attribute)
        })
        let product = new Product(item.ProductId, item.ProductName, productCategories[0], item.Price, "", "", item.ProductImage, productAttributes)
        let voucher = new Voucher
        let discountProduct = new DiscountProduct(item.ProductId,
          product,
          voucher
        )
        console.log("add to list " + discountProduct._discountProductId)

        console.log(this.listProductCore.unshift(discountProduct))

      });

      console.table(this.listProductCore)

      this.listProduct = this.listProductCore
      console.table(this.listProduct)
      if (this.listProduct.length == 0) {
        this.notifier.notify('error', "Lỗi hiển thị list sản phẩm!")
      }
      // this.listProduct = this.removeUnwantedProductFromList(this.listProduct)
      this.isLoading.next(true)
      this.listPages()
    }, error => {
      this.notifier.notify('error', "Lỗi hiển thị list sản phẩm!")
    });
  }
}