import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../core/services/usuario.service';
import { AuthService } from '../../core/services/auth.service';
import { Usuario } from '../../core/models';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
})
export class UsuariosComponent implements OnInit {
  usuarioService = inject(UsuarioService);
  auth = inject(AuthService);
  usuarios = signal<Usuario[]>([]);
  loading = signal(true);
  error = signal('');
  searchQuery = signal('');
  deleteConfirm = signal<string | null>(null);
  deactivateConfirm = signal<string | null>(null);

  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return this.usuarios();
    return this.usuarios().filter(u =>
      u.nombre.toLowerCase().includes(q) ||
      u.nombre_usuario.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.usuarioService.getAll().subscribe({
      next: u => { this.usuarios.set(u); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar usuarios'); this.loading.set(false); }
    });
  }

  confirmDelete(id: string) { this.deleteConfirm.set(id); }
  cancelDelete() { this.deleteConfirm.set(null); }
  doDelete(id: string) {
    this.usuarioService.delete(id).subscribe({ next: () => { this.deleteConfirm.set(null); this.load(); }, error: () => {} });
  }

  confirmDeactivate(id: string) { this.deactivateConfirm.set(id); }
  cancelDeactivate() { this.deactivateConfirm.set(null); }
  doDeactivate(id: string) {
    this.usuarioService.desactivar(id).subscribe({ next: () => { this.deactivateConfirm.set(null); this.load(); }, error: () => {} });
  }

  isCurrentUser(id: string): boolean { return this.auth.getUserId() === id; }
}
