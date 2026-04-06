import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Factura } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private base = `${environment.apiUrl}/facturas`;

  constructor(private http: HttpClient) {}

  generar(userId: string): Observable<Factura> {
    return this.http.post<Factura>(`${this.base}/${userId}/generar`, {});
  }

  getMisFacturas(userId: string): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.base}/${userId}`);
  }

  getDetalle(facturaId: string): Observable<Factura> {
    return this.http.get<Factura>(`${this.base}/detalle/${facturaId}`);
  }
}
