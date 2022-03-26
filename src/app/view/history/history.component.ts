import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HistoryController } from 'src/app/controller/HistoryController';
import { AuthService } from 'src/app/db/auth.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent extends HistoryController implements OnInit {

  constructor(http: HttpClient, authService: AuthService) {
    super(http, authService)
   }

  ngOnInit(): void {
  }

}
