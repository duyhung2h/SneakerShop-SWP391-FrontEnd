import { FormControl, FormGroup } from '@angular/forms';
import { Category } from 'src/app/model/Category';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from 'src/app/db/CategoryService';
import { DiscountProduct } from 'src/app/model/DiscountProduct';
import { ProductController } from './ProductController';
import { TextController } from './TextController';

export class CategoryController {
  txtSearch: any;
  listProductSearchedIsLoaded = false;
  listProductSearched: any = [];
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
  selectedCategoryName = '';
  selectedFavoriteIndex = -1;

  selectedSortValue = 0;
  selectedSortNameValue = 0;
  selectedSortPriceValue = 0;

  paramCategoryId = -1;
  listCategory: Category[] = [];

  textController: TextController = new TextController();
  
  /**
   * Category controller that fetch a list of Categories through CategoryService, 
   * and handle product list sorting and searching
   * 
   * This section declare services
   *
   * @param activatedRoute
   * @param categoryService
   * @param productController
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    public productController: ProductController
  ) {
    this.productController.router.routeReuseStrategy.shouldReuseRoute = () =>
      false;
    this.activatedRoute.queryParams.subscribe((params) => {
      this.txtSearch =
        params['searchText'] === undefined ? '' : params['searchText'];
      this.formGroup.value.search = params['searchText'];
      this.paramCategoryId =
        params['selectedCategoryIndex'] === undefined
          ? -1
          : params['selectedCategoryIndex'];
      this.selectedSortValue =
        params['selectedSortValue'] === undefined
          ? 0
          : params['selectedSortValue'];
      this.selectedSortNameValue =
        params['selectedSortNameValue'] === undefined
          ? 0
          : params['selectedSortNameValue'];
      this.selectedSortPriceValue =
        params['selectedSortPriceValue'] === undefined
          ? 0
          : params['selectedSortPriceValue'];
      console.log(params['selectedSortValue']);
    });

    console.log(this.selectedSortValue);
    this.loadAsyncData();
  }

  /**
   * Load product data from ProductController first and then load category data from API through CategoryService 
   */
  async loadAsyncData() {
    this.listProductSearched = await this.productController.loadData();
    console.log(this.listProductSearched);

    await this.loadCategory();
    this.searchByParams();

    console.log('begin');
    this.searchBySearchBar();
  }

  /**
   * search by text
   */
  searchByParams() {
    console.log('this.listCategory');
    console.log(this.listCategory);
    console.log(this.paramCategoryId);
    this.selectedCategoryIndex = this.listCategory?.findIndex(
      (categoryItem) => categoryItem._categoryId == this.paramCategoryId
    );
    console.log(this.selectedCategoryIndex);
    if (this.paramCategoryId > -1) {
      console.log(this.selectedCategoryIndex);
      this.searchByCategory(this.selectedCategoryIndex);
    } else {
      this.paramCategoryId = -1;
      this.selectedCategoryIndex = 0;
      console.log(this.selectedCategoryIndex);
      this.searchByCategory(this.selectedCategoryIndex);
    }
  }
  /**
   * Get the current selected category name based on selected category index, to be shown in the dropdown list
   * 
   * @param categoryIndex 
   * @returns 
   */
  getSelectedCategoryName(categoryIndex: number) {
    console.log(this.listCategory);
    console.log(categoryIndex);
    let categoryName = '';
    this.listCategory.forEach((itemCategory: Category) => {
      if (itemCategory._categoryId == categoryIndex) {
        console.log(itemCategory);
        categoryName = itemCategory._categoryName;
      }
    });
    return categoryName;
  }
  /**
   * load all catrgories from API through CategoryService
   */
  async loadCategory() {
    await this.categoryService
      ?.getAllCategory()
      .then((dataCore: Category[]) => {
        // this.listCategory = [];
        this.listCategory = dataCore;

        console.log('this.listCategory');
        console.log(this.listCategory);
        this.selectedCategoryName = this.getSelectedCategoryName(
          this.paramCategoryId
        );
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
  }

  /**
   * Sort and filter product by price on category change
   *
   * @param value
   */
  onSortPriceCategoryChange(value: any) {
    console.log(value);
    console.log(this.listProductSearched);
    this.selectedSortPriceValue = value;
    if (this.selectedSortPriceValue == 0) {
      //tang dan
      console.log('sort price tang dan');
      console.log(typeof this.listProductSearched[0]._product?._price);
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
    this.refreshProductList();
  }

  /**
   * Sort and filter product by name on category change
   *
   * @param value
   */
  onSortNameCategoryChange(value: any) {
    console.log(value);
    console.log(this.listProductSearched);
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
    this.refreshProductList();
  }

  /**
   * Load table list number according to number of product shown per page and number of products
   */
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
      console.log(this.selectedSortValue);
      checkLoaded(
        this.listProductSearchedIsLoaded,
        JSON.parse(localStorage['loadedListProductSearched'])
      );
    });
  }
  /**
   * Search item by text
   */
  searchBySearchBar() {
    console.log(this.listProductSearched);
    try {
      this.searchByCategory(this.selectedCategoryIndex);
    } catch {
      this.productController.notifier.notify(
        'error',
        'Lỗi hiển thị thể loại2!'
      );
    }
    try {
      this.searchText();
    } catch {
      this.productController.notifier.notify('error', 'Lỗi tìm kiếm!');
    }
    this.listPages();

    this.listProductSearchedIsLoaded = true;
    console.log(this.listProductSearched);
    localStorage.setItem(
      'loadedListProductSearched',
      JSON.stringify(this.listProductSearched)
    );
  }
  /**
   * Search item by category (full)
   *
   * @param index
   */
  searchByCategory(index: any) {
    this.searchCategory(index).then(() => {
      this.listPages();
      this.refreshProductList();
    });
  }

  /**
   * Search item by category
   *
   * @param index
   */
  async searchCategory(index: any) {
    console.log('searchCategory index');
    if (index == -1) {
      index = 0;
    }
    console.log(index);
    console.log(this.listCategory[index]);
    this.selectedCategoryIndex = index;
    this.paramCategoryId = this.listCategory[index]._categoryId;
    console.log(this.paramCategoryId);

    this.productController.skip = 0;
    if (this.listCategory[index]._categoryId == -1) {
      this.listProductSearched = this.productController.listProduct;
    } else {
      this.listProductSearched = this.productController.listProduct.filter(
        (value) =>
          this.textController.comparionCategory(
            this.listCategory[index]._categoryName,
            value._product?._category?._categoryName
          )
      );
    }

    console.log('index');
    console.log(this.listProductSearched);
    console.log(this.selectedCategoryIndex);
    this.searchText();
  }
  /**
   * Search item by Text
   *
   * @param index
   */
  searchText() {
    this.txtSearch = this?.txtSearch?.trim()?.replace(/ + /g, ' ');
    if (this.txtSearch == null) {
      console.log('this.txtSearch == null');
    } else {
      //sort by name ****
      console.log(this.listProductSearched);
      if (this.selectedSortValue == 0) {
        this.listProductSearched = this.listProductSearched.filter(
          (value: DiscountProduct) =>
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
        this.listProductSearched = this.listProductSearched.filter(
          (value: DiscountProduct) =>
            this.textController.comparisonNameEqual(
              this.txtSearch,
              value._product?._name
            )
        );
        this.onSortPriceCategoryChange(this.selectedSortPriceValue);
      }
    }
  }
/**
 * Refresh the page to get all the parameters
 */
  refreshProductList() {
    console.log(this.paramCategoryId);
    if (window.location.pathname == '/product-list') {
      this.productController.router
        .navigate(['/product-list'], {
          queryParams: {
            selectedCategoryIndex: this.paramCategoryId,
            selectedSortValue: this.selectedSortValue,
            selectedSortNameValue: this.selectedSortNameValue,
            selectedSortPriceValue: this.selectedSortPriceValue,
            searchText: this.txtSearch,
          },
        })
        .then(() => {
          console.log(
            '%c full product list refresh',
            'color: orange; background-color: #222222;'
          );
        });
    } else {
    }
  }
}
