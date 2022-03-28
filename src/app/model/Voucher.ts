export class Voucher {
  _voucherId: any;
  private _voucherCode: any;
  private _description: any;
  _discountPct: any;
  private _type: any;
  private _startDate: any;
  private _endDate: any;
  _quantity: any;
  private _status: any;

  constructor(
    $voucherId?: any,
    $voucherCode?: any,
    $description?: any,
    $discountPct?: any,
    $type?: any,
    $startDate?: any,
    $endDate?: any,
    $quantity?: any,
    $status?: any
  ) {
    this._voucherId = $voucherId;
    this._voucherCode = $voucherCode;
    this._description = $description;
    this._discountPct = $discountPct;
    this._type = $type;
    this._startDate = $startDate;
    this._endDate = $endDate;
    this._quantity = $quantity;
    this._status = $status;
  }

}
