import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { environment } from "../../environments/environment";
import { OrderHeader } from "../model/Order";
import { OrderHistory } from "../model/OrderHistory";

@Injectable({
  providedIn: 'root'
})
export class OrderHeaderService{
  constructor(private http: HttpClient) {
  }
  async createOrderHeader(orderHeader:OrderHeader) {
    console.log(orderHeader);
    console.log(this.http);
    
    
    return await lastValueFrom(
      this.http.post<OrderHeader>(
        `${environment.apiUrl}api/order`, orderHeader
      ))
  }
  async getAllOrderHeader(customerId: any) {
    return await this.http.get<OrderHistory[]>
    // (`${environment.apiUrl}orderheaderl/getOrderheaderlByCustomerId/${customerId}`).toPromise();
    (`${environment.apiUrl}feedback/get-allFeedbackOnl-CustomerId/${customerId}`).toPromise();
  }
  async getOrderHeaderById(orderonlId: any) {
    return await this.http.get<OrderHeader>
    (`${environment.apiUrl}orderheaderl/getOrderheaderl/${orderonlId}`).toPromise();
  }
  async updateOrderHeader(orderHeader:OrderHeader) {
    return await this.http.put<any>
    (`${environment.apiUrl}orderheaderl/updateOrderheaderl`,orderHeader).toPromise();
  }
  
  async updateFeedbackOn(orderHistory:OrderHistory) {
    return await this.http.put<any>
    (`${environment.apiUrl}feedback/updateFeedbackonl`,orderHistory).toPromise();
  }
}
