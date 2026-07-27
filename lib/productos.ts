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
    id: "prod-1",
    nombre: "Mezcal Artesanal de Charcas",
    descripcion: "Mezcal joven 100% agave salmiana, destilado en ollas de barro tradicionales de la región del Altiplano potosino.",
    categoria: "Bebidas",
    precio: 450.00,
    imagenUrl: "https://images.unsplash.com/photo-1596463059283-99d0e2e987c2?auto=format&fit=crop&q=80&w=800",
    artesano: "Maestro Mezcalero Juan Pérez"
  },
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
    id: "prod-3",
    nombre: "Café Orgánico de Xilitla",
    descripcion: "Café de altura cultivado bajo sombra en la Huasteca Potosina, con notas de chocolate y piloncillo.",
    categoria: "Alimentos",
    precio: 180.00,
    imagenUrl: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&q=80&w=800",
    artesano: "Cooperativa de Cafetaleros Huastecos"
  },
  {
    id: "prod-4",
    nombre: "Campechanas de Santa María",
    descripcion: "Deliciosos panes de hojaldre crujientes y dulces, glaseados con azúcar. El postre perfecto para acompañar un café.",
    categoria: "Alimentos",
    precio: 85.00,
    imagenUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800",
    artesano: "Panadería La Tradición"
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
    id: "prod-6",
    nombre: "Queso de Tuna",
    descripcion: "Dulce tradicional potosino elaborado con el jugo de la tuna cardona reducido a fuego lento. No contiene lácteos.",
    categoria: "Alimentos",
    precio: 120.00,
    imagenUrl: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800",
    artesano: "Dulces Típicos Doña María"
  }
];
