import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { HistoryController } from 'src/app/controller/HistoryController';
import { AuthService } from 'src/app/db/auth.service';

@Component({
  selector: 'app-historylist',
  templateUrl: './historylist.component.html',
  styleUrls: ['./historylist.component.css'],
})
export class HistorylistComponent extends HistoryController implements OnInit {
  @ViewChild('dateInput') override dateInput: ElementRef;
  @ViewChild('listHistoryPaginator') override listHistoryPaginator: MatPaginator;
  constructor(
    http: HttpClient,
    authService: AuthService,
    cdr: ChangeDetectorRef,
    dateInput: ElementRef,
    listHistoryPaginator: MatPaginator,
    listHistoryDataSource: MatTableDataSource<any>,
    notifier: NotifierService,
    router: Router

  ) {
    super(http, authService, cdr, dateInput, listHistoryPaginator, listHistoryDataSource, notifier, router);
    this.dateInput = dateInput
    this.listHistoryPaginator = listHistoryPaginator
  }

  ngOnInit(): void {}
}
