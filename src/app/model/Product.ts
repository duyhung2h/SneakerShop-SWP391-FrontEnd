import {Category} from "./Category";
import {Attribute} from "./Attribute";

export class Product {
  _productId?: any;
  _name?: any;
  _category?: Category;
  _price?: any;
  _description?: any;
  _status?: any;
  _image?: any;
  _attributes?: Attribute[] = [];

  

	constructor(productId?: number, name?: string, category?: Category, price?: number, description?: string, status?: any, image?: string, attributes?: Attribute[] ) {
		this._productId = productId;
		this._name = name;
		this._category = category;
		this._price = price;
		this._description = description;
		this._status = status;
		this._image = image;
		this._attributes = attributes;
	}
}

