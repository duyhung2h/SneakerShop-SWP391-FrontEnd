import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, ElementRef, Injectable } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../db/auth.service';
import { OrderHeaderService } from '../db/OrderHeaderService';
import { OrderHeader } from '../model/Order';
import { OrderDetail } from '../model/OrderDetail';
import { OrderHistory } from '../model/OrderHistory';
import { UserModel } from '../model/UserModel';

@Injectable()
export abstract class HistoryController extends OrderHeaderService {
  listHistory: OrderHistory[] = [];

  userModel: UserModel;
  customer: any;
  state: any;

  displayedColumns: String[] = [
    'position',
    'name',
    'time',
    'address',
    'status',
    'total',
    'infor',
  ];
  listHistorySearched: OrderHistory[] = [];

  selectedDate: any = null;

  constructor(
    http: HttpClient,
    authService: AuthService,
    // private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    public dateInput: ElementRef,
    public listHistoryPaginator: MatPaginator,
    public listHistoryDataSource: MatTableDataSource<any>,
    private notifier: NotifierService,
    private router: Router
  ) {
    super(http, authService);

    // assign values to global variables

    try {
      let navigation = this.router.getCurrentNavigation();
      this.state = navigation!.extras.state;
      if (this.state.orderSuccess) {
        this.notifier.notify('success', 'Đặt đơn hàng thành công!');
        // setTimeout(() => window.location.reload(), 2000);
      }
    } catch (err) {}

    window.scroll(0, 400);
    this.listHistoryPaginator = listHistoryPaginator;
    this.dateInput = dateInput;
    this.listHistoryDataSource = new MatTableDataSource();
    this.listHistoryDataSource.paginator = this.listHistoryPaginator;

    //customize paginator
    this.listHistoryDataSource.paginator._intl.itemsPerPageLabel =
      'Số lượng bản ghi: ';
    this.listHistoryDataSource.paginator._intl.previousPageLabel =
      'Trang trước';
    this.listHistoryDataSource.paginator._intl.nextPageLabel = 'Trang sau';
    this.listHistoryDataSource.paginator._intl.firstPageLabel = 'Trang đầu';
    this.listHistoryDataSource.paginator._intl.lastPageLabel = 'Trang cuối';
    this.listHistoryDataSource.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      const start = page * pageSize + 1;
      const end = (page + 1) * pageSize;
      const numberOfPages = Math.ceil(length / pageSize);
      return `Trang ${
        page + 1
      } - ${numberOfPages} trong tổng cộng: ${length} bản ghi`;
    };

    // this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy

    try {
      this.userModel = authService.currentUserValue;
    } catch (error) {
      console.log('ERROR: Cannot get userModel');
      this.userModel = new UserModel();
    }

    console.log('this.userModel');
    console.log(this.userModel);
    this.customer = this?.userModel?.customer;

    this.selectedSortValue = 0;

    this.loadHistoryList(this.listHistory).then(() => {
      this.listHistorySearched = this.listHistory;
      this.listHistoryDataSource = new MatTableDataSource(
        this.listHistorySearched
      );
      this.listHistoryDataSource.paginator = this.listHistoryPaginator;
    });
  }

  /**
   * Load History list
   * 
   * @param listOrderHistory 
   */
  async loadHistoryList(listOrderHistory: OrderHistory[]) {
    // await (listOrderHistory = this.getAllOrderHeader());

    //copied

    console.log('loadHistory');
    console.log(listOrderHistory);

    listOrderHistory = listOrderHistory.sort(function (a, b) {
      var dateA = new Date(a.orderHeader._orderDate).getTime();
      var dateB = new Date(b.orderHeader._orderDate).getTime();
      return dateA < dateB ? 1 : -1;
    });
    this.onSortCategoryChange(this.selectedSortValue);
  }

  ngAfterContentChecked() {
    this.cdr.detectChanges();
    // call or add here your code
  }

  onInputDateChange() {
    console.log('dateString');
    console.log(this.dateInput.nativeElement.value);

    let date;
    if (date == null) {
      try {
        let dateArray = this.dateInput.nativeElement.value
          .toString()
          .split('-');
        let day = dateArray[2];
        let month = dateArray[1];
        let year = dateArray[0];
        date = month + '/' + day + '/' + year;
        console.log(this.dateInput.nativeElement.value.trim() == '');
        if (this.dateInput.nativeElement.value.trim() == '') {
          date = '';
        }
      } catch (err) {}
    }
    this.selectedDate = date;
    this.onDatePickerChange(this.selectedDate);
  }

  /**
   * on changing date filter, update history list
   * 
   * @param date 
   */
  onDatePickerChange(date: any) {
    this.listHistorySearched = [];
    console.log('onDatePickerChange');
    console.log(date);
    // const date2: Date = new Date(date.getDate() + 1);
    if (date == null) {
      console.log('orderdate null');
      console.log(date);
    }

    for (let item of this.listHistory) {
      // console.log(item.orderheaderonl.orderDate);

      //create date from order
      let orderDate = new Date(item.orderHeader._orderDate);
      orderDate.setHours(1, 1, 1);

      //create date from input
      let inputStartDate = new Date(date);
      inputStartDate.setHours(0, 0, 0);
      let inputEndDate = new Date(date);
      inputEndDate.setHours(23, 59, 59);

      // if (item.orderDate <= date && item.orderDate >= date) {
      if (inputStartDate <= orderDate && orderDate <= inputEndDate) {
        console.log('orderdate trung');
        console.log(date);

        this.listHistorySearched.push(item);
      } else if (date == null || date.toString().trim() == '') {
        this.listHistorySearched.push(item);
      }
    }
    this.listHistoryDataSource = new MatTableDataSource(
      this.listHistorySearched
    );
    this.listHistoryDataSource.paginator = this.listHistoryPaginator;
    console.log('this.listHistoryDataSource');
    console.log(this.listHistoryDataSource);
  }

  pageSize = 5;
  onPaginateChange(event: any) {
    console.log('onPaginateChange(event:');
    this.pageSize = event.pageSize;
    console.log(event.pageSize);
  }

  showConfirmDialog(dataCore: any) {
    // this.orderHeaderOnService.getOrderHeaderOnById(dataCore.orderheaderonl.orderonlId).then(data => {
    //   console.log("OrderHeaderOn update put ")
    //   console.log(data)
    //   //refresh
    //   if (dataCore.orderheaderonl.status != data.status) {
    //     const errorDialog = this.dialog.open(ErrorDialogComponent, {
    //       data
    //     });
    //     errorDialog.componentInstance.errorDialogContent = "Trạng thái đơn đã được cập nhật!";
    //     errorDialog.componentInstance.backgroundColor = "background-warningcolor";
    //     this.this.loadHistoryList()
    //     // setTimeout(() => window.location.reload(), 2000);
    //   } else {
    //     const orderHeaderOn = this.dialog.open(DetailOrderHeaderOnDialogComponent, {
    //       data
    //     });
    //     orderHeaderOn.componentInstance.orderHeaderOnCore = data;
    //     orderHeaderOn.componentInstance.grade = dataCore.grade;
    //     //ko gui feedback dc khi grade > 0
    //     if (dataCore.grade > 0) {
    //       orderHeaderOn.componentInstance.canSendFeedback = false;
    //     } else {
    //       orderHeaderOn.componentInstance.canSendFeedback = true;
    //     }
    //     if (data.status != 1) {
    //       orderHeaderOn.componentInstance.displayedColumns = ['position', 'image', 'name', 'price', 'totalprice', 'voucher', 'quantity'];
    //     }
    //     orderHeaderOn.componentInstance.feedbackContent = dataCore.feedbackContent;
    //     console.log("showConfirmDialog data", orderHeaderOn.componentInstance.orderHeaderOnCore);
    //     orderHeaderOn.afterClosed().subscribe(result => {
    //       // NOTE: The result can also be nothing if the user presses the `esc` key or clicks outside the dialog
    //       console.log("orderHeaderOn.afterClosed().subscribe(result");
    //       console.log(result);
    //       switch (result.data) {
    //         case 0: {
    //           //NOTE: Khi huy don hang thi viet code up len api o doan nay
    //           data.status = 0;
    //           //bat dau update
    //           this.updateOrderHeader(data, 0)
    //           break;
    //         }
    //         case 1: {
    //           //NOTE: Khi sua don hang thi viet code up len api o doan nay
    //           data.listOrderDetailOnl = []
    //           data.orderdetailonls = []
    //           data = orderHeaderOn.componentInstance.orderHeaderOn;
    //           data.listOrderDetailOnl = orderHeaderOn.componentInstance.orderHeaderOn.orderdetailonls;
    //           data.orderdetailonls = orderHeaderOn.componentInstance.orderHeaderOn.orderdetailonls;
    //           data.note = orderHeaderOn.componentInstance.getNote().trimStart().trimEnd().replace(/\s+/g, ' ');
    //           //bat dau update
    //           this.updateOrderHeader(data, 1);
    //           break;
    //         }
    //         case 2: {
    //           //NOTE: Khi gui rating thi viet code up len api o doan nay
    //           dataCore.grade = orderHeaderOn.componentInstance.grade;
    //           dataCore.feedbackContent = orderHeaderOn.componentInstance.getRatingText().trimStart().trimEnd().replace(/\s+/g, ' ');
    //           //bat dau update
    //           console.log("dataCore.rating");
    //           console.log(dataCore.grade);
    //           console.log("dataCore.ratingText");
    //           console.log(dataCore.feedbackContent);
    //           this.updateFeedbackOn(dataCore);
    //           this.notifier.notify('success', "Gửi đánh giá thành công!");
    //           break;
    //         }
    //         default: {
    //           console.log("orderHeaderOn.afterClosed().subscribe(result");
    //           console.log(result);
    //           break;
    //         }
    //       }
    //     })
    //   }
    // }, error => {
    //   this.notifier.notify('error', "Có lỗi xảy ra!");
    // });
  }

  selectedSortValue: any;
  sortCategory = [
    { id: 0, name: 'Tất Cả' },
    { id: 1, name: 'Ngày' },
  ];
  onSortCategoryChange(value: any) {
    console.log(value);
    this.selectedSortValue = value;

    if (this.selectedSortValue == 0) {
      this.listHistorySearched = this.listHistory;
      this.selectedDate = null;
    }
    if (this.selectedSortValue == 1) {
      this.onDatePickerChange(this.selectedDate);
    }

    this.listHistoryDataSource = new MatTableDataSource(
      this.listHistorySearched
    );
    this.listHistoryDataSource.paginator = this.listHistoryPaginator;
  }

  getPrice(price: any) {
    return Number(Math.round(price)).toLocaleString();
  }
}
