import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CartController } from 'src/app/controller/CartController';
import { TextController } from 'src/app/controller/TextController';
import { OrderDetail } from "src/app/model/OrderDetail";

@Component({
  selector: 'app-ordereditemlist',
  templateUrl: './ordereditemlist.component.html',
  styleUrls: ['./ordereditemlist.component.css']
})
export class OrdereditemlistComponent implements OnInit {

  // controller declare
  cartController: CartController = new CartController(
    this.router,
    this.notifier
  );
  listCart: OrderDetail[] = []
  
  textController: TextController = new TextController();
  constructor(
    private router: Router,
    private notifier: NotifierService
  ) {
    window.scroll(0, 0);
  }
  ngOnInit(): void {
    
  }
}
