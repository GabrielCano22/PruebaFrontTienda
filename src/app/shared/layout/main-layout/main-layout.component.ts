import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { FacturaService } from '../../../core/services/factura.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit {
  auth = inject(AuthService);
  carritoService = inject(CarritoService);
  private facturaService = inject(FacturaService);

  sidebarOpen = signal(true);
  mobileOpen = signal(false);

  session = this.auth.session;
  isAdmin = this.auth.isAdmin;
  cartCount = this.carritoService.cartCount;

  userInitial = computed(() => {
    const name = this.session()?.nombre ?? '';
    return name.charAt(0).toUpperCase();
  });

  ngOnInit() {
    // Prefetch facturas in the background so the data is ready
    // when the user navigates to "Mis Compras"
    const userId = this.auth.getUserId();
    if (userId) {
      this.facturaService.prefetch(userId);
    }
  }

  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  toggleMobile() { this.mobileOpen.update(v => !v); }
  closeMobile() { this.mobileOpen.set(false); }

  logout() { this.auth.logout(); }
}
