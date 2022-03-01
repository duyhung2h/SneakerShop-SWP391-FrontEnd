import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../model/Customer';
import { UserModel } from '../model/UserModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;


  userModel: UserModel
  guestIsViewing = false;

  constructor(
    private http: HttpClient,
    private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(<string>localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();



    //lay user, kiem tra xem la user hay guest
    try {
      this.userModel = this.currentUserValue
      if (this.userModel != null) {
        this.guestIsViewing = false;
      } else {
        this.guestIsViewing = true;
      }
    } catch (error) {
      console.log("ERROR: Cannot get userModel")
      this.userModel = new UserModel
      this.guestIsViewing = true;
    }
    console.log("this.guestIsViewing")
    console.log(this.guestIsViewing)
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
  async checkLogged() {
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.currentUserValue.id_token);
    const promise = await this.http.post<boolean>(`${environment.apiUrl}/revenue/re`, { headers: headers })
      .toPromise();
    // const promise = 'http://localhost:4200/#/onmanger/ordermanager';
    if (!promise) {
      this.logout();
    }
    return promise;
  }

  async login(customer: any) {

    try {
      localStorage.clear;
      sessionStorage.clear;
      localStorage['listOrder'] = null;

    } catch (err) {
    }

    try {
      return await this.http.post<any>(`${environment.apiUrl}authenticate`, customer).toPromise();
    } catch (err) {
      return "error";
    }
  }

  async getUser(data: any) {
    localStorage.setItem('token', JSON.stringify(data));

    return await this.http.get<any>(`${environment.apiUrl}get-Customer-Token`, {
      headers: new HttpHeaders().append('Authorization', 'Bearer ' +
        data.id_token)
    }).toPromise();
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

      localStorage.removeItem('password')

    } catch (err) {
    }



    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    console.log('Đăng xuất thành công')
    this.router.navigate(['/login'])
      .then(() => {
        window.location.reload();
      });
  }
  async registerUser(customer: Customer) {
    try {
      return await this.http.post<Customer[]>(`${environment.apiUrl}customer/createCustomer`, customer).toPromise();
    } catch (err) {
      return "errorAccExisted"
    }
  }



  async updateUser(customer: Customer) {
    return await this.http.put<Customer[]>(`${environment.apiUrl}customer/updateCustomer`, customer).toPromise();
  }

  async changeAccountStatus(username: any, email: any) {
    return await this.http.get<Customer[]>(`${environment.apiUrl}customer/change-Account-Status/${username}/${email}`).toPromise();
  }

}