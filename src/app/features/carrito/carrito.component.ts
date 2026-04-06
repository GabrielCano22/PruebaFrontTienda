import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CarritoService } from '../../core/services/carrito.service';
import { DescuentoService } from '../../core/services/descuento.service';
import { FacturaService } from '../../core/services/factura.service';
import { Carrito, DetalleCarrito, Descuento } from '../../core/models';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.component.html',
})
export class CarritoComponent implements OnInit {
  auth = inject(AuthService);
  carritoService = inject(CarritoService);
  descuentoService = inject(DescuentoService);
  facturaService = inject(FacturaService);

  carrito = signal<Carrito | null>(null);
  descuentos = signal<Descuento[]>([]);
  loading = signal(true);
  generandoFactura = signal(false);
  facturaGenerada = signal<any>(null);
  error = signal('');

  totalBruto = computed(() => {
    return this.carrito()?.detalles?.reduce((sum, d) => sum + (d.precio_unitario * d.cantidad), 0) ?? 0;
  });

  totalItems = computed(() => {
    return this.carrito()?.detalles?.reduce((sum, d) => sum + d.cantidad, 0) ?? 0;
  });

  descuentoAplicable = computed(() => {
    const total = this.totalItems();
    const lista = [...this.descuentos()].sort((a, b) => b.unidades_minimas - a.unidades_minimas);
    return lista.find(d => total >= d.unidades_minimas) ?? null;
  });

  proximoDescuento = computed(() => {
    const total = this.totalItems();
    const lista = [...this.descuentos()].sort((a, b) => a.unidades_minimas - b.unidades_minimas);
    return lista.find(d => d.unidades_minimas > total) ?? null;
  });

  totalNeto = computed(() => {
    const bruto = this.totalBruto();
    const desc = this.descuentoAplicable();
    if (!desc) return bruto;
    return bruto * (1 - desc.porcentaje / 100);
  });

  ahorro = computed(() => {
    return this.totalBruto() - this.totalNeto();
  });

  ngOnInit() {
    const userId = this.auth.getUserId();
    if (!userId) { this.error.set('Sesión inválida. Por favor inicia sesión de nuevo.'); this.loading.set(false); return; }
    this.carritoService.get(userId).subscribe({
      next: c => { this.carrito.set(c); this.loading.set(false); },
      error: (e) => { this.error.set(e.error?.detail || 'Error al cargar el carrito'); this.loading.set(false); }
    });
    this.descuentoService.getAll().subscribe({ next: d => this.descuentos.set(d), error: () => {} });
  }

  updateCantidad(detalle: DetalleCarrito, delta: number) {
    const userId = this.auth.getUserId();
    if (!userId) return;
    const nuevaCantidad = detalle.cantidad + delta;
    if (nuevaCantidad <= 0) {
      this.carritoService.quitar(userId, detalle.id_producto).subscribe({ next: c => this.carrito.set(c), error: () => {} });
    } else {
      this.carritoService.actualizar(userId, detalle.id_producto, { cantidad: nuevaCantidad }).subscribe({ next: c => this.carrito.set(c), error: () => {} });
    }
  }

  quitar(detalle: DetalleCarrito) {
    const userId = this.auth.getUserId();
    if (!userId) return;
    this.carritoService.quitar(userId, detalle.id_producto).subscribe({ next: c => this.carrito.set(c), error: () => {} });
  }

  vaciar() {
    const userId = this.auth.getUserId();
    if (!userId) return;
    this.carritoService.vaciar(userId).subscribe({ next: () => this.carrito.update(c => c ? { ...c, detalles: [] } : c), error: () => {} });
  }

  generarFactura() {
    const userId = this.auth.getUserId();
    if (!userId || this.generandoFactura()) return;
    this.generandoFactura.set(true);
    this.facturaService.generar(userId).subscribe({
      next: f => {
        this.facturaGenerada.set(f);
        this.generandoFactura.set(false);
        this.carrito.update(c => c ? { ...c, detalles: [] } : c);
      },
      error: err => {
        this.error.set(err.error?.detail || 'Error al generar factura');
        this.generandoFactura.set(false);
      }
    });
  }

  hasItems(): boolean {
    return (this.carrito()?.detalles?.length ?? 0) > 0;
  }

  shortId(id: string): string {
    return id.slice(0, 8).toUpperCase();
  }
}
