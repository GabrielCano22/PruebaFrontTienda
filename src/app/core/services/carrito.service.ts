import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Carrito, AgregarAlCarritoRequest, ActualizarCantidadRequest } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private base = `${environment.apiUrl}/carrito`;
  cartCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  get(userId: string): Observable<Carrito> {
    return this.http.get<Carrito>(`${this.base}/${userId}`).pipe(
      tap(c => this.cartCount.set(c.detalles?.length ?? 0))
    );
  }

  agregar(userId: string, data: AgregarAlCarritoRequest): Observable<Carrito> {
    return this.http.post<Carrito>(`${this.base}/${userId}/agregar`, data).pipe(
      tap(c => this.cartCount.set(c.detalles?.length ?? 0))
    );
  }

  actualizar(userId: string, productoId: string, data: ActualizarCantidadRequest): Observable<Carrito> {
    return this.http.put<Carrito>(`${this.base}/${userId}/actualizar/${productoId}`, data).pipe(
      tap(c => this.cartCount.set(c.detalles?.length ?? 0))
    );
  }

  quitar(userId: string, productoId: string): Observable<Carrito> {
    return this.http.delete<Carrito>(`${this.base}/${userId}/quitar/${productoId}`).pipe(
      tap(c => this.cartCount.set(c.detalles?.length ?? 0))
    );
  }

  vaciar(userId: string): Observable<any> {
    return this.http.delete(`${this.base}/${userId}/vaciar`).pipe(
      tap(() => this.cartCount.set(0))
    );
  }
}
