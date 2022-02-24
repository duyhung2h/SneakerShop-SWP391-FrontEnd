export class Category {
  _categoryId?: any;
  _categoryName?: any;
  _categoryDescription?: any;



  constructor(categoryId?: number, categoryName?: string, categoryDescription?: string) {
    this._categoryId = categoryId
    this._categoryName = categoryName
    this._categoryDescription = categoryDescription
  }


}
