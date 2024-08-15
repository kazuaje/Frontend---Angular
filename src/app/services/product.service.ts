import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModel } from 'app/models/product.model';
import { ResponseModel } from 'app/models/response.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:3002/bp/products';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<ResponseModel<ProductModel[]>> {
    return this.http.get<ResponseModel<ProductModel[]>>(`${this.baseUrl}`);
  }

  addProduct(product: ProductModel): Observable<ResponseModel<ProductModel>> {
    return this.http.post<ResponseModel<ProductModel>>(`${this.baseUrl}`, product);
  }

  updateProduct(id: string, product: ProductModel): Observable<ResponseModel<ProductModel>> {
    return this.http.put<ResponseModel<ProductModel>>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<ResponseModel<any>> {
    return this.http.delete<ResponseModel<any>>(`${this.baseUrl}/${id}`);
  }

  verifyProductId(id: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/verification/${id}`);
  }
}
