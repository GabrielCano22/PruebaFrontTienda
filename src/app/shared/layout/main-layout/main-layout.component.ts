import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CarritoService } from '../../../core/services/carrito.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  auth = inject(AuthService);
  carritoService = inject(CarritoService);

  sidebarOpen = signal(true);
  mobileOpen = signal(false);

  session = this.auth.session;
  isAdmin = this.auth.isAdmin;
  cartCount = this.carritoService.cartCount;

  userInitial = computed(() => {
    const name = this.session()?.nombre ?? '';
    return name.charAt(0).toUpperCase();
  });

  toggleSidebar() { this.sidebarOpen.update(v => !v); }
  toggleMobile() { this.mobileOpen.update(v => !v); }
  closeMobile() { this.mobileOpen.set(false); }

  logout() { this.auth.logout(); }
}
