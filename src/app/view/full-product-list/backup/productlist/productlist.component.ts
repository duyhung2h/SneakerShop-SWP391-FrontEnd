import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from "rxjs";
import { UserModel } from 'src/app/model/UserModel';
import { AuthService } from 'src/app/controller/auth.service';
import { CategoryService } from 'src/app/controller/CategoryService';
import { DiscountProductService } from 'src/app/controller/DiscountProductService';
import { FavoriteProductService } from 'src/app/controller/FavoriteProductService';
import { Category } from "src/app/model/Category";
import { DiscountProduct } from "src/app/model/DiscountProduct";
import { OrderDetail } from "src/app/model/OrderDetail";
import { NotifierService } from 'angular-notifier';
declare var $: any;

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit {

  skip = 0;
  skipRecent = 0;
  pageSize = 9;
  pageSizeRecent = 3;


  listPage: number[] = [];
  txtSearch: any;
  formGroup = new FormGroup({ search: new FormControl() });
  sortCategory = [{ id: 0, name: "Tên" }, { id: 1, name: "Giá" }];
  sortPriceCategory = [{ id: 0, name: "Tăng dần" }, { id: 1, name: "Giảm dần" }];
  sortNameCategory = [{ id: 0, name: "A-Z" }, { id: 1, name: "Z-A" }];

  userModel: UserModel
  guestIsViewing = false;


  listProductRecentlyOrdered: Discountproduct[] = [];
  listPageRecentlyOrdered: number[] = [];

  selectedCategoryIndex = 0
  selectedFavoriteIndex = -1


  selectedSortValue = 0;
  selectedSortNameValue = 0;
  selectedSortPriceValue = 0;

  listCart: OrderDetailON[] = []
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  listCategory: Category[] = [];
  listProduct: Discountproduct[] = [];
  listProductSearched: Discountproduct[] = [];
  listProductFavorite: Discountproduct[] = [];


  //   @ViewChild('carouselRecentlyOrdered') set carouselRecentlyOrdered(child: ElementRef) {
  //     if (this.guestIsViewing) {
  //         child.nativeElement.stuff = this.guestIsViewing;
  //    } 
  // }
  constructor(
    private router: Router, private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private discountProductService: DiscountProductService, private categoryService: CategoryService,
    private favoriteProductService: FavoriteProductService,
    private cdr: ChangeDetectorRef,
    private notifier: NotifierService) {


    this.listProduct = this.listProduct
    this.discountProductService
    //lay user, kiem tra xem la user hay guest
    try {
      this.userModel = this.authService.currentUserValue
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

    // // load data trong local storage, neu ko co thi tao moi
    try {
      this.listProduct = JSON.parse(localStorage.listProduct);
      this.removeUnwantedProductFromListSearched();
      if (this.listProduct != null) {
        this.listPages();
      }
    } catch (err) {
    }
    try {
      this.listProductSearched = JSON.parse(localStorage.listProduct);
    } catch (err) {
    }
    try {
      this.listCart = JSON.parse(localStorage.listOrder);
    } catch (err) {
    }
    try {
      this.listProductRecentlyOrdered = JSON.parse(localStorage.listProductRecentlyOrdered);
      if (this.listProductRecentlyOrdered != null) {
        this.listPagesRecentlyOrdered();
      }
    } catch (err) {
    }
    try {
      this.listCategory = JSON.parse(localStorage.listCategory);
      this.searchByParams()
    } catch (err) {
    }
    try {
      this.listProductFavorite = JSON.parse(localStorage.listProductFavorite);
    } catch (err) {
    }

    console.log("this.list");
    console.log(this.listProduct);

    console.log("this.listProductRecentlyOrdered");
    console.log(this.listProductRecentlyOrdered);

    // //tao moi neu localstorage ko co du lieu
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
      if (this.listCategory.length == 0) {
        try {
          this.loadCategory();
        } catch (err) {
        }
      }
    } catch (err) {
      this.loadCategory();
    }
    try {
      if (true) {
        try {
          this.loadProductRecentlyOrdered();
        } catch (err) {
        }
      }
    } catch (err) {
      this.loadProductRecentlyOrdered();
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

    //sap xep bo cuc page


    console.log("begin");





    this.selectedSortValue = 0
  }
  ngAfterContentChecked() {
    this.cdr.detectChanges();
    // call or add here your code
  }

  searchByParams() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.txtSearch = params['searchText'];
      this.formGroup.value.search = params['searchText'];

      let paramCategoryId = params['category'];
      console.log("this.listCategory");
      console.log(this.listCategory);
      this.selectedCategoryIndex = this.listCategory.findIndex(categoryItem => categoryItem.categoryId == paramCategoryId);
      if (!(this.selectedCategoryIndex > -1)) {
        this.selectedCategoryIndex = 0;
        //activate search (neu co query)
        this.onSortNameCategoryChange(this.selectedSortNameValue)
        this.searchBySearchBar()
      } else {
        this.searchByCategory(this.selectedCategoryIndex);
      }
      // this.searchByCategory(this.selectedCategoryIndex);


    });
  }


  loadData() {
    this.discountProductService.getAllProduct().then(data => {
      console.log("getAllProduct");
      console.log(data);

      this.listProductSearched = data;
      this.listProduct = data;
      this.removeUnwantedProductFromListSearched();
      this.isLoading.next(true);
      this.onSortNameCategoryChange(this.selectedSortNameValue)
      this.searchBySearchBar()
      this.listPages();

      localStorage.setItem('listProduct', JSON.stringify(this.listProduct));
    });
  }
  loadCategory() {
    this.categoryService?.getAllCategory().then(data => {
      this.listCategory = [];
      let categoryAll = new Category;
      categoryAll.categoryId = -1;
      categoryAll.categoryName = "Tất Cả"
      this.listCategory = data;
      this.listCategory.unshift(categoryAll)

      console.log("this.listCategory");
      console.log(this.listCategory);

      localStorage.setItem('listCategory', JSON.stringify(this.listCategory))
      this.searchByParams()
    });
  }
  loadProductRecentlyOrdered() {
    if (!this.guestIsViewing) {
      this.discountProductService?.getRecentlyOrderedProduct(this.userModel.customer?.customerId).then(data => {
        // localStorage.listProductRecentlyOrdered = null;
        this.listProductRecentlyOrdered = data;
        this.isLoading.next(true);
        // this.listPagesRecentlyOrdered();
        console.log("this.listProductRecentlyOrdered");
        console.log(this.listProductRecentlyOrdered);
        localStorage.setItem('listProductRecentlyOrdered', JSON.stringify(data))
      });
    }
  }
  pageChange(index: any) {
    this.skip = index * this.pageSize;
  }

  listPages() {
    let i = 0;
    let add = 0;
    this.listPage = []
    for (i; i < this.listProductSearched.length; i++) {
      if (i % this.pageSize == 0) {
        this.listPage.push(add);
        add++;
      }
    }
  }
  listPagesRecentlyOrdered() {
    let i = 0;
    let add = 0;
    for (i; i < this.listProductRecentlyOrdered.length; i++) {
      if (i % this.pageSizeRecent == 0) {
        this.listPageRecentlyOrdered.push(add);
        add++;
      }
    }
  }

  ngAfterViewInit() {
    this.formGroup.value.search = this.txtSearch


    //latest-product__slider
    $(".latest-product__slider").owlCarousel({
      loop: true,
      margin: 0,
      items: 1,
      dots: false,
      nav: true,
      navText: ["<span class='fa fa-angle-left'><span/>", "<span class='fa fa-angle-right'><span/>"],
      smartSpeed: 1200,
      autoHeight: false,
      autoplay: true
    });

    //product__discount__slider
    $(".product__discount__slider").owlCarousel({
      loop: true,
      margin: 0,
      items: 3,
      dots: true,
      smartSpeed: 1200,
      autoHeight: false,
      autoplay: true,
      responsive: {

        320: {
          items: 1,
        },

        480: {
          items: 2,
        },

        768: {
          items: 2,
        },

        992: {
          items: 3,
        }
      }
    });

    //price slide range
    var rangeSlider = $(".price-range"),
      minamount = $("#minamount"),
      maxamount = $("#maxamount"),
      minPrice = rangeSlider.data('min'),
      maxPrice = rangeSlider.data('max');
    rangeSlider.slider({
      range: true,
      min: minPrice,
      max: maxPrice,
      values: [minPrice, maxPrice],
      // slide: function (event, ui) {
      //   minamount.val('$' + ui.values[0]);
      //   maxamount.val('$' + ui.values[1]);
      // }
    });
    minamount.val('$' + rangeSlider.slider("values", 0));
    maxamount.val('$' + rangeSlider.slider("values", 1));

  }

  ngOnInit(): void {
    window.scroll(0, 400);
  }


  //lam viec voi favorite

  loadProductFavorite() {
    // this.discountProductService.getFavoriteProduct(this.userModel.customer?.customerId).then(data => {
    this.favoriteProductService.getFavoriteProduct(this.userModel.customer?.customerId).then(data => {
      console.log("getFavoriteProduct");
      console.log(data);

      this.listProductFavorite = data;
      this.isLoading.next(true);

      this.updateFavorite();
    });
  }

  checkFavorite(product: any) {

    let listProductFavorite: Discountproduct[] = []

    // this.discountProductService.getFavoriteProduct(this.userModel.customer?.customerId).then(data => {
    this.favoriteProductService.getFavoriteProduct(this.userModel.customer?.customerId).then(data => {
      console.log("getFavoriteProduct");
      console.log(data);

      listProductFavorite = data;
      this.isLoading.next(true);
      for (let item of listProductFavorite) {
        if (item.product?.productId == product.product.productId) {
          console.log("listProductFavorite: mon an da ton tai");
          this.selectedFavoriteIndex = product.product.productId;


          return;
        }
      }
      console.log("listProductFavorite: mon an chua ton tai");
      this.selectedFavoriteIndex = -1;
      //add mon an vao list favorite
      // this.discountProductService.add
    });
  }

  updateFavorite() {
    localStorage.setItem('listProductFavorite', JSON.stringify(this.listProductFavorite));
  }

  addFavorite(product: any) {
    // this.discountProductService.getFavoriteProduct(this.userModel.customer?.customerId).then(data => {
    this.favoriteProductService.getFavoriteProduct(this.userModel.customer?.customerId).then(data => {
      console.log("getFavoriteProduct");
      console.log(data);
      console.log("this.userModel");
      console.log(this.userModel);
      this.isLoading.next(true);
      const idIndex = this.listProductFavorite.findIndex(productFavoriteItem => productFavoriteItem.product?.productId == product.product.productId);
      if (idIndex != -1) {
        console.log("listProductFavorite: mon an da ton tai");
        //remove mon an khoi list favorite

        this.favoriteProductService.removeFavoriteProduct(this.userModel.customer?.customerId, product.product.productId).then(data => {
          console.log("this.favoriteProductService.removeFavoriteProduct");
          console.log(data);
          console.log("idIndex");
          console.log(idIndex);
        });
        this.listProductFavorite.splice(idIndex, 1)
        this.updateFavorite();
        this.notifier.notify('success', "Đã xóa '" + product.product.name + "' khỏi món yêu thích!");
        return;
      } else {
        console.log("listProductFavorite: mon an chua ton tai");
        //add mon an vao list favorite
        this.favoriteProductService.addFavoriteProduct(this.userModel.customer?.customerId, product.product.productId).then(data => {
          console.log("this.favoriteProductService.addFavoriteProduct");
          console.log(data);
        });
        this.listProductFavorite.push(product)
        this.updateFavorite();
        this.notifier.notify('success', "Món ăn '" + product.product.name + "' đã được thêm vào yêu thích!");
        return;
      }
    });
  }

  //favorite: end


  onSortCategoryChange(value: any) {
    console.log(value)
    this.selectedSortValue = value

    if (this.selectedSortValue == 0) {
      this.onSortNameCategoryChange(this.selectedSortNameValue)
    }
    if (this.selectedSortValue == 1) {
      this.onSortPriceCategoryChange(this.selectedSortPriceValue)
    }
    // if(this.selectedSortValue == 2){
    //   this.onSortNameCategoryChange(this.selectedSortNameValue)
    // }

  }


  onSortPriceCategoryChange(value: any) {
    console.log(value)
    this.selectedSortPriceValue = value
    if (this.selectedSortPriceValue == 0) {
      //tang dan
      console.log("sort price tang dan");

      this.listProductSearched?.sort((a, b) => (a.product?.price > b.product?.price ? 1 : -1))
    } else {
      //giam dan
      console.log("sort price giam dan");

      this.listProductSearched?.sort((a, b) => (a.product?.price > b.product?.price ? -1 : 1))
    }
    // this.listProduct = [];
  }

  onSortNameCategoryChange(value: any) {
    console.log(value)
    this.selectedSortNameValue = value
    if (this.selectedSortNameValue == 0) {
      //A-Z
      console.log("sort A-Z");

      this.listProductSearched?.sort((a, b) => (a.product?.name > b.product?.name ? 1 : -1))
    } else {
      //Z-A
      console.log("sort Z-A");

      this.listProductSearched?.sort((a, b) => (a.product?.name > b.product?.name ? -1 : 1))
    }
    // this.listProduct = [];
  }


  addCart(product: any) {

    let index = -1;
    console.log("this.listCartProduct");
    console.log(this.listCart);
    try {
      // Try to run this code 
      this.listCart.forEach((item, i) => {
        if (item.discountproduct?.product?.productId == product.product.productId) { index = i; }
      })
    }
    catch (err) {
      // if any error, Code throws the error
      this.listCart = []
      console.log("is empty");
    }
    console.log(index)
    if (index > -1) {
      this.listCart[index].orderonlqty += 1;
      console.log("index > -1" + index);
      localStorage.setItem('listOrder', JSON.stringify(this.listCart));

      this.notifier.notify('success', "Đã thêm '" + product.product.name + "' vào giỏ hàng!");

    } else {
      const orderDetaiOn = new OrderDetailON();
      orderDetaiOn.orderdetailonlId = product.product.productId;
      orderDetaiOn.discountproduct = product;
      orderDetaiOn.orderonlqty = 1;
      if (product.voucher) {
        orderDetaiOn.price = product.product?.price
      } else {
        orderDetaiOn.price = product.product?.price
      }

      orderDetaiOn.discountPct = product?.voucher?.discountPct;
      orderDetaiOn.voucherCode = product?.voucher?.voucherCode;



      this.listCart.push(orderDetaiOn);
      localStorage.setItem('listOrder', JSON.stringify(this.listCart));
      console.log(JSON.parse(localStorage.listOrder));
      this.notifier.notify('success', "Đã thêm '" + product.product.name + "' vào giỏ hàng!");
    }
  }

  viewDetail(product: any) {
    this.router.navigate(['/detail'], { queryParams: { discountproductId: product.discountproductId } });
  }

  priceAfterDiscount(item: any) {
    if (item.voucher) {
      return Math.floor(item.product.price - (item.product.price * item.voucher.discountPct) / 100);
    } else {
      return item.product.price;
    }
  }


  //remove product with status = 0
  removeUnwantedProductFromListSearched() {
    this.listProduct.forEach((item, i) => {
      if (item.product?.status == 0) {
        this.listProduct.splice(i, 1);
      }
    });
  }


  //search tong
  searchBySearchBar() {
    this.searchCategory(this.selectedCategoryIndex)
    this.searchText()
    this.listPages()
  }
  searchByCategory(index: any) {
    this.searchCategory(index)
    this.searchText()
    this.listPages()
  }

  searchCategory(index: any) {
    console.log("searchCategory index");
    console.log(index);


    this.skip = 0;
    if (this.listCategory[index].categoryId == -1) {
      this.listProductSearched = this.listProduct;
    } else {

      this.listProductSearched = this.listProduct.filter(value =>
        this.comparionCategory(this.listCategory[index].categoryName, value.product?.category?.categoryName))
    }

    console.log("index");
    console.log(this.listCategory[index].categoryId);
    this.selectedCategoryIndex = index
  }
  searchText() {
    this.txtSearch = this.formGroup.value.search;
    this.txtSearch = this?.txtSearch?.trim()?.replace(/ + /g, " ");
    if (this.txtSearch == null) {
      console.log("this.txtSearch == null");

    }
    else {
      console.log("this.txtSearch != null");

      //sort by name
      if (this.selectedSortValue == 0) {
        this.listProductSearched = this.listProductSearched.filter(value =>
          this.comparionName(this.txtSearch, value.product?.name))
        this.onSortNameCategoryChange(this.selectedSortNameValue)
      }
      //sort by price
      if (this.selectedSortValue == 1) {
        this.listProductSearched = this.listProductSearched.filter(value =>
          this.comparionName(this.txtSearch, value.product?.name))
        this.onSortPriceCategoryChange(this.selectedSortPriceValue)
      }
    }
  }
  isCategoryActive(index: any) {
    if (index == this.selectedCategoryIndex) {
      // console.log("this.selectedCategoryIndex");
      // console.log(this.selectedCategoryIndex);
      return true;

    } else {
      // console.log("this.selectedCategoryIndex");
      // console.log(this.selectedCategoryIndex);
      return false
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

  comparionName(txtSearch: any, txtProduct: any) {
    txtSearch = this.removeVietnameseTones(txtSearch);
    txtProduct = this.removeVietnameseTones(txtProduct);
    return txtProduct.indexOf(txtSearch) > -1;
  }
  comparionCategory(listCate: any, txtCategory: any) {
    return txtCategory.indexOf(listCate) > -1;
  }



  getPrice(price: any) {
    return Number(Math.round(price)).toLocaleString();
  }

}
