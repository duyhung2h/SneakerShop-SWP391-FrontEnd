import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Category} from "src/app/model/Category";
import {Injectable} from "@angular/core";
@Injectable({
  providedIn: 'root'
})
export class CategoryService{
  constructor(private http: HttpClient) {
  }
  async getAllCategory() {
    return await this.http.get<Category[]>(`${environment.apiUrl}category/get-allCategory`).toPromise();
  }
}
