import { ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { AuthService } from '../db/auth.service';
import { Customer } from '../model/Customer';
import { Role } from '../model/Role';
import { UserModel } from '../model/UserModel';

export class UserController {
  rfContact: FormGroup;
  validationMessage = '';
  notificationMessage = '';
  state: any;
  usernameF: any;
  passwordF: any;

  rememberMeTicked = false;
  public rememberMeCheckbox = new ElementRef(this)
  constructor(
    public authService: AuthService,
    public notifier: NotifierService,
    public router: Router,
  ) {
    this.rfContact = new FormGroup({
      formUsername: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(25),
          Validators.pattern('^[A-Za-z0-9]+$'),
        ])
      ),
      formPassword: new FormControl(
        '',
        Validators.compose([
          Validators.minLength(6),
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9.,`!@#$%^&*()-_=+{}[]|;:"<>?/~]+$'
          ),
        ])
      ),
    });

    this.passwordHidden = true;

    try {
      this.rememberMeTicked = JSON.parse(localStorage['rememberMeTicked']);
    } catch (err) {
      this.rememberMeTicked = false;
    }

    let navigation = this.router.getCurrentNavigation();
    this.state = navigation?.extras?.state;

    this.usernameF = this.rfContact.get('formUsername');
    this.passwordF = this.rfContact.get('formPassword');

    try {
      this.usernameF.value = this.state.formUsername;
      this.passwordF.value = this.state.formPassword;
      this.notificationMessage = this.state.notificationMessage;
    } catch (err) {}
  }

  // hide and unhide password text field
  passwordHidden: boolean;

  togglePassword() {
    this.passwordHidden = !this.passwordHidden;
  }

  checkUsernameNull() {
    let username = this.rfContact.get('formUsername')?.value;
    return (username === '' || username === null) ? true : false;
  }
  checkPasswordNull() {
    let password = this.rfContact.get('formPassword')?.value;
    return password === '' ? true : false;
  }

  checkRememberMeTicked(event: any) {
    console.log(localStorage['rememberMeTicked']);
    console.log('event.target.checked');
    console.log(event.target.checked);

    if (event.target.checked) {
      this.rememberMeTicked = true;
    } else {
      this.rememberMeTicked = false;
    }
    localStorage.setItem(
      'rememberMeTicked',
      JSON.stringify(this.rememberMeTicked)
    );
  }
  logout() {
    this.authService.logout();
  }
  // fired up when submitted
  async onSubmit() {
    this.validationMessage = '';
    if (this.checkUsernameNull()) {
      this.notificationMessage = 'error';
      this.validationMessage = 'Vui lòng nhập tên tài khoản';
      return;
    }
    if (this.checkPasswordNull()) {
      this.notificationMessage = 'error';
      this.validationMessage = 'Vui lòng nhập mật khẩu';
      return;
    }
    let customer = new Customer();
    customer.userName = this.rfContact.get('formUsername')?.value;
    customer.password = this.rfContact.get('formPassword')?.value;
    await this.authService.login(customer).then(
      (data) => {
        console.log(data.data.token);
        if (data == 'error') {
          console.log('loginError');
          this.notificationMessage = 'error';
          this.validationMessage = 'Tên tài khoản và mật khẩu không chính xác!';
        }
        this.authService.getUser(data).then((dataToken) => {
          console.log('this.authService.getUser');
          console.log(dataToken);

          const user = new UserModel();
          user.customer = customer;
          user.id_token = dataToken;
          user.customer.status_account = 1 // chua ho tro reset mk
          user.customer.role = new Role(1, "customer")
          console.log('user.customer?.status_account');
          console.log(user.customer?.role?._roleId);
          if (
            user.customer?.status_account == 1 &&
            user.customer?.role?._roleId == 1
          ) {
            this.router.navigate(['/home']).then(() => {
              localStorage['resetPassCustomer'] = null;
              // Luu tru username va mat khau de he thong ghi nho (khi rememberMeTicked = true)
              if (this.rememberMeTicked == true) {
                localStorage.setItem(
                  'rememberedUsername',
                  JSON.stringify(this.rfContact.get('formUsername')?.value)
                );
                localStorage.setItem(
                  'rememberedPassword',
                  JSON.stringify(this.rfContact.get('formPassword')?.value)
                );
              }

              this.authService.changeUser(user);
              window.location.reload();
              localStorage.setItem('password', customer.password);
            });
          } else if (
            user.customer?.status_account == 0 &&
            user.customer?.role?._roleId == 1
          ) {
            const navigationExtras: NavigationExtras = {
              state: {
                formUsername: this.rfContact.get('formUsername')?.value,
                formEmail: this.rfContact.get('formEmail')?.value,
              },
            };
            localStorage.setItem(
              'resetPassCustomer',
              JSON.stringify(user.customer)
            );
            this.router.navigate(['/resetpassword'], navigationExtras);
          } else if (user.customer?.role?._roleId != 1) {
            this.notifier.notify(
              'error',
              'Tài khoản không được phép đăng nhập vào hệ thống!'
            );
          }
        });
      },
      (error) => {}
    );
  }
}
