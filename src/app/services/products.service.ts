import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../interfaces/product.interface';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(
    private http: HttpClient
  ) { }

  private baseUrl = environment.apiUrl;
  private authorId = environment.authorId;

  getFinancialProducts(): Observable<any> {
    const url = `${this.baseUrl}/products`;
    const headers = new HttpHeaders().set('AuthorID', this.authorId);

    return this.http.get(url, { headers });
  }

  createFinancialProduct(formCreate: Product): Observable<any> {
    const url = `${this.baseUrl}/products`;

    const headers = new HttpHeaders()
      .set('AuthorID', this.authorId)
      .set('Content-Type', 'application/json');

    return this.http.post(url, formCreate, { headers });
  }

  editFinancialProduct(formEdit: Product): Observable<any> {
    const url = `${this.baseUrl}/products`;

    const headers = new HttpHeaders()
      .set('AuthorID', this.authorId)
      .set('Content-Type', 'application/json');

    return this.http.put(url, formEdit, { headers });
  }

  deleteFinancialProduct(id: string | undefined): Observable<any> {
    const url = `${this.baseUrl}/products/${id}`;

    const headers = new HttpHeaders()
      .set('AuthorID', this.authorId)
      .set('Content-Type', 'application/json');

    return this.http.delete(url, { headers });
  }
}
