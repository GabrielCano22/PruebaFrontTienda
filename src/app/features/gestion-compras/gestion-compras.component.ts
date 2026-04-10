import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FacturaService } from '../../core/services/factura.service';
import { Factura } from '../../core/models';

@Component({
  selector: 'app-gestion-compras',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, RouterLink],
  templateUrl: './gestion-compras.component.html',
})
export class GestionComprasComponent implements OnInit {
  facturaService = inject(FacturaService);

  facturas = signal<Factura[]>([]);
  loading = signal(true);
  error = signal('');
  searchQuery = signal('');
  filterEstado = signal<string>('todos');
  actionConfirm = signal<{ id: string; action: 'aprobar' | 'rechazar' } | null>(null);
  processing = signal(false);

  filtered = computed(() => {
    let list = this.facturas();
    const estado = this.filterEstado();
    if (estado !== 'todos') {
      list = list.filter(f => f.estado === estado);
    }
    const q = this.searchQuery().toLowerCase();
    if (q) {
      list = list.filter(f =>
        f.id_factura.toLowerCase().includes(q) ||
        f.id_usuario.toLowerCase().includes(q)
      );
    }
    return list;
  });

  stats = computed(() => {
    const all = this.facturas();
    return {
      total: all.length,
      pendientes: all.filter(f => f.estado === 'pendiente').length,
      pagadas: all.filter(f => f.estado === 'pagada').length,
      anuladas: all.filter(f => f.estado === 'anulada').length,
    };
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.facturaService.getAllFacturas().subscribe({
      next: f => { this.facturas.set(f); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar facturas'); this.loading.set(false); }
    });
  }

  confirmAction(id: string, action: 'aprobar' | 'rechazar') {
    this.actionConfirm.set({ id, action });
  }

  cancelAction() { this.actionConfirm.set(null); }

  executeAction() {
    const confirm = this.actionConfirm();
    if (!confirm || this.processing()) return;
    this.processing.set(true);

    const obs = confirm.action === 'aprobar'
      ? this.facturaService.aprobar(confirm.id)
      : this.facturaService.rechazar(confirm.id);

    obs.subscribe({
      next: () => {
        this.processing.set(false);
        this.actionConfirm.set(null);
        this.facturaService.invalidateCache();
        this.load();
      },
      error: (err) => {
        this.error.set(err.error?.detail || 'Error al procesar la factura');
        this.processing.set(false);
        this.actionConfirm.set(null);
      }
    });
  }

  shortId(id: string): string {
    return id.slice(0, 8).toUpperCase();
  }
}
