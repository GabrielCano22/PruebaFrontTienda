import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProductoService } from '../../core/services/producto.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { DescuentoService } from '../../core/services/descuento.service';
import { FacturaService } from '../../core/services/factura.service';
import { TiendaService } from '../../core/services/tienda.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  auth = inject(AuthService);
  productoService = inject(ProductoService);
  categoriaService = inject(CategoriaService);
  usuarioService = inject(UsuarioService);
  descuentoService = inject(DescuentoService);
  facturaService = inject(FacturaService);
  tiendaService = inject(TiendaService);

  session = this.auth.session;
  isAdmin = this.auth.isAdmin;

  stats = signal({ productos: 0, categorias: 0, usuarios: 0, descuentos: 0 });
  misFacturas = this.facturaService.facturas;
  tiendaNombre = signal('La Tienda');
  loading = signal(true);

  ngOnInit() {
    this.tiendaService.getTienda().subscribe({ next: t => this.tiendaNombre.set(t.nombre), error: () => {} });

    if (this.isAdmin()) {
      this.productoService.getAll().subscribe({ next: p => this.stats.update(s => ({ ...s, productos: p.length })), error: () => {} });
      this.categoriaService.getAll().subscribe({ next: c => this.stats.update(s => ({ ...s, categorias: c.length })), error: () => {} });
      this.usuarioService.getAll().subscribe({ next: u => this.stats.update(s => ({ ...s, usuarios: u.length })), error: () => {} });
      this.descuentoService.getAll().subscribe({ next: d => this.stats.update(s => ({ ...s, descuentos: d.length })), error: () => {} });
    } else {
      this.productoService.getAll().subscribe({ next: p => this.stats.update(s => ({ ...s, productos: p.length })), error: () => {} });
      this.categoriaService.getAll().subscribe({ next: c => this.stats.update(s => ({ ...s, categorias: c.length })), error: () => {} });
      const userId = this.auth.getUserId();
      if (userId) {
        this.facturaService.getMisFacturas(userId);
      }
    }
    this.loading.set(false);
  }
}
