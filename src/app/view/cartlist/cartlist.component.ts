import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cartlist',
  templateUrl: './cartlist.component.html',
  styleUrls: ['./cartlist.component.css']
})
export class CartlistComponent implements OnInit {

  constructor() { 
    window.scroll(0, 0);}

  ngOnInit(): void {
  }

}
