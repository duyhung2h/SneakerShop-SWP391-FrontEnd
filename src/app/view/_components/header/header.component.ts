import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/controller/auth.service';
import { FavoriteProductService } from 'src/app/controller/FavoriteProductService';
import { Customer } from 'src/app/model/Customer';
import { DiscountProduct } from 'src/app/model/DiscountProduct';
import { Role } from 'src/app/model/Role';
import { UserModel } from 'src/app/model/UserModel';
declare var $: any;

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  indexPage = 0;
  userModel: UserModel;


  listProductFavorite: DiscountProduct[] = [];


  constructor(private authService: AuthService,
    private favoriteProductService: FavoriteProductService) {
    //lay user
    try {
      this.userModel = this.authService.currentUserValue
    } catch (error) {
      console.log("ERROR: Cannot get userModel")
      this.userModel = new UserModel
    }


    // load data trong local storage, neu ko co thi tao moi
    try {
      this.listProductFavorite = JSON.parse(localStorage['listProductFavorite']);
    } catch (err) {
    }

    //tao moi neu localstorage ko co du lieu
    try {
      if (this.listProductFavorite.length == 0) {
        try {
          if (this.userModel != null) {
            this.loadProductFavorite();
          }
        } catch (err) {
        }
      }
    } catch (err) {
      if (this.userModel != null) {
        this.loadProductFavorite();
      }
    }
  }
  _testCreateLogInAccount() {
    this.userModel = new UserModel
    this.userModel.customer = new Customer
    this.userModel.customer.role = new Role
    this.userModel.customer.customerId = 1
    this.userModel.customer.role.roleId = 1

    localStorage['currentUser'] = JSON.stringify(this.userModel)
    console.log(JSON.stringify(this.userModel))

  }

  checkCartAmount() {
    //lay cart trong localStorage
    try {
      let cartProduct = JSON.parse(localStorage['listOrder']);
      if (cartProduct.length == 0) {
        return cartProduct.length;
      }
      return cartProduct.length;
    } catch (err) {
      return 0;
    }
  }
  checkFavoriteAmount() {
    //lay favorite trong localStorage
    try {
      let listProductFavorite = JSON.parse(localStorage['listProductFavorite']);
      if (listProductFavorite.length == 0) {
        return listProductFavorite.length;
      }
      return listProductFavorite.length;
    } catch (err) {
      return 0;
    }
  }
  loadProductFavorite() {
    // this.discountProductService.getFavoriteProduct(this.userModel.customer?.customerId).then(data => {
    this.favoriteProductService.getFavoriteProduct(this.userModel.customer?.customerId).then(data => {
      console.log("getFavoriteProduct");
      console.log(data);

      // this.listProductFavorite = data;

      this.updateFavorite();
    });
  }
  updateFavorite() {
    localStorage.setItem('listProductFavorite', JSON.stringify(this.listProductFavorite));
  }


  ngOnInit(): void {
  }
  public changePage(index: any) {
    this.indexPage = index;
  }

  humbergerOnclick() {
    $(".humberger__menu__wrapper").addClass("show__humberger__menu__wrapper");
    $(".humberger__menu__overlay").addClass("active");
    $("body").addClass("over_hid");
  }

  humbergerMenuOverlayOnClick() {
    $(".humberger__menu__wrapper").removeClass("show__humberger__menu__wrapper");
    $(".humberger__menu__overlay").removeClass("active");
    $("body").removeClass("over_hid");
  }

  logout() {

    this.authService.logout()
  }

}
