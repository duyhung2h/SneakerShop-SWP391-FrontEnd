import { HttpClient } from '@angular/common/http';
import { AuthService } from '../db/auth.service';
import { OrderHeaderService } from '../db/OrderHeaderService';
import { OrderHistory } from '../model/OrderHistory';

export class HistoryController extends OrderHeaderService {
  orderHistory: OrderHistory[] = [];

  constructor(http: HttpClient, authService: AuthService) {
    super(http, authService);
    this.loadHistoryList(this.orderHistory)
  }
  async loadHistoryList(orderHistory: OrderHistory[]) {
    await this.getAllOrderHeader().then((data) => {
        console.log(data);
        console.log(data.data.items);
    });
  }
}
