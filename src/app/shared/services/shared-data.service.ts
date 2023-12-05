import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }

  private productData: any;

  setProductData(data: any): void {
    this.productData = data;
  }

  getProductData(): any {
    return this.productData;
  }
}
