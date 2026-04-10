// ─── Auth ─────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  nombre_usuario: string;
  contrasena: string;
}

export interface LoginResponse {
  token: string;
  usuario_id: string;
  nombre: string;
  rol: string;
  nombre_usuario: string;
}

export interface RegisterRequest {
  nombre: string;
  nombre_usuario: string;
  email: string;
  contrasena: string;
  telefono?: string;
  rol: 'cliente' | 'administrador';
}

// ─── Usuario ──────────────────────────────────────────────────────────────────
export interface Usuario {
  id_usuario: string;
  nombre: string;
  nombre_usuario: string;
  email: string;
  telefono?: string;
  activo: boolean;
  rol: 'cliente' | 'administrador';
  fecha_creacion: string;
  fecha_edicion?: string;
}

export interface UsuarioUpdate {
  nombre?: string;
  email?: string;
  telefono?: string;
}

export interface CambioContrasena {
  contrasena_actual: string;
  nueva_contrasena: string;
}

// ─── Categoria ────────────────────────────────────────────────────────────────
export interface Categoria {
  id_categoria: string;
  nombre: string;
  descripcion?: string;
  fecha_creacion: string;
  fecha_edicion?: string;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string;
}

// ─── Producto ─────────────────────────────────────────────────────────────────
export interface Producto {
  id_producto: string;
  nombre: string;
  descripcion?: string;
  tipo_producto: string;
  codigo: string;
  marca: string;
  precio: number;
  stock: number;
  eliminado: boolean;
  fecha_creacion: string;
  fecha_edicion?: string;
  categoria_id: string;
  categoria?: Categoria;
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string;
  tipo_producto: string;
  codigo: string;
  marca: string;
  precio: number;
  stock: number;
  categoria_id: string;
}

// ─── Descuento ────────────────────────────────────────────────────────────────
export interface Descuento {
  id_descuento: string;
  descripcion: string;
  unidades_minimas: number;
  porcentaje: number;
}

export interface DescuentoCreate {
  descripcion: string;
  unidades_minimas: number;
  porcentaje: number;
}

// ─── Carrito ──────────────────────────────────────────────────────────────────
export interface DetalleCarrito {
  id_detalle_carrito: string;
  id_carrito: string;
  id_producto: string;
  cantidad: number;
  precio_unitario: number;
  producto?: Producto;
}

export interface Carrito {
  id_carrito: string;
  id_usuario: string;
  estado: 'activo' | 'finalizado' | 'cancelado';
  fecha_creacion: string;
  detalles: DetalleCarrito[];
  total?: number;
}

export interface AgregarAlCarritoRequest {
  id_producto: string;
  cantidad: number;
}

export interface ActualizarCantidadRequest {
  cantidad: number;
}

// ─── Factura ──────────────────────────────────────────────────────────────────
export interface DetalleFactura {
  id_detalle_factura: string;
  id_factura: string;
  id_producto: string;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Factura {
  id_factura: string;
  id_usuario: string;
  id_carrito: string;
  total_bruto: number;
  porcentaje_descuento: number;
  total_descuento: number;
  total_neto: number;
  estado: string;
  fecha_creacion: string;
  detalles?: DetalleFactura[];
}

// ─── Tienda ───────────────────────────────────────────────────────────────────
export interface Tienda {
  id_tienda: string;
  nombre: string;
}

export interface Catalogo {
  id_catalogo: string;
  id_tienda: string;
  descripcion?: string;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  detail?: string;
}

// ─── Session ──────────────────────────────────────────────────────────────────
export interface SessionUser {
  token: string;
  usuario_id: string;
  nombre: string;
  nombre_usuario: string;
  rol: 'cliente' | 'administrador';
}
