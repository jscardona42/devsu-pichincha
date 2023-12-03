import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl = 'https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros/bp';

  getFinancialProducts(): Observable<any> {
    const url = `${this.baseUrl}/products`;
    const headers = new HttpHeaders().set('AuthorID', '299');

    return this.http.get(url, { headers });
  }
}
