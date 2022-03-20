import { Component, OnInit, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { OrderController } from 'src/app/controller/OrderController';
import { AuthService } from 'src/app/db/auth.service';
import { OrderHeaderService } from 'src/app/db/OrderHeaderService';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent extends OrderController implements OnInit {
  constructor(
    orderHeaderService: OrderHeaderService,
    dialog: MatDialog,
    router: Router,
    authService: AuthService,
    notifier: NotifierService,
  ) {
    super(orderHeaderService, dialog, router, authService, notifier);
  }

  ngOnInit(): void {
  }

}
