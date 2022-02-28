import { Component, OnInit } from '@angular/core';
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
import { ProductController } from 'src/app/controller/ProductController';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  productController: ProductController = new ProductController();

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

  ngOnInit(): void {
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


  /**
   * lam viec voi favorite
   */
  loadProductFavorite() {
    this.favoriteProductService.getFavoriteProduct(this.userModel.customer?.customerId).then(data => {
      console.log("getFavoriteProduct");
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
    console.table(this.listProduct)

    let listProductFavorite: DiscountProduct[] = []

    this.favoriteProductService.getFavoriteProduct(this.userModel.customer?.customerId).then(data => {
      console.log("getFavoriteProduct");
      console.log(data);

      listProductFavorite = data;
      this.isLoading.next(true);
      for (let item of listProductFavorite) {
        if (item._product?._productId == product.product.productId) {
          console.log("listProductFavorite: product da ton tai");
          this.selectedFavoriteIndex = product.product.productId;


          return;
        }
      }
      console.log("listProductFavorite: product chua ton tai");
      this.selectedFavoriteIndex = -1;
    });
  }
  /**
   * update favorite product list to session
   */
  updateFavorite() {
    localStorage.setItem('listProductFavorite', JSON.stringify(this.listProductFavorite));
  }

  /**
   * Add product to customer favorite list
   * @param  {any} product
   */
  addFavorite(product: any) {
    this.favoriteProductService.getFavoriteProduct(this.userModel.customer?.customerId).then(data => {
      console.log("getFavoriteProduct");
      console.log(data);
      this.listProductFavorite = data;
      this.isLoading.next(true);
      const idIndex = this.listProductFavorite.findIndex(productFavoriteItem => productFavoriteItem._product?._productId == product.product.productId);
      if (idIndex != -1) {
        console.log("listProductFavorite: product da ton tai");
        //remove mon an khoi list favorite
        this.favoriteProductService.removeFavoriteProduct(this.userModel.customer?.customerId, product.product.productId).then(data => {
          console.log("this.favoriteProductService.removeFavoriteProduct");
          console.log(data);
          console.log("idIndex");
          console.log(idIndex);
        });
        this.listProductFavorite.splice(idIndex, 1);
        this.updateFavorite();
        this.notifier.notify('success', "Đã xóa '" + product.product.name + "' khỏi sản phẩm yêu thích!");
        return;
      } else {
        console.log("listProductFavorite: product chua ton tai");
        //add mon an vao list favorite
        this.favoriteProductService.addFavoriteProduct(this.userModel.customer?.customerId, product.product.productId).then(data => {
          console.log("this.favoriteProductService.addFavoriteProduct");
          console.log(data);
        });
        this.listProductFavorite.push(product);
        this.updateFavorite();
        this.notifier.notify('success', "Sản phẩm '" + product.product.name + "' đã được thêm vào yêu thích!");
        return;
      }
    });
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
   * @param  {DiscountProduct|any} product
   */
  viewDetail(product: DiscountProduct | any) {
    this.router.navigate(['/detail'], { queryParams: { DiscountProductId: product.DiscountProductId } });
  }
  /**
   * @param  {any} item
   */
  priceAfterDiscount(item?: DiscountProduct) {
    try {
      if (item?._voucher) {
        let priceAfterDiscount: any = Math.floor(item?._product?._price - (item?._product?._price * item._voucher._discountPct) / 100);
        if (!(priceAfterDiscount instanceof Number)){
          var errorIn : Error = new Error("Giá / Voucher không hợp lệ!");
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
  removeVietnameseTones(str: any) {
    str = str.trim().toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
  }
  /**
   * @param  {any} txtSearch
   * @param  {any} txtProduct
   */
  comparionName(txtSearch: any, txtProduct: any) {
    txtSearch = this.removeVietnameseTones(txtSearch);
    txtProduct = this.removeVietnameseTones(txtProduct);
    return txtProduct.indexOf(txtSearch) > -1;
  }
  /**
   * @param  {any} listCate
   * @param  {any} txtCategory
   */
  comparionCategory(listCate: any, txtCategory: any) {
    return txtCategory.indexOf(listCate) > -1;
  }
  getPrice(price: any) {
    return Number(Math.round(price)).toLocaleString();
  }
}
