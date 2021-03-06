export class TextController{
    
  removeVietnameseTones(str: any) {
    str = str.trim().toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
  }

  comparisonNameEqual(txtSearch: any, txtProduct: any) {
    txtSearch = this.removeVietnameseTones(txtSearch);
    txtProduct = this.removeVietnameseTones(txtProduct);
    console.log("%c comparisonName" + txtProduct.indexOf(txtSearch), "color: green;")
    return txtProduct.indexOf(txtSearch) != -1;
  }
  comparisonName(txtSearch: any, txtProduct: any) {
    txtSearch = this.removeVietnameseTones(txtSearch);
    txtProduct = this.removeVietnameseTones(txtProduct);
    console.log("%c comparisonName" + txtProduct.indexOf(txtSearch), "color: green;")
    return txtProduct.indexOf(txtSearch) > -1;
  }
  /**
   * Filter product list when select a product category item from a drop downlist
   * 
   * @param chosenCate 
   * @param productCate 
   * @returns 
   */
  comparionCategory(chosenCate: any, productCate: any) {
    // console.log(chosenCate);
    // console.log(productCate);
    // console.log(productCate.indexOf(chosenCate) > -1);
    
    try {
      return productCate.indexOf(chosenCate) > -1;
    } catch (error) {
      return false
    }
  }



  getPrice(price: any) {
    return Number(Math.round(price)).toLocaleString();
  }
  getPriceProduct(item: any) {
    try {    
      // console.log(item._voucher);
      
      if (item._voucher?._discountPct > 0) {        
        let priceAfterDiscount: any = Math.floor(
          item?._product?._price -
            (item?._product?._price * item._voucher?._discountPct) / 100
        );
        if (typeof priceAfterDiscount != "number") {
          var errorIn: Error = new Error('Giá / Voucher không hợp lệ!');
          throw errorIn;
        }
        return priceAfterDiscount;
      } else {
        return item?._product?._price;
      }
    } catch (errorIn) {
      // this.notifier.notify('error', ''+errorIn)
      // console.log(errorIn);
      return item?._product?._price;
    }
  }
  limitNameLength(name: string, lengthLimit: number) {
    if (name.length > lengthLimit) {
      name = name.substring(0, lengthLimit);
      return name + '...';
    } else {
      return name;
    }
  }
}