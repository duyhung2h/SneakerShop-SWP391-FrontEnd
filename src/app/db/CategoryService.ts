import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Category } from '../model/Category';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}
  async getAllCategory() {
    console.log(
      '%c Call Category API :',
      'color: blue;',
      `${environment.apiUrl}api/category/get-all`
    );

    var productCategories: Category[] = [];
    await lastValueFrom(
      this.http.get<any>(`${environment.apiUrl}api/category/get-all`)
    ).then((coreData) => {
      let coreProductCategories: Category[] = [];
      coreData.data.forEach((itemCategory: any) => {
        let category = new Category(
          itemCategory.CategoryId,
          itemCategory.CategoryName,
          itemCategory.CategoryDescription
        );
        coreProductCategories.unshift(category);
      });

      let categoryAll = new Category();
      categoryAll._categoryId = -1;
      categoryAll._categoryName = 'Tất Cả';

      coreProductCategories.unshift(categoryAll);
      productCategories = coreProductCategories
      console.log(productCategories);
    });
    console.log(productCategories);

    // return await lastValueFrom(this.http.get<any>
    //   (`${environment.apiUrl}api/category/get-all`));
    return await productCategories;
  }
}
