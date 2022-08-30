import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Product } from './product';
import { ProductPage } from './productpage';
import { CashRate } from './CashRate';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = 'https://localhost:7182/Api/ProductPage';

  constructor(private http: HttpClient) { }

  searchProducts(pagesize: number, phrase: string): Observable<ProductPage> {
    return this.http.get<ProductPage>(this.url + '/Search/' + pagesize + "," + phrase)
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }
  getAllProducts(): Observable<ProductPage> {
    return this.http.get<ProductPage>(this.url)
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }
  getAllProductsPagination(pageindex: number, pagesize: number): Observable<ProductPage> {
    return this.http.get<ProductPage>(this.url + '/' + pageindex + "," + pagesize)
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }
  getProductById(ProductId: string): Observable<Product> {
    return this.http.get<Product>(this.url + '/' + ProductId)
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }
  getProductReport(): Observable<string> {    
    return this.http.get(this.url + '/report', { responseType: 'text' });
  }
  createProduct(Product: Product): Observable<ProductPage> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.post<ProductPage>(this.url, Product, httpOptions)
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }
  updateProduct(Product: Product): Observable<ProductPage> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.put<ProductPage>(this.url + '/' + Product.id, Product, httpOptions)
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }
  deleteProductById(Productid: string): Observable<number> {
    const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    return this.http.delete<number>(this.url + '/' + Productid, httpOptions)
      .pipe(catchError((error: HttpErrorResponse) => throwError(error)));
  }
}
