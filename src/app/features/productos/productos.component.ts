import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProductoService } from '../../core/services/producto.service';
import { CategoriaService } from '../../core/services/categoria.service';
import { CarritoService } from '../../core/services/carrito.service';
import { Producto, Categoria } from '../../core/models';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, NgClass, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './productos.component.html',
})
export class ProductosComponent implements OnInit {
  auth = inject(AuthService);
  productoService = inject(ProductoService);
  categoriaService = inject(CategoriaService);
  carritoService = inject(CarritoService);

  isAdmin = this.auth.isAdmin;
  productos = signal<Producto[]>([]);
  categorias = signal<Categoria[]>([]);
  loading = signal(true);
  error = signal('');
  searchQuery = signal('');
  selectedCategoria = signal('');
  showModal = signal(false);
  editingProducto = signal<Producto | null>(null);
  deleteConfirm = signal<string | null>(null);
  addingToCart = signal<string | null>(null);
  cartSuccess = signal<string | null>(null);

  form = inject(FormBuilder).nonNullable.group({
    nombre: ['', [Validators.required]],
    descripcion: [''],
    tipo_producto: ['', [Validators.required]],
    codigo: ['', [Validators.required]],
    marca: ['', [Validators.required]],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoria_id: ['', [Validators.required]],
  });

  filteredProductos = computed(() => {
    let list = this.productos();
    const q = this.searchQuery().toLowerCase();
    const cat = this.selectedCategoria();
    if (q) list = list.filter(p => p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q));
    if (cat) list = list.filter(p => p.categoria_id === cat);
    return list;
  });

  ngOnInit() {
    this.load();
    this.categoriaService.getAll().subscribe({ next: c => this.categorias.set(c), error: () => {} });
  }

  load() {
    this.loading.set(true);
    this.productoService.getAll().subscribe({
      next: p => { this.productos.set(p); this.loading.set(false); },
      error: () => { this.error.set('Error al cargar productos'); this.loading.set(false); }
    });
  }

  openCreate() { this.editingProducto.set(null); this.form.reset(); this.showModal.set(true); }

  openEdit(p: Producto) {
    this.editingProducto.set(p);
    this.form.patchValue(p);
    this.showModal.set(true);
  }

  closeModal() { this.showModal.set(false); this.editingProducto.set(null); }

  save() {
    if (this.form.invalid) return;
    const data = this.form.getRawValue();
    const edit = this.editingProducto();
    const obs = edit ? this.productoService.update(edit.id_producto, data) : this.productoService.create(data);
    obs.subscribe({ next: () => { this.closeModal(); this.load(); }, error: (e) => this.error.set(e.error?.detail || 'Error al guardar') });
  }

  confirmDelete(id: string) { this.deleteConfirm.set(id); }
  cancelDelete() { this.deleteConfirm.set(null); }
  doDelete(id: string) { this.productoService.delete(id).subscribe({ next: () => { this.deleteConfirm.set(null); this.load(); }, error: () => {} }); }

  addToCart(p: Producto) {
    const userId = this.auth.getUserId();
    if (!userId) { this.error.set('Sesión inválida. Por favor inicia sesión de nuevo.'); return; }
    this.addingToCart.set(p.id_producto);
    this.carritoService.agregar(userId, { id_producto: p.id_producto, cantidad: 1 }).subscribe({
      next: () => {
        this.addingToCart.set(null);
        this.cartSuccess.set(p.id_producto);
        setTimeout(() => this.cartSuccess.set(null), 2500);
      },
      error: (e) => {
        this.addingToCart.set(null);
        this.error.set(e.error?.detail || 'Error al agregar al carrito');
      }
    });
  }

  getCategoryName(id: string): string {
    return this.categorias().find(c => c.id_categoria === id)?.nombre ?? '—';
  }

  dismissError() { this.error.set(''); }

  skeletonItems = Array(8).fill(0);
}
