import { FormControl, FormGroup } from '@angular/forms';
import { Category } from 'src/app/model/Category';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/controller/auth.service';
import { CategoryService } from 'src/app/controller/CategoryService';
import { DiscountProductService } from 'src/app/controller/DiscountProductService';
import { FavoriteProductService } from 'src/app/controller/FavoriteProductService';
import { DiscountProduct } from 'src/app/model/DiscountProduct';
import { NotifierService } from 'angular-notifier';
import { ProductController } from './ProductController';
import { TextController } from './TextController';

export class CategoryController {
  txtSearch: any;
  listProductSearchedIsLoaded = false;
  listProductSearched: any = []
  formGroup = new FormGroup({ search: new FormControl() });
  sortCategory = [
    { id: 0, name: 'Tên' },
    { id: 1, name: 'Giá' },
  ];
  sortPriceCategory = [
    { id: 0, name: 'Tăng dần' },
    { id: 1, name: 'Giảm dần' },
  ];
  sortNameCategory = [
    { id: 0, name: 'A-Z' },
    { id: 1, name: 'Z-A' },
  ];

  listProductChanging = false;

  selectedCategoryIndex: any = 0;
  selectedFavoriteIndex = -1;

  selectedSortValue = 0;
  selectedSortNameValue = 0;
  selectedSortPriceValue = 0;

  listCategory: Category[] = [];

  textController: TextController = new TextController();
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
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    public productController: ProductController
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.txtSearch = params['searchText'];
      this.formGroup.value.search = params['searchText'];
      this.selectedCategoryIndex = params['selectedCategoryIndex'];
      this.selectedSortValue = params['selectedSortValue'];
      this.selectedSortNameValue = params['selectedSortNameValue'];
      this.selectedSortPriceValue = params['selectedSortPriceValue'];

      let paramCategoryId = params['category'];
    }
    );
    this.loadAsyncData()
  }
  async loadAsyncData(){
    this.listProductSearched = await this.productController.loadData()
    console.log(this.listProductSearched)

    this.loadCategory();

    console.log('begin');
    this.selectedSortValue = 0;
    this.searchBySearchBar();
  }

  /**
   * search by text
   */
  searchByParams() {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.txtSearch = params['searchText'];
      this.formGroup.value.search = params['searchText'];
      this.selectedCategoryIndex = params['selectedCategoryIndex'];
      this.selectedSortValue = params['selectedSortValue'];
      this.selectedSortNameValue = params['selectedSortNameValue'];
      this.selectedSortPriceValue = params['selectedSortPriceValue'];

      let paramCategoryId = params['category'];
      console.log('this.listCategory');
      console.log(this.listCategory);
      this.selectedCategoryIndex = this.listCategory?.findIndex(
        (categoryItem) => categoryItem._categoryId == paramCategoryId
      );
      if (!(this.selectedCategoryIndex > -1)) {
        this.selectedCategoryIndex = 0;
        //activate search (neu co query)
        this.onSortNameCategoryChange(this.selectedSortNameValue);
        this.searchBySearchBar();
      } else {
        this.searchByCategory(this.selectedCategoryIndex);
      }
      // this.searchByCategory(this.selectedCategoryIndex);
    });
  }
  /**
   * load all catrgories
   */
  loadCategory() {
    this.categoryService?.getAllCategory().then((dataCore) => {
      this.listCategory = [];
      this.listCategory = dataCore;

      console.log('this.listCategory');
      console.log(dataCore);

      // localStorage.setItem('listCategory', JSON.stringify(this.listCategory));
      this.searchByParams();
    });
  }

  /**
   * Sort and filter product list on category change
   *
   * @param  {} value
   */
  onSortCategoryChange(value: any) {
    console.log(value);
    this.selectedSortValue = value;

    if (this.selectedSortValue == 0) {
      this.onSortNameCategoryChange(this.selectedSortNameValue);
    }
    if (this.selectedSortValue == 1) {
      this.onSortPriceCategoryChange(this.selectedSortPriceValue);
    }
    // if(this.selectedSortValue == 2){
    //   this.onSortNameCategoryChange(this.selectedSortNameValue)
    // }
  }

  /**
   * Sort and filter price on category change
   *
   * @param value
   */
  onSortPriceCategoryChange(value: any) {
    console.log(value);
    this.selectedSortPriceValue = value;
    if (this.selectedSortPriceValue == 0) {
      //tang dan
      console.log('sort price tang dan');

      this.listProductSearched?.sort((a: DiscountProduct, b: DiscountProduct) =>
        a._product?._price > b._product?._price ? 1 : -1
      );
    } else {
      //giam dan
      console.log('sort price giam dan');

      this.listProductSearched?.sort((a: DiscountProduct, b: DiscountProduct) =>
        a._product?._price > b._product?._price ? -1 : 1
      );
    }
    // this.productController.listProduct = [];
  }

  /**
   *
   *
   * @param value
   */
  onSortNameCategoryChange(value: any) {
    console.log(value);
    this.selectedSortNameValue = value;
    if (this.selectedSortNameValue == 0) {
      //A-Z
      console.log('sort A-Z');

      this.listProductSearched?.sort((a: DiscountProduct, b: DiscountProduct) =>
        a._product?._name > b._product?._name ? 1 : -1
      );
    } else {
      //Z-A
      console.log('sort Z-A');

      this.listProductSearched?.sort((a: DiscountProduct, b: DiscountProduct) =>
        a._product?._name > b._product?._name ? -1 : 1
      );
    }
    // this.productController.listProduct = [];
  }

  listPages() {
    let i = 0;
    let add = 0;
    this.productController.listPage = [];
    for (i; i < this.listProductSearched.length; i++) {
      if (i % this.productController.pageSize == 0) {
        this.productController.listPage.push(add);
        add++;
      }
    }
  }

  /**
   * Wait until all products are loaded and filtered, return the list
   *
   * @returns loaded product list
   */
  async getSearchedProducts() {
    return await new Promise((resolve) => {
      function checkLoaded(
        IsLoaded: any,
        listProductReturn: DiscountProduct[]
      ) {
        if (IsLoaded == undefined) {
          resolve(listProductReturn);
        } else {
          window.setTimeout(checkLoaded, 1000);
        }
      }
      checkLoaded(this.listProductSearchedIsLoaded, JSON.parse(localStorage['loadedListProductSearched']));
    });
  }
  /**
   * Search item by text
   */
  searchBySearchBar() {
    console.log(this.listProductSearched)
    try {
      this.searchCategory(this.selectedCategoryIndex);
    } catch {
      this.productController.notifier.notify('error', 'Lỗi hiển thị thể loại!');
    }
    try {
      this.searchText();
    } catch {
      this.productController.notifier.notify('error', 'Lỗi tìm kiếm!');
    }
    this.listPages();

    this.listProductSearchedIsLoaded = true;
    console.log(this.listProductSearched)
    localStorage.setItem('loadedListProductSearched', JSON.stringify(this.listProductSearched));
    // localStorage['loadedListProductSearched'] = JSON.stringify(this.listProductSearched)
  }
  /**
   * Search item by category
   *
   * @param index
   */
  searchByCategory(index: any) {
    this.searchCategory(index);
    this.searchText();
    this.listPages();
  }

  searchCategory(index: any) {
    console.log('searchCategory index');
    console.log(index);
    console.log(this.listCategory[index]);

    this.productController.skip = 0;
    if (this.listCategory[index]._categoryId == -1) {
      this.listProductSearched =
        this.productController.listProduct;
    } else {
      this.listProductSearched =
        this.productController.listProduct.filter((value) =>
          this.textController.comparionCategory(
            this.listCategory[index]._categoryName,
            value._product?._category?._categoryName
          )
        );
    }

    console.log('index');
    console.log(this.listCategory[index]._categoryId);
    this.selectedCategoryIndex = index;
  }
  searchText() {
    // this.txtSearch = this.formGroup.value.search;
    this.txtSearch = this?.txtSearch?.trim()?.replace(/ + /g, ' ');
    if (this.txtSearch == null) {
      console.log('this.txtSearch == null');
    } else {
      //sort by name
      console.log(this.listProductSearched);
      if (this.selectedSortValue == 0 || this.selectedSortValue == undefined) {
        this.selectedSortValue == 0;
        console.log(this.productController.listProduct);
        this.listProductSearched =
          this.listProductSearched.filter((value: DiscountProduct) =>
            this.textController.comparisonNameEqual(
              this.txtSearch,
              value._product?._name
            )
          );
        console.log(this.listProductSearched);
        this.onSortNameCategoryChange(this.selectedSortNameValue);
      }
      //sort by price
      if (this.selectedSortValue == 1) {
        this.listProductSearched =
          this.listProductSearched.filter((value: DiscountProduct) => {
            this.textController.comparisonNameEqual(
              this.txtSearch,
              value._product?._name
            );
          });
        this.onSortPriceCategoryChange(this.selectedSortPriceValue);
      }
    }
  }
}
