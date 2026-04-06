import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
})
export class PerfilComponent implements OnInit {
  auth = inject(AuthService);
  usuarioService = inject(UsuarioService);
  usuario = signal<Usuario | null>(null);
  loading = signal(true);
  saving = signal(false);
  savingPassword = signal(false);
  successMsg = signal('');
  error = signal('');
  activeTab = signal<'info' | 'password'>('info');
  showCurrentPassword = signal(false);
  showNewPassword = signal(false);

  fb = inject(FormBuilder);

  profileForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
  });

  passwordForm = this.fb.nonNullable.group({
    contrasena_actual: ['', [Validators.required]],
    nueva_contrasena: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit() {
    const userId = this.auth.getUserId();
    if (userId) {
      this.usuarioService.getById(userId).subscribe({
        next: u => { this.usuario.set(u); this.profileForm.patchValue(u); this.loading.set(false); },
        error: () => this.loading.set(false)
      });
    }
  }

  saveProfile() {
    if (this.profileForm.invalid || this.saving()) return;
    this.saving.set(true);
    this.error.set('');
    const userId = this.auth.getUserId()!;
    this.usuarioService.update(userId, this.profileForm.getRawValue()).subscribe({
      next: () => {
        this.successMsg.set('Perfil actualizado correctamente');
        this.saving.set(false);
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: err => { this.error.set(err.error?.detail || 'Error al guardar'); this.saving.set(false); }
    });
  }

  savePassword() {
    if (this.passwordForm.invalid || this.savingPassword()) return;
    this.savingPassword.set(true);
    this.error.set('');
    const userId = this.auth.getUserId()!;
    this.usuarioService.cambiarContrasena(userId, this.passwordForm.getRawValue()).subscribe({
      next: () => {
        this.successMsg.set('Contraseña actualizada correctamente');
        this.passwordForm.reset();
        this.savingPassword.set(false);
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: err => { this.error.set(err.error?.detail || 'Error al cambiar contraseña'); this.savingPassword.set(false); }
    });
  }

  passwordStrength(): number {
    const val = this.passwordForm.get('nueva_contrasena')?.value ?? '';
    if (!val) return 0;
    let score = 0;
    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  }

  passwordStrengthLabel(): string {
    const s = this.passwordStrength();
    if (s <= 1) return 'Muy débil';
    if (s === 2) return 'Débil';
    if (s === 3) return 'Regular';
    if (s === 4) return 'Fuerte';
    return 'Muy fuerte';
  }

  passwordStrengthColor(): string {
    const s = this.passwordStrength();
    if (s <= 1) return '#DC2626';
    if (s === 2) return '#F97316';
    if (s === 3) return '#EAB308';
    if (s === 4) return '#22C55E';
    return '#10B981';
  }

  getInitial(): string {
    const u = this.usuario();
    return u ? u.nombre.charAt(0).toUpperCase() : '?';
  }
}
