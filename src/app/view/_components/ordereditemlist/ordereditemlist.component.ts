import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { CartController } from 'src/app/controller/CartController';
import { TextController } from 'src/app/controller/TextController';
import { OrderDetail } from "src/app/model/OrderDetail";
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ordereditemlist',
  templateUrl: './ordereditemlist.component.html',
  styleUrls: ['./ordereditemlist.component.css']
})
export class OrdereditemlistComponent extends CartController implements OnInit {
  textController: TextController = new TextController();
  environment = environment
  constructor(
    router: Router,
    notifier: NotifierService
  ) {
    super(router, notifier);
    window.scroll(0, 0);
  }
  ngOnInit(): void {
    
  }
}
