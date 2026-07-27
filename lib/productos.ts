export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: string;
  precio: number;
  imagenUrl: string;
  artesano: string;
}

export const productos: Producto[] = [
  {
    id: "prod-2",
    nombre: "Rebozo de Seda de Santa María del Río",
    descripcion: "Elegante rebozo tejido a mano en telar de cintura con hilos de seda, utilizando la técnica tradicional del ikat.",
    categoria: "Textiles",
    precio: 2500.00,
    imagenUrl: "https://images.unsplash.com/photo-1605389659089-6019343ee0cc?auto=format&fit=crop&q=80&w=800",
    artesano: "Taller Hermanas García"
  },
  {
    id: "prod-5",
    nombre: "Cesto de Palma de la Huasteca",
    descripcion: "Colorido cesto tejido a mano con fibras de palma natural, teñidas con pigmentos de la región.",
    categoria: "Artesanías",
    precio: 320.00,
    imagenUrl: "https://images.unsplash.com/photo-1590725140246-20acdb6135dd?auto=format&fit=crop&q=80&w=800",
    artesano: "Familia Hernández"
  },
  {
    id: "prod-7",
    nombre: "Máscara de Madera Tallada",
    descripcion: "Auténtica máscara de madera tallada a mano utilizada en las danzas tradicionales de Xantolo.",
    categoria: "Talla en Madera",
    precio: 1200.00,
    imagenUrl: "https://images.unsplash.com/photo-1588667551065-9856fdb47e7d?auto=format&fit=crop&q=80&w=800",
    artesano: "Maestro Talla Francisco"
  },
  {
    id: "prod-8",
    nombre: "Morral Bordado Tenek",
    descripcion: "Hermoso morral con bordados tradicionales Tenek de hilos de colores sobre tela de algodón, simbolizando la cosmogonía huasteca.",
    categoria: "Textiles",
    precio: 450.00,
    imagenUrl: "https://images.unsplash.com/photo-1598808503746-f34c53b9323e?auto=format&fit=crop&q=80&w=800",
    artesano: "Cooperativa de Mujeres Artesanas"
  }
];
