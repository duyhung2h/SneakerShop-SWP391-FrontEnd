import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Attribute } from '../model/Attribute';
import { Category } from '../model/Category';
import { DiscountProduct } from '../model/DiscountProduct';
import { Product } from '../model/Product';
import { Voucher } from '../model/Voucher';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    Authorization: 'authkey',
    userid: '1',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class DiscountProductService {
  static http: HttpClient;
  constructor(private http: HttpClient, private notifier: NotifierService) {
    this.http = http;
  }

  /**
   * Load only 1 product data by ID from API
   */
  static async loadProductById(productId: number): Promise<DiscountProduct> {
    let productCore: DiscountProduct = new DiscountProduct();
    let returnProduct: DiscountProduct = new DiscountProduct();
    await lastValueFrom(
      this.http.get<any>(`${environment.apiUrl}api/product/${productId}`)
    ).then(
      (coreData) => {
        console.log('%c getAllProduct', 'color: blue;', coreData.data);
        console.log('getAllProduct', coreData.data);
        productCore = coreData;
        //add to top
        coreData.data.forEach;
        let productCategory = new Category(
          coreData.dataCategoryId
          // coreData.datacategory.CategoryName,
          // coreData.datacategory.CategoryDescription
        );
        let productAttributes: Attribute[] = [];
        coreData.dataattributes.forEach((itemAttribute: any) => {
          let attribute = new Attribute(
            itemAttribute.AttributeId,
            itemAttribute.AttributeName,
            itemAttribute.AttributeDescription,
            itemAttribute.AttributeImage
          );
          productAttributes.unshift(attribute);
        });
        let product = new Product(
          coreData.dataProductId,
          coreData.dataProductName,
          productCategory,
          coreData.dataPrice,
          '',
          '',
          coreData.dataProductImage,
          productAttributes
        );
        let voucher = new Voucher();
        returnProduct = new DiscountProduct(
          coreData.dataProductId,
          product,
          voucher
        );
      },
      (error) => {
        // this.notifier.notify('error', 'Lỗi hiển thị list sản phẩm!');
      }
    );

    return returnProduct;
  }

  /**
   * Load product data from API
   */
  async getAllProduct() {
    console.log(
      '%c Call Product API :',
      'color: blue;',
      `${environment.apiUrl}api/product/get-all?page=2&pageSize=5&search=`
    );
    let listProductCore: DiscountProduct[] = [];
    await lastValueFrom(
      this.http.get<any>(
        `${environment.apiUrl}api/product/get-all?page=1&pageSize=9999&search=`
      )
    ).then(
      (coreData) => {
        console.log('%c getAllProduct', 'color: blue;', coreData.data.items);
        console.log('getAllProduct', coreData.data.items);
        //add to top
        coreData.data.items.forEach((item: any) => {
          let productCategory = new Category(
            item.CategoryId
            // item.category.CategoryName,
            // item.category.CategoryDescription
          );
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
            productCategory,
            item.Price,
            '',
            '',
            item.ProductImage,
            productAttributes
          );
          try {
            var voucher = new Voucher()
          voucher._voucherId = item.voucher.VoucherId
          voucher._discountPct = item.voucher.Discount_percentage
          voucher._quantity = item.voucher.Quantity
          } catch {
            var voucher = new Voucher();
            console.log('%c item.voucher error!', 'color:red;');
            console.log(item.ProductId);
            
            
          }
          let discountProduct = new DiscountProduct(
            item.ProductId,
            product,
            voucher
          );
          listProductCore.unshift(discountProduct);
        });
      },
      (error) => {
        this.notifier.notify('error', 'Lỗi hiển thị list sản phẩm!');
      }
    );

    return listProductCore;
    // (`${environment.apiUrl}api/product/get-all?page=1&pageSize=111&search=`));
  }

  async getBestSellerProduct() {
    //   return await this.getAllOfflineProduct();
    return await this.http
      .get<DiscountProduct[]>(
        `${environment.apiUrl}DiscountPro/get-product-BestSeller`
      )
      .toPromise();
  }
  async getMostOrderedProduct(customerId: any) {
    //   return await this.getAllOfflineProduct();
    return await this.http
      .get<DiscountProduct[]>(
        `${environment.apiUrl}DiscountPro/get-6-product-mostByCus/${customerId}`
      )
      .toPromise();
  }
  async getRecentlyOrderedProduct(customerId: any) {
    //   return await this.getAllOfflineProduct();
    return await this.http
      .get<DiscountProduct[]>(
        `${environment.apiUrl}DiscountPro/get-6-product-nearByCus/${customerId}`
      )
      .toPromise();
  }
  async getSuggestedProduct(customerId: any) {
    //   return await this.getAllOfflineProduct();
    return await this.http
      .get<DiscountProduct[]>(
        `${environment.apiUrl}DiscountPro/get-product-suggest-ByCustomerId/${customerId}`
      )
      .toPromise();
  }
}
