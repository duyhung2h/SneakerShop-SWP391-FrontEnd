import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { BehaviorSubject, lastValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../model/Customer';
import { UserModel } from '../model/UserModel';

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  userModel: UserModel;
  guestIsViewing = false;
  public headers: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private notifier: NotifierService
  ) {
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(<string>localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();

    //lay user, kiem tra xem la user hay guest
    try {
      this.userModel = this.currentUserValue;
      if (this.userModel != null) {
        this.guestIsViewing = false;
      } else {
        this.guestIsViewing = true;
      }
    } catch (error) {
      console.log('ERROR: Cannot get userModel');
      this.userModel = new UserModel();
      this.guestIsViewing = true;
    }
    console.log('this.guestIsViewing');
    console.log(this.guestIsViewing);
    console.log(this.userModel);

    try {
      // const headers = new HttpHeaders().append(
      //   'Authorization',
      //   'Bearer ' + this.userModel.id_token
      // );
      this.headers = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Bearer ${this.userModel.id_token}`,
        'Accept': 'application/json'
      })
      // var headers = _headers.append('transfer-encoding', 'chunked');
      // const options = {
      //   headers: _headers.set('transfer-encoding', 'chunked')
      // }
      // headers = headers.append('transfer-encoding', 'chunked')
      // let options = new HttpRequestOptions({headers:headers});
      console.log(
        lastValueFrom(
          this.http.get(
            `${environment.apiUrl}api/order/my-orders?page=1&pageSize=999`,
            { headers: this.headers }
          )
          // this.http.post(`https://httpbin.org/post`, { headers: headers })
        )
      );
    } catch {
      this.notifier.notify(
        'warning',
        "Bạn chưa đăng nhập! Vui lòng di chuột vào mục 'Đăng nhập' ở phía bên phải trên cùng màn hình website."
      );
    }
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  async login(customer: any) {
    try {
      localStorage.clear;
      sessionStorage.clear;
      localStorage['listOrder'] = null;
    } catch (err) {}

    try {
      return await this.http
        .post<any>(`${environment.apiUrl}api/auth/login`, customer)
        .toPromise();
    } catch (err) {
      return 'error';
    }
  }

  async getUser(data: any) {
    // return await this.http.get<any>(`${environment.apiUrl}get-Customer-Token`, {
    // const headers = new HttpHeaders().append(
    //   'Authorization',
    //   'Bearer ' + this.userModel.id_token
    // );

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.data.token}`,
      'Accept': 'application/json'
    });
    console.log(this.http.get(`${environment.apiUrl}`, { headers: headers }));

    // }).toPromise();
    localStorage.setItem('token', JSON.stringify(data.data.token));
    return data.data.token;
  }

  changeUser(data: any) {
    console.log(data);
    localStorage.setItem('currentUser', JSON.stringify(data));

    this.currentUserSubject.next(data);
  }
  logout() {
    // this.http.post(${environment.apiUrl}/logout,
    //   null,
    //   {headers: new HttpHeaders().append('Authorization', 'Bearer ' + this.currentUserValue.id_token)});

    try {
      localStorage.clear;
      sessionStorage.clear;
      localStorage['listOrder'] = null;
      localStorage['listCategory'] = null;
      localStorage['listProduct'] = null;
      localStorage['listProductFavorite'] = null;
      localStorage['listProductRecentlyOrdered'] = null;

      localStorage.removeItem('password');
    } catch (err) {}

    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    console.log('Đăng xuất thành công');
    this.router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }
  reloadRoute(url: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url]);
      console.log(url);
    });
  }

  async registerUser(customer: Customer) {
    try {
      return await this.http
        .post<Customer[]>(
          `${environment.apiUrl}customer/createCustomer`,
          customer
        )
        .toPromise();
    } catch (err) {
      return 'errorAccExisted';
    }
  }

  async updateUser(customer: Customer) {
    return await this.http
      .put<Customer[]>(`${environment.apiUrl}customer/updateCustomer`, customer)
      .toPromise();
  }

  async changeAccountStatus(username: any, email: any) {
    return await this.http
      .get<Customer[]>(
        `${environment.apiUrl}customer/change-Account-Status/${username}/${email}`
      )
      .toPromise();
  }
}
