import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CategoriaService } from '../../core/services/categoria.service';
import { Categoria } from '../../core/models';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categorias.component.html',
})
export class CategoriasComponent implements OnInit {
  categoriaService = inject(CategoriaService);
  categorias = signal<Categoria[]>([]);
  loading = signal(true);
  error = signal('');
  showModal = signal(false);
  editing = signal<Categoria | null>(null);
  deleteConfirm = signal<string | null>(null);

  form = inject(FormBuilder).nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    descripcion: [''],
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.categoriaService.getAll().subscribe({
      next: c => { this.categorias.set(c); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar'); this.loading.set(false); }
    });
  }

  openCreate() { this.editing.set(null); this.form.reset(); this.showModal.set(true); }

  openEdit(c: Categoria) { this.editing.set(c); this.form.patchValue(c); this.showModal.set(true); }

  closeModal() { this.showModal.set(false); this.editing.set(null); }

  save() {
    if (this.form.invalid) return;
    const data = this.form.getRawValue();
    const e = this.editing();
    const obs = e ? this.categoriaService.update(e.id_categoria, data) : this.categoriaService.create(data);
    obs.subscribe({ next: () => { this.closeModal(); this.load(); }, error: (err) => this.error.set(err.error?.detail || 'Error') });
  }

  confirmDelete(id: string) { this.deleteConfirm.set(id); }
  cancelDelete() { this.deleteConfirm.set(null); }
  doDelete(id: string) { this.categoriaService.delete(id).subscribe({ next: () => { this.deleteConfirm.set(null); this.load(); }, error: () => {} }); }

  dismissError() { this.error.set(''); }

  skeletonRows = Array(5).fill(0);

  getDeleteName(): string {
    const id = this.deleteConfirm();
    if (!id) return '';
    return this.categorias().find(c => c.id_categoria === id)?.nombre ?? '';
  }
}
