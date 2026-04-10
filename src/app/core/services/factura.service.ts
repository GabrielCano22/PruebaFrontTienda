import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, catchError } from 'rxjs';
import { Factura } from '../models';
import { environment } from '../../../environments/environment';

interface CacheEntry {
  data: Factura[];
  timestamp: number;
  userId: string;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

@Injectable({ providedIn: 'root' })
export class FacturaService {
  private base = `${environment.apiUrl}/facturas`;
  private http = inject(HttpClient);

  // Signal-based cache state
  private _facturas = signal<Factura[]>([]);
  private _loading = signal(false);
  private _error = signal('');
  private _cache: CacheEntry | null = null;

  /** Read-only signals for consumers */
  readonly facturas = this._facturas.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasCachedData = computed(() => this._facturas().length > 0);

  generar(userId: string): Observable<Factura> {
    return this.http.post<Factura>(`${this.base}/${userId}/generar`, {}).pipe(
      tap(() => {
        this.invalidateCache();
        this.prefetch(userId);
      })
    );
  }

  /**
   * Returns cached facturas immediately via signals, and optionally
   * refreshes from the network in the background.
   *
   * - If cache is fresh (< TTL): returns cached data, no network call.
   * - If cache is stale or empty: fetches from network. Cached data (if any)
   *   remains visible while loading.
   */
  getMisFacturas(userId: string): void {
    const now = Date.now();
    const cacheValid = this._cache
      && this._cache.userId === userId
      && (now - this._cache.timestamp) < CACHE_TTL_MS;

    if (cacheValid) {
      // Cache is fresh — no network call needed
      return;
    }

    // If we have stale cached data, keep showing it (no loading spinner)
    // If we have no data at all, show loading
    if (!this._cache || this._cache.userId !== userId) {
      this._loading.set(true);
    }

    this._error.set('');

    this.http.get<Factura[]>(`${this.base}/${userId}`).pipe(
      tap(facturas => {
        this._cache = { data: facturas, timestamp: Date.now(), userId };
        this._facturas.set(facturas);
        this._loading.set(false);
      }),
      catchError(err => {
        this._error.set('Error al cargar las facturas');
        this._loading.set(false);
        return of([]);
      })
    ).subscribe();
  }

  /**
   * Prefetch facturas in the background. Designed to be called from
   * the main layout so data is ready before the user navigates.
   */
  prefetch(userId: string): void {
    // Only prefetch if cache is empty or stale — avoids duplicate requests
    const now = Date.now();
    const cacheValid = this._cache
      && this._cache.userId === userId
      && (now - this._cache.timestamp) < CACHE_TTL_MS;

    if (cacheValid || this._loading()) {
      return;
    }

    this.http.get<Factura[]>(`${this.base}/${userId}`).pipe(
      tap(facturas => {
        this._cache = { data: facturas, timestamp: Date.now(), userId };
        this._facturas.set(facturas);
      }),
      catchError(() => of([]))
    ).subscribe();
  }

  /** Force-clear cache (e.g. after generating a new factura) */
  invalidateCache(): void {
    this._cache = null;
  }

  getDetalle(facturaId: string): Observable<Factura> {
    return this.http.get<Factura>(`${this.base}/detalle/${facturaId}`);
  }

  // ─── Admin methods ──────────────────────────────────────────────────────────

  getAllFacturas(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.base}/admin/todas`);
  }

  aprobar(facturaId: string): Observable<Factura> {
    return this.http.patch<Factura>(`${this.base}/admin/${facturaId}/aprobar`, {});
  }

  rechazar(facturaId: string): Observable<Factura> {
    return this.http.patch<Factura>(`${this.base}/admin/${facturaId}/rechazar`, {});
  }
}
