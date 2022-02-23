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
    attribute1.attributeId = 1;
    attribute1.attributeName = "Cay";

    let product1 = new Product();
    product1.productId = 1;
    product1.name = 'name1';
    product1.category = new Category;
    product1.price = 20000;
    product1.description = 'description1' + lorem;
    product1.status = 'con hang'
    product1.image = 'product-1.jpg'
    product1.attributes = [attribute1];


    let product2 = new Product();
    product2.productId = 2;
    product2.name = 'name2';
    product2.category = new Category;
    product2.price = 20000;
    product2.description = 'description2' + lorem;
    product2.status = 'het hang'
    product2.image = 'product-2.jpg'
    product2.attributes = [attribute1];

    let product3 = new Product();
    product3.productId = 3;
    product3.name = 'name3';
    product3.category = new Category;
    product3.price = 20000;
    product3.description = 'description3' + lorem;
    product3.status = 'het hang'
    product3.image = 'product-3.jpg'
    product3.attributes = [attribute1];

    let product4 = new Product();
    product4.productId = 4;
    product4.name = 'name4';
    product4.category = new Category;
    product4.price = 20000;
    product4.description = 'description4' + lorem;
    product4.status = 'het hang'
    product4.image = 'product-4.jpg'
    product4.attributes = [attribute1];


    let discountproduct1 = new DiscountProduct();
    discountproduct1.discountProductId = 1;
    discountproduct1.product = product1


    let discountproduct2 = new DiscountProduct();
    discountproduct2.discountProductId = 2;
    discountproduct2.product = product2


    let discountproduct3 = new DiscountProduct();
    discountproduct3.discountProductId = 3;
    discountproduct3.product = product3


    let discountproduct4 = new DiscountProduct();
    discountproduct4.discountProductId = 4;
    discountproduct4.product = product4

    listProduct = [discountproduct1, discountproduct2, discountproduct3, discountproduct4, discountproduct1, discountproduct2, discountproduct3, discountproduct4];
    return listProduct;
  }

  async getAllProduct() {
    console.log("%c Call API :", 'color: blue;', (`${environment.apiUrl}api/product/get-all?page=2&pageSize=5&search=`))
    return await lastValueFrom(this.http.get<DiscountProduct[]>
      (`${environment.apiUrl}api/product/get-all?page=2&pageSize=5&search=`, httpOptions));
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
