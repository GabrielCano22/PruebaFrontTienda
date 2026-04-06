import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria, CategoriaCreate } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private base = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.base);
  }

  getById(id: string): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.base}/${id}`);
  }

  create(data: CategoriaCreate): Observable<Categoria> {
    return this.http.post<Categoria>(this.base, data);
  }

  update(id: string, data: CategoriaCreate): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.base}/${id}`, data);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.base}/${id}`);
  }
}
