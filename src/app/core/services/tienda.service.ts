import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tienda, Catalogo } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TiendaService {
  constructor(private http: HttpClient) {}

  getTienda(): Observable<Tienda> {
    return this.http.get<Tienda>(`${environment.apiUrl}/tienda`);
  }

  getCatalogo(): Observable<Catalogo> {
    return this.http.get<Catalogo>(`${environment.apiUrl}/tienda/catalogo`);
  }
}
