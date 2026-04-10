import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FacturaService } from '../../../core/services/factura.service';
import { Factura } from '../../../core/models';

@Component({
  selector: 'app-factura-detalle',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './factura-detalle.component.html',
})
export class FacturaDetalleComponent implements OnInit {
  facturaService = inject(FacturaService);
  route = inject(ActivatedRoute);
  factura = signal<Factura | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.facturaService.getDetalle(id).subscribe({
        next: f => { this.factura.set(f); this.loading.set(false); },
        error: () => { this.error.set('Factura no encontrada'); this.loading.set(false); }
      });
    }
  }

  shortId(id: string): string {
    return id.slice(0, 8).toUpperCase();
  }

  print() {
    window.print();
  }
}
