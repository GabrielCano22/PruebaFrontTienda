import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, ProductoCreate } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private base = `${environment.apiUrl}/productos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.base);
  }

  getById(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/${id}`);
  }

  getByCodigo(codigo: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.base}/codigo/${codigo}`);
  }

  buscar(nombre: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.base}/buscar/${nombre}`);
  }

  getByCategoria(categoriaId: string): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.base}/categoria/${categoriaId}`);
  }

  create(data: ProductoCreate): Observable<Producto> {
    return this.http.post<Producto>(this.base, data);
  }

  update(id: string, data: Partial<ProductoCreate>): Observable<Producto> {
    return this.http.put<Producto>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
