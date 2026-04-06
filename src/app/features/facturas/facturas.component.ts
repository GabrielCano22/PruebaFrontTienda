import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FacturaService } from '../../core/services/factura.service';
import { Factura } from '../../core/models';

@Component({
  selector: 'app-facturas',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './facturas.component.html',
})
export class FacturasComponent implements OnInit {
  auth = inject(AuthService);
  facturaService = inject(FacturaService);
  facturas = signal<Factura[]>([]);
  loading = signal(true);
  error = signal('');

  totalGastado = computed(() =>
    this.facturas().reduce((sum, f) => sum + f.total_neto, 0)
  );

  totalAhorrado = computed(() =>
    this.facturas().reduce((sum, f) => sum + f.total_descuento, 0)
  );

  ngOnInit() {
    const userId = this.auth.getUserId();
    if (userId) {
      this.facturaService.getMisFacturas(userId).subscribe({
        next: f => { this.facturas.set(f); this.loading.set(false); },
        error: () => { this.error.set('Error al cargar'); this.loading.set(false); }
      });
    }
  }

  shortId(id: string): string {
    return id.slice(0, 8).toUpperCase();
  }

  estadoColor(estado: string): string {
    switch (estado) {
      case 'pagado': return 'green';
      case 'pendiente': return 'amber';
      case 'cancelado': return 'red';
      default: return 'gray';
    }
  }
}
