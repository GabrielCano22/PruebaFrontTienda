import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario, UsuarioUpdate, CambioContrasena } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private base = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.base}/`);
  }

  getById(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.base}/${id}`);
  }

  update(id: string, data: UsuarioUpdate): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.base}/${id}`, data);
  }

  desactivar(id: string): Observable<any> {
    return this.http.patch(`${this.base}/${id}/desactivar`, {});
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }

  cambiarContrasena(id: string, data: CambioContrasena): Observable<any> {
    return this.http.post(`${this.base}/${id}/cambiar-contrasena`, data);
  }
}
