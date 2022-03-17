import { FormGroup } from "@angular/forms";
import { OrderHeader } from "../model/Order";
import { OrderDetail } from "../model/OrderDetail";
import { UserModel } from "../model/UserModel";
import { CartController } from "./CartController";

export class OrderController{

    rfContact: FormGroup;
    userModel: UserModel;
    customer: any;
    listCart: OrderDetail[] = [];
  
  // controller declare
  cartController: CartController = new CartController(
    this.router,
    this.notifier
  );
  
  
    name: any;
    address: any;
    address1 = "";
    address2 = "";
    keyword = 'name';
    notFound = 'Không có địa chỉ phù hợp. Bạn có thể đặt một địa chỉ mới!'
    addressOptions = [{ id: 1, name: this.address1 }, { id: 2, name: this.address2 }]
    phone: any;
    note: any = 'abc xyz';
  
    listOrderHeaderOn: OrderHeader[] = [];
    totalDue = 0;
  /**
   * 
   * @param orderHeaderOnService 
   * @param dialog 
   * @param router 
   * @param authService 
   * @param formNote 
   * @param notifier 
   */
    constructor(private orderHeaderOnService: OrderHeaderOnService, private dialog: MatDialog,
      private router: Router, private authService: AuthService, formNote: ElementRef,
      private notifier: NotifierService) {
      this.rfContact = new FormGroup({
        formFullname: new FormControl('', Validators.compose([
          Validators.required
        ])),
        formPhone: new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^.[0-9]{9}$')
        ])),
        formAddress1: new FormControl('', Validators.compose([
          Validators.required,
        ])),
      })
  
  
      try {
        this.userModel = this.authService.currentUserValue
      } catch (error) {
        console.log("ERROR: Cannot get userModel")
        this.userModel = new UserModel
      }
  
      console.log("this.userModel");
      console.log(this.userModel);
      this.customer = this?.userModel?.customer;
  
      this.name = this.userModel.customer?.name;
      console.log(this.name);
  
      this.address = this.userModel.customer?.address1;
      this.address1 = this.userModel.customer?.address1;
      this.address2 = this.userModel.customer?.address2;
      this.addressOptions[0].name = this.address1
      this.addressOptions[1].name = this.address2
      console.log("this.address");
      console.log(this.address1);
      console.log(this.address2);
  
      this.phone = this.userModel.customer?.phone;
      this.formNote = formNote;
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
    ngAfterViewInit() {
    }
    ngOnInit(): void {
  
  
      try {
        this.listCart = JSON.parse(localStorage.listOrder);
        if (this.listCart.length == 0) {
        }
  
      } catch (err) {
      }
      console.log("this.listCart.forEach")
      this.listCart.forEach(item => {
        console.log("item?.listOrderDetaill?.forEach")
        this.totalDue = this.total();
        console.log(this.totalDue)
      });
      // this.listCart
    }
    total() {
      var totalPrice = 0;
      this.listCart.forEach(item => {
        if (item.discountproduct?.voucher) {
          totalPrice = totalPrice + (item.price * (100 - item?.discountPct) / 100) * item?.orderonlqty;
        } else {
          totalPrice = totalPrice + item.price * item?.orderonlqty;
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
          this.notifier.notify('error', "Giỏ hàng của bạn đang trống!");
        } else {
          let dialogRef = this.dialog.open(AlertDialogCheckoutComponent);
          dialogRef.afterClosed().subscribe(result => {
            // NOTE: The result can also be nothing if the user presses the `esc` key or clicks outside the dialog
            if (result == 'confirm') {
              this.updateOrderHeaderOn()
            } else {
            }
          })
        }
      } catch (err) {
        this.notifier.notify('error', "Giỏ hàng của bạn đang trống!");
      }
    }
  
  
    @ViewChild('formNote') formNote: ElementRef;
    updateOrderHeaderOn() {
      console.log("this.customer");
      console.log(this.customer);
  
  
  
      const orderHeaderOn = new OrderHeaderOn();
      orderHeaderOn.orderDate = new Date();
      orderHeaderOn.status = 1;
      orderHeaderOn.name = this?.rfContact?.get("formFullname")?.value.trimStart().trimEnd().replace(/\s+/g, ' ');
      orderHeaderOn.phone = this?.rfContact?.get("formPhone")?.value.trimStart().trimEnd().replace(/\s+/g, ' ');
      orderHeaderOn.customer = this.customer;
      orderHeaderOn.shiptoAddress = this?.rfContact?.get("formAddress1")?.value.trimStart().trimEnd().replace(/\s+/g, ' ');
      orderHeaderOn.note = this.formNote?.nativeElement?.value.trimStart().trimEnd().replace(/\s+/g, ' ');
      orderHeaderOn.totalDue = this.totalDue;
      orderHeaderOn.listOrderDetaill = this.listCart;
      this.listOrderHeaderOn.push(orderHeaderOn);
  
  
      console.log("orderHeaderOn post");
      console.log(orderHeaderOn);
  
      this.orderHeaderOnService.createOrderHeaderOn(orderHeaderOn).then(data => {
        console.log("OrderHeaderOn checkout post " + data)
        console.log(data)
        this.listOrderHeaderOn = data;
        console.log(this.listOrderHeaderOn)
        this.listOrderHeaderOn.forEach((item, index) => {
          console.log(item)
        })
      });
  
      localStorage.removeItem('listOrder');
      // localStorage.removeItem('orderDetailS'); 
      // localStorage.removeItem('total'); 
  
      //refresh 
      const navigationExtras: NavigationExtras = {
        state: {
          orderSuccess: true
        }
      };
      // this.router.navigate(['/resetpassword'], navigationExtras);
  
      setTimeout(() => this.router.navigate(['/history'], navigationExtras)
        .then(() => {
        }), 2000);
    }
  
  
    order_validation_messages = {
      'fullname': [
        { type: 'required', message: 'Vui lòng nhập họ tên' },
      ],
      'address': [
        { type: 'required', message: 'Vui lòng nhập địa chỉ' },
      ],
      'phone': [
        { type: 'required', message: 'Vui lòng nhập số điện thoại' },
        { type: 'pattern', message: 'Số điện thoại chỉ bao gốm số, và chứa đúng 10 ký tự!' }
      ]
    }
  
  
    getPrice(price: any) {
      return Number(Math.round(price)).toLocaleString();
    }
    getPriceProduct(item: any) {
      let returnPrice = 0;
  
      if (item.discountproduct?.voucher) {
        returnPrice = (item.discountproduct?.product?.price * (100 - item.discountPct) / 100)
      } else {
        returnPrice = item.discountproduct?.product?.price
      }
  
      return Math.round(returnPrice);
    }
    limitNameLength(name: string, lengthLimit: number) {
      if (name.length > lengthLimit) {
        name = name.substring(0, lengthLimit);
        return name + "..."
      } else {
        return name;
      }
    }
  
}