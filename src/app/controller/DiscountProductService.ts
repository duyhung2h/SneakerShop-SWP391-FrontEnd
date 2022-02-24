import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Attribute } from '../model/Attribute';
import { Category } from '../model/Category';
import { DiscountProduct } from "../model/DiscountProduct";
import { Product } from '../model/Product';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Access-Control-Allow-Origin':'http://localhost:4200',
    'Authorization':'authkey',
    'userid':'1'
  })
};

@Injectable({
  providedIn: 'root'
})
export class DiscountProductService {
  constructor(private http: HttpClient) {
    
  }
  getAllOfflineProduct() {
    let lorem = " ipsum dolor sit amet consectetur adipisicing elit. Minima voluptatum velit mollitia dolorem facilis suscipit cumque, molestias ut ex magni natus laudantium totam quisquam odit consectetur reprehenderit non quae vitae? ipsum dolor sit amet consectetur adipisicing elit. Minima voluptatum velit mollitia dolorem facilis suscipit cumque, molestias ut ex magni natus laudantium totam quisquam odit consectetur reprehenderit non quae vitae?";
    let listProduct: DiscountProduct[];
    //test data
    let attribute1 = new Attribute();
    attribute1._attributeId = 1;
    attribute1._attributeName = "Cay";

    let product1 = new Product();
    product1._productId = 1;
    product1._name = 'name1';
    product1._category = new Category;
    product1._price = 20000;
    product1._description = 'description1' + lorem;
    product1._status = 'con hang'
    product1._image = 'product-1.jpg'
    product1._attributes = [attribute1];


    let product2 = new Product();
    product2._productId = 2;
    product2._name = 'name2';
    product2._category = new Category;
    product2._price = 20000;
    product2._description = 'description2' + lorem;
    product2._status = 'het hang'
    product2._image = 'product-2.jpg'
    product2._attributes = [attribute1];

    let product3 = new Product();
    product3._productId = 3;
    product3._name = 'name3';
    product3._category = new Category;
    product3._price = 20000;
    product3._description = 'description3' + lorem;
    product3._status = 'het hang'
    product3._image = 'product-3.jpg'
    product3._attributes = [attribute1];

    let product4 = new Product();
    product4._productId = 4;
    product4._name = 'name4';
    product4._category = new Category;
    product4._price = 20000;
    product4._description = 'description4' + lorem;
    product4._status = 'het hang'
    product4._image = 'product-4.jpg'
    product4._attributes = [attribute1];


    let discountproduct1 = new DiscountProduct();
    discountproduct1._discountProductId = 1;
    discountproduct1._product = product1


    let discountproduct2 = new DiscountProduct();
    discountproduct2._discountProductId = 2;
    discountproduct2._product = product2


    let discountproduct3 = new DiscountProduct();
    discountproduct3._discountProductId = 3;
    discountproduct3._product = product3


    let discountproduct4 = new DiscountProduct();
    discountproduct4._discountProductId = 4;
    discountproduct4._product = product4

    listProduct = [discountproduct1, discountproduct2, discountproduct3, discountproduct4, discountproduct1, discountproduct2, discountproduct3, discountproduct4];
    return listProduct;
  }

  async getAllProduct() {
    console.log("%c Call API :", 'color: blue;', (`${environment.apiUrl}api/product/get-all?page=2&pageSize=5&search=`))
    return await lastValueFrom(this.http.get<any>
      (`${environment.apiUrl}api/product/get-all?page=2&pageSize=5&search=`));
  }

  async getBestSellerProduct() {
    //   return await this.getAllOfflineProduct();
    return await this.http.get<DiscountProduct[]>
      (`${environment.apiUrl}DiscountPro/get-product-BestSeller`).toPromise();
  }
  async getMostOrderedProduct(customerId: any) {
    //   return await this.getAllOfflineProduct();
    return await this.http.get<DiscountProduct[]>
      (`${environment.apiUrl}DiscountPro/get-6-product-mostByCus/${customerId}`).toPromise();
  }
  async getRecentlyOrderedProduct(customerId: any) {
    //   return await this.getAllOfflineProduct();
    return await this.http.get<DiscountProduct[]>
      (`${environment.apiUrl}DiscountPro/get-6-product-nearByCus/${customerId}`).toPromise();
  }
  async getSuggestedProduct(customerId: any) {
    //   return await this.getAllOfflineProduct();
    return await this.http.get<DiscountProduct[]>
      (`${environment.apiUrl}DiscountPro/get-product-suggest-ByCustomerId/${customerId}`).toPromise();
  }
}
