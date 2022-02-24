import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { DiscountProduct } from '../model/DiscountProduct';



@Injectable({
  providedIn: 'root'
})



export class FavoriteProductService {
  
  constructor(private http: HttpClient) {
  }

  async getFavoriteProduct(customerId: any) {
    //   return await this.getAllOfflineProduct();
        return await lastValueFrom<DiscountProduct[]>(this.http.get<DiscountProduct[]>
          (`${environment.apiUrl}api/favorite/my-favorites?customerId=${customerId}`));
  }
  async addFavoriteProduct(customerId: any, productId: any) {
    //   return await this.getAllOfflineProduct();
        return await this.http.get<DiscountProduct[]>
        (`${environment.apiUrl}customer/createPrivateMenu/${customerId}/${productId}`).toPromise();
  }
  async removeFavoriteProduct(customerId: any, productId: any) {
    //   return await this.getAllOfflineProduct();
        return await this.http.delete<DiscountProduct[]>
        (`${environment.apiUrl}customer/delete/${productId}/${customerId}`).toPromise();
  }
}
