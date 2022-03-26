import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationExtras, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../db/auth.service';
import { OrderHeaderService } from '../db/OrderHeaderService';
import { OrderHeader } from '../model/Order';
import { OrderDetail } from '../model/OrderDetail';
import { UserModel } from '../model/UserModel';
import { AlertDialogCheckoutComponent } from '../view/checkout/alert-dialog-checkout/alert-dialog-checkout.component';

export class OrderController {
  rfContact: FormGroup;
  userModel: UserModel;
  customer: any;
  listCart: OrderDetail[] = [];


  customerName: any;
  address: any;
  address1 = '';
  address2 = '';
  keyword = 'name';
  notFound = 'Không có địa chỉ phù hợp. Bạn có thể đặt một địa chỉ mới!';
  addressOptions = [
    { id: 1, customerName: this.address1 },
    { id: 2, customerName: this.address2 },
  ];
  customerPhone: any;
  note: any = 'abc xyz';

  listOrderHeader: OrderHeader[] = [];
  totalDue = 0;
  /**
   *
   * @param orderHeaderService
   * @param dialog
   * @param router
   * @param authService
   * @param formNote
   * @param notifier
   */
  constructor(
    private orderHeaderService: OrderHeaderService,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
    private notifier: NotifierService
  ) {
    this.rfContact = new FormGroup({
      formFullname: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
      formPhone: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.pattern('^.[0-9]{9}$'),
        ])
      ),
      formAddress1: new FormControl(
        '',
        Validators.compose([Validators.required])
      ),
    });

    try {
      console.log(this.authService.currentUserValue);
      
      this.userModel = this.authService.currentUserValue;
    } catch (error) {
      console.log('ERROR: Cannot get userModel');
      this.userModel = new UserModel();
    }

    console.log('this.userModel');
    console.log(this.userModel);
    this.customer = this?.userModel?.customer;

    this.customerName = this.userModel.customer?.customerName;
    console.log(this.customerName);

    this.address = this.userModel.customer?.address1;
    this.address1 = this.userModel.customer?.address1;
    this.address2 = this.userModel.customer?.address2;
    this.addressOptions[0].customerName = this.address1;
    this.addressOptions[1].customerName = this.address2;
    console.log('this.address');
    console.log(this.address1);
    console.log(this.address2);

    this.customerPhone = this.userModel.customer?.customerPhone;

    // ngoninit
    
    try {
      console.log("%c localStorage listCart" + JSON.parse(localStorage['listOrder']), "color: blue;")
      console.log(JSON.parse(localStorage['listOrder']))
      this.listCart = JSON.parse(localStorage['listOrder'])
      if (this.listCart.length == 0) {
      }
    } catch (err) {}
    console.log('this.listCart.forEach');
    this.listCart.forEach((item) => {
      console.log('item?.listOrderDetail?.forEach');
      this.totalDue = this.total();
      console.log(this.totalDue);
    });
  }

  selectEvent(item: any) {
    // do something with selected item
  }

  onFocused(e: any) {
    // do something
  }

  filterValues(search: string) {
    return this.addressOptions;
  }
  total() {
    var totalPrice = 0;
    this.listCart.forEach((item) => {
      if (item._discountProduct?._voucher?._discountPct) {
        totalPrice =
          totalPrice +
          ((item._price * (100 - item?._discountProduct._voucher._discountPct)) / 100) *
            item?._orderQuantity;
      } else {
        totalPrice = totalPrice + item._price * item?._orderQuantity;
      }
    });
    return totalPrice;
  }

  // fired up when submitted
  onSubmit() {
    if (!this.rfContact.invalid) {
      this.showConfirmDialog();
    } else {
      this.rfContact.markAllAsTouched();
    }
  }

  //if detail is changed, show confirm dialogue
  showConfirmDialog() {
    try {
      if (this.listCart.length == 0) {
        this.notifier.notify('error', 'Giỏ hàng của bạn đang trống!');
      } else {
        let dialogRef = this.dialog.open(AlertDialogCheckoutComponent);
        dialogRef.afterClosed().subscribe((result) => {
          // NOTE: The result can also be nothing if the user presses the `esc` key or clicks outside the dialog
          if (result == 'confirm') {
            this.updateOrderHeader();
          } else {
          }
        });
      }
    } catch (err) {
      this.notifier.notify('error', 'Giỏ hàng của bạn đang trống!');
    }
  }

  updateOrderHeader() {
    console.log('this.customer');
    console.log(this.customer);

    const orderHeader = new OrderHeader();
    orderHeader._orderDate = new Date();
    orderHeader._status = 1;
    orderHeader._customerName = this?.rfContact
      ?.get('formFullname')
      ?.value.trimStart()
      .trimEnd()
      .replace(/\s+/g, ' ');
    orderHeader._customerPhone = this?.rfContact
      ?.get('formPhone')
      ?.value.trimStart()
      .trimEnd()
      .replace(/\s+/g, ' ');
    // orderHeader.customer = this.customer***************;
    orderHeader._shiptoAddress = this?.rfContact
      ?.get('formAddress1')
      ?.value.trimStart()
      .trimEnd()
      .replace(/\s+/g, ' ');
    orderHeader._listOrderDetail = this.listCart;
    this.listOrderHeader.push(orderHeader);

    console.log('orderHeader post');
    console.log(orderHeader);

    this.orderHeaderService.createOrderHeader(orderHeader).then((data) => {
      console.log('OrderHeader checkout post ' + data);
      console.log(data);
      // this.listOrderHeader = data**************;
      console.log(this.listOrderHeader);
      this.listOrderHeader.forEach((item, index) => {
        console.log(item);
      });
    });

    // localStorage.removeItem('listOrder')************;

    //refresh
    const navigationExtras: NavigationExtras = {
      state: {
        orderSuccess: true,
      },
    };
    
    // redirect to history page after a successful order

    // setTimeout(
    //   () => this.router.navigate(['/history'], navigationExtras).then(() => {}),
    //   2000
    // );
  }

  order_validation_messages = {
    fullname: [{ type: 'required', message: 'Vui lòng nhập họ tên' }],
    address: [{ type: 'required', message: 'Vui lòng nhập địa chỉ' }],
    phone: [
      { type: 'required', message: 'Vui lòng nhập số điện thoại' },
      {
        type: 'pattern',
        message: 'Số điện thoại chỉ bao gốm số, và chứa đúng 10 ký tự!',
      },
    ],
  };

  getPrice(price: any) {
    return Number(Math.round(price)).toLocaleString();
  }
  getPriceProduct(item: any) {
    try {    
      // console.log(item._voucher);
      
      if (item._voucher?._discountPct > 0) {        
        let priceAfterDiscount: any = Math.floor(
          item?._product?._price -
            (item?._product?._price * item._voucher?._discountPct) / 100
        );
        if (typeof priceAfterDiscount != "number") {
          var errorIn: Error = new Error('Giá / Voucher không hợp lệ!');
          throw errorIn;
        }
        return priceAfterDiscount;
      } else {
        return item?._product?._price;
      }
    } catch (errorIn) {
      // this.notifier.notify('error', ''+errorIn)
      // console.log(errorIn);
      return item?._product?._price;
    }
  }
  limitNameLength(name: string, lengthLimit: number) {
    if (name.length > lengthLimit) {
      name = name.substring(0, lengthLimit);
      return name + '...';
    } else {
      return name;
    }
  }
}
