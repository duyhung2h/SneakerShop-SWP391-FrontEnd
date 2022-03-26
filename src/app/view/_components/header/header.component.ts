import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { UserController } from 'src/app/controller/UserController';
import { AuthService } from 'src/app/db/auth.service';
import { FavoriteProductService } from 'src/app/db/FavoriteProductService';
import { Customer } from 'src/app/model/Customer';
import { DiscountProduct } from 'src/app/model/DiscountProduct';
import { OrderHeader } from 'src/app/model/Order';
import { Role } from 'src/app/model/Role';
import { UserModel } from 'src/app/model/UserModel';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent extends UserController implements OnInit {
  indexPage = 0;
  userModel: UserModel;

  listProductFavorite: DiscountProduct[] = [];

  constructor(
    authService: AuthService,
    notifier: NotifierService,
    router: Router,
    private favoriteProductService: FavoriteProductService,
  ) {
    super(authService, notifier, router)
    this.rememberMeCheckbox = new ElementRef(this)
    //lay user
    try {
      this.userModel = this.authService.currentUserValue;
    } catch (error) {
      console.log('ERROR: Cannot get userModel');
      this.userModel = new UserModel();
    }

    //tao moi neu localstorage ko co du lieu
    try {
      if (this.listProductFavorite.length == 0) {
        try {
          if (this.userModel != null) {
            this.loadProductFavorite();
          }
        } catch (err) {}
      }
    } catch (err) {
      if (this.userModel != null) {
        this.loadProductFavorite();
      }
    }
  }
  _testCreateLogInAccount() {
    this.userModel = new UserModel();
    this.userModel.id_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJUUkFOIEhPQU5HIEhVWSIsInN1YiI6MiwiaWF0IjoxNjQ3NzMyMjMzMjQ4LCJleHAiOjE2NTk2MzU4ODE5MTh9.hvZCLAiejewSZZWr5U1RnimAwJkQQHlgh2DPIYzigzg";
    this.userModel.customer = new Customer();
    this.userModel.customer.role = new Role(1, "customer");
    this.userModel.customer.customerId = 1;
    this.userModel.customer.role._roleId = 1;
    this.userModel.customer.customerName = "Nguyễn Duy Hưng";
    this.userModel.customer.address1 = "101A";
    this.userModel.customer.customerPhone = "0961578499";

    localStorage['currentUser'] = JSON.stringify(this.userModel);
    console.log(JSON.stringify(this.userModel));
  }
  

  checkCartAmount() {
    //lay cart trong localStorage
    try {
      let cartProduct = JSON.parse(localStorage['listOrder']);
      return cartProduct.length;
    } catch (err) {
      return 0;
    }
  }
  checkFavoriteAmount() {
    //lay favorite trong localStorage
    try {
      // let listProductFavorite = JSON.parse(localStorage['listProductFavorite']);
      return this.listProductFavorite.length;
    } catch (err) {
      return 0;
    }
  }
  loadProductFavorite() {
    // this.discountProductService.getFavoriteProduct(this.userModel.customer?.customerId).then(data => {
    this.favoriteProductService
      .getFavoriteProduct(this.userModel.customer?.customerId)
      .then((data) => {
        console.log('getFavoriteProduct');
        console.log(data);
      });
  }

  ngOnInit(): void {}
  public changePage(index: any) {
    this.indexPage = index;
  }

  humbergerOnclick() {
    $('.humberger__menu__wrapper').addClass('show__humberger__menu__wrapper');
    $('.humberger__menu__overlay').addClass('active');
    $('body').addClass('over_hid');
  }

  humbergerMenuOverlayOnClick() {
    $('.humberger__menu__wrapper').removeClass(
      'show__humberger__menu__wrapper'
    );
    $('.humberger__menu__overlay').removeClass('active');
    $('body').removeClass('over_hid');
  }
}
