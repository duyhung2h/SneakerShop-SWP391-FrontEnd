import { OrderDetail } from './OrderDetail';

export class OrderHeader {
  _orderId?: any;
  _customerId?: any;
  _customerName?: any;
  _customerPhone?: any;
  _orderDate?: any;
  _status?: any;
  _shiptoAddress?: any;
  _listOrderDetail?: OrderDetail[];

  constructor(
    _orderId?: number,
    _customerId?: number,
    _customerName?: string,
    _customerPhone?: string,
    _orderDate?: Date,
    _status?: number,
    _shiptoAddress?: string,
    _listOrderDetail?: OrderDetail[]
  ) {
    this._orderId = _orderId
    this._customerId = _customerId
    this._customerName = _customerName
    this._customerPhone = _customerPhone
    this._orderDate = _orderDate
    this._status = _status
    this._shiptoAddress = _shiptoAddress
    this._listOrderDetail = _listOrderDetail
  }
}
