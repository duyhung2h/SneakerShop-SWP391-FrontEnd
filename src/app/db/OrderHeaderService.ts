import {
  HttpClient,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { OrderHeader } from '../model/Order';
import { OrderDetail } from '../model/OrderDetail';
import { OrderHistory } from '../model/OrderHistory';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrderHeaderService {
  constructor(private http: HttpClient, private authService: AuthService) {}
  async createOrderHeader(orderHeader: OrderHeader) {
    console.log(orderHeader);

    // order header items

    let orderHeaderData: { productId: any; quantity: any; size: any; color: any; }[] = [];
    orderHeader?._listOrderDetail?.forEach((order: OrderDetail) => {
      let orderData = {
        productId: order?._discountProduct?._product?._productId,
        quantity: order?._orderQuantity,
        size: order?._size,
        color: order?._color
      };
      console.log(orderData);
      orderHeaderData.unshift(orderData)
    });
    
    // order all

    let requestOrderHeader = {
      customerName: orderHeader._customerName,
      customerPhone: orderHeader._customerPhone,
      shipToAddress: orderHeader._shiptoAddress,
      items: orderHeaderData
    }
    let requestOrderHeader2 = JSON.stringify(requestOrderHeader)
    console.log(requestOrderHeader);
    console.log(requestOrderHeader2);
    

    return await lastValueFrom(
      this.http.post<OrderHeader>(
        `${environment.apiUrl}api/order`,
        requestOrderHeader2,
        { headers: this.authService.headers }
      )
    );
  }
  async getAllOrderHeader() {
    return await lastValueFrom(
      this.http.get<any>(
        `${environment.apiUrl}api/order/my-orders?page=1&pageSize=999`,
        { headers: this.authService.headers }
      )
    );
  }
  async getOrderHeaderById(orderonlId: any) {
    return await this.http
      .get<OrderHeader>(
        `${environment.apiUrl}orderheaderl/getOrderheaderl/${orderonlId}`
      )
      .toPromise();
  }
  async updateOrderHeader(orderHeader: OrderHeader) {
    return await this.http
      .put<any>(
        `${environment.apiUrl}orderheaderl/updateOrderheaderl`,
        orderHeader
      )
      .toPromise();
  }

  async updateFeedbackOn(orderHistory: OrderHistory) {
    return await this.http
      .put<any>(`${environment.apiUrl}feedback/updateFeedbackonl`, orderHistory)
      .toPromise();
  }
}
