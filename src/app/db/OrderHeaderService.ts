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

    let orderHeaderData: {
      productId: any;
      quantity: any;
      size: any;
      color: any;
    }[] = [];
    orderHeader?._listOrderDetail?.forEach((order: OrderDetail) => {
      let orderData = {
        productId: order?._discountProduct?._product?._productId,
        quantity: order?._orderQuantity,
        size: order?._size,
        color: order?._color,
      };
      console.log(orderData);
      orderHeaderData.unshift(orderData);
    });

    // order all

    let requestOrderHeader = {
      customerName: orderHeader._customerName,
      customerPhone: orderHeader._customerPhone,
      shipToAddress: orderHeader._shiptoAddress,
      items: orderHeaderData,
    };
    let requestOrderHeader2 = JSON.stringify(requestOrderHeader);
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
  async getOrderHeaderById(orderonlId: number) {
    let listOrderHeader: OrderHistory[] = [];
    try {
      let orderHeader = await lastValueFrom(
        this.http.get<any>(
          `${environment.apiUrl}api/order/my-orders/${orderonlId}`,
          { headers: this.authService.headers }
        )
      );
    } catch {

    }
  }

  async getAllOrderHeader() {
    let listOrderHeader: OrderHistory[] = [];
    try {
      await lastValueFrom(
        this.http.get<any>(
          `${environment.apiUrl}api/order/my-orders?page=1&pageSize=999`,
          { headers: this.authService.headers }
        )
      ).then((data) => {
        console.log(data);
        console.log(data.data.items);
        data.data.items.forEach(
          (orderHistoryData: {
            OrderId: number | undefined;
            CustomerId: number | undefined;
            CustomerName: string | undefined;
            CustomerPhone: string | undefined;
            OrderDate: Date | undefined;
            Status: number | undefined;
            ShipToAddress: string | undefined;
          }) => {
            let orderDetails: OrderDetail[] = [];
            // orderHistoryData.orderDetails.forEach((orderDetailData) => {
            //   let orderDetail = new OrderDetail(orderDetailData.);
            //   orderDetails.unshift(orderDetail)
            // });
            // orderHistory
            let orderHistory = new OrderHistory(
              0,
              0,
              '',
              new OrderHeader(
                orderHistoryData.OrderId,
                orderHistoryData.CustomerId,
                orderHistoryData.CustomerName,
                orderHistoryData.CustomerPhone,
                orderHistoryData.OrderDate,
                orderHistoryData.Status,
                orderHistoryData.ShipToAddress,
                orderDetails
              )
            );
            listOrderHeader.unshift(orderHistory);
          }
        );
      });
    } catch {}
    return listOrderHeader;
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
