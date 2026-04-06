import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest, SessionUser } from '../models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_KEY = 'tienda_session';
  private _session = signal<SessionUser | null>(this.loadSession());

  readonly session = this._session.asReadonly();
  readonly isAuthenticated = computed(() => !!this._session());
  readonly isAdmin = computed(() => this._session()?.rol === 'administrador');
  readonly isCliente = computed(() => this._session()?.rol === 'cliente');
  readonly currentUser = computed(() => this._session());

  constructor(private http: HttpClient, private router: Router) {}

  login(data: LoginRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, data).pipe(
      tap(res => {
        // Backend returns: { clave: "token", nombre_usuario: { id_usuario, nombre, nombre_usuario, rol, ... } }
        const usuario = res.nombre_usuario;
        const session: SessionUser = {
          token: res.clave,
          usuario_id: String(usuario.id_usuario),
          nombre: usuario.nombre,
          nombre_usuario: usuario.nombre_usuario,
          rol: usuario.rol,
        };
        this.saveSession(session);
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/auth/registrar`, data);
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
    this._session.set(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return this._session()?.token ?? null;
  }

  getUserId(): string | null {
    return this._session()?.usuario_id ?? null;
  }

  private saveSession(session: SessionUser): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    this._session.set(session);
  }

  private loadSession(): SessionUser | null {
    try {
      const raw = localStorage.getItem(this.SESSION_KEY);
      if (!raw) return null;
      const s: SessionUser = JSON.parse(raw);
      // Reject stale sessions missing critical fields (old mapping bug)
      if (!s.token || !s.usuario_id || s.usuario_id === 'undefined' || !s.rol) {
        localStorage.removeItem(this.SESSION_KEY);
        return null;
      }
      return s;
    } catch {
      return null;
    }
  }
}
