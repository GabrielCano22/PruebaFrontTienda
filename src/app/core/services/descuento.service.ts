import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Descuento, DescuentoCreate } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DescuentoService {
  private base = `${environment.apiUrl}/descuentos`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Descuento[]> {
    return this.http.get<Descuento[]>(this.base);
  }

  getById(id: string): Observable<Descuento> {
    return this.http.get<Descuento>(`${this.base}/${id}`);
  }

  create(data: DescuentoCreate): Observable<Descuento> {
    return this.http.post<Descuento>(this.base, data);
  }

  update(id: string, data: DescuentoCreate): Observable<Descuento> {
    return this.http.put<Descuento>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
