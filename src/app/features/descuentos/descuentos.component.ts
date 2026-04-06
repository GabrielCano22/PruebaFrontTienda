import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { DescuentoService } from '../../core/services/descuento.service';
import { Descuento } from '../../core/models';

@Component({
  selector: 'app-descuentos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './descuentos.component.html',
})
export class DescuentosComponent implements OnInit {
  descuentoService = inject(DescuentoService);
  descuentos = signal<Descuento[]>([]);
  loading = signal(true);
  error = signal('');
  showModal = signal(false);
  editing = signal<Descuento | null>(null);
  deleteConfirm = signal<string | null>(null);

  form = inject(FormBuilder).nonNullable.group({
    descripcion: ['', [Validators.required]],
    unidades_minimas: [1, [Validators.required, Validators.min(1)]],
    porcentaje: [5, [Validators.required, Validators.min(1), Validators.max(100)]],
  });

  ngOnInit() { this.load(); }

  load() {
    this.loading.set(true);
    this.descuentoService.getAll().subscribe({
      next: d => { this.descuentos.set(d); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar'); this.loading.set(false); }
    });
  }

  openCreate() { this.editing.set(null); this.form.reset({ unidades_minimas: 1, porcentaje: 5, descripcion: '' }); this.showModal.set(true); }
  openEdit(d: Descuento) { this.editing.set(d); this.form.patchValue(d); this.showModal.set(true); }
  closeModal() { this.showModal.set(false); this.editing.set(null); }

  save() {
    if (this.form.invalid) return;
    const data = this.form.getRawValue();
    const e = this.editing();
    const obs = e ? this.descuentoService.update(e.id_descuento, data) : this.descuentoService.create(data);
    obs.subscribe({ next: () => { this.closeModal(); this.load(); }, error: err => this.error.set(err.error?.detail || 'Error') });
  }

  confirmDelete(id: string) { this.deleteConfirm.set(id); }
  cancelDelete() { this.deleteConfirm.set(null); }
  doDelete(id: string) { this.descuentoService.delete(id).subscribe({ next: () => { this.deleteConfirm.set(null); this.load(); }, error: () => {} }); }

  sortedDescuentos() {
    return [...this.descuentos()].sort((a, b) => a.unidades_minimas - b.unidades_minimas);
  }

  discountColor(pct: number): string {
    if (pct <= 10) return 'green';
    if (pct <= 25) return 'amber';
    return 'red';
  }

  get previewPorcentaje(): number {
    return (this.form.get('porcentaje')?.value as number) ?? 0;
  }

  previewBg(): string {
    const v = this.previewPorcentaje;
    if (v <= 10) return 'rgba(34,197,94,.12)';
    if (v <= 25) return 'rgba(245,158,11,.12)';
    return 'rgba(220,38,38,.12)';
  }

  previewBorder(): string {
    const v = this.previewPorcentaje;
    if (v <= 10) return '1px solid rgba(34,197,94,.25)';
    if (v <= 25) return '1px solid rgba(245,158,11,.25)';
    return '1px solid rgba(220,38,38,.25)';
  }

  previewColor(): string {
    const v = this.previewPorcentaje;
    if (v <= 10) return '#4ADE80';
    if (v <= 25) return '#FCD34D';
    return '#F87171';
  }
}
