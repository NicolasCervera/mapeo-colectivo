export type Categoria =
  | "General"
  | "Académico"
  | "Gestión"
  | "Recreación"
  | "Servicios";

export interface Espacio {
  id: number;
  nombre: string;
  categoria: Categoria;
  foto: string;
  descripcion: string;
  observaciones: string;
  x: number;
  y: number;
}


export const espacios: Espacio[] = [
  {
    id: 1,
    nombre: "Referencia 01",
    categoria: "General",
    foto: "/fotos/referencia-01.jpg",
    descripcion: "Descripción del espacio observado durante el recorrido.",
    observaciones:
      "Agregar aquí una observación, uso del espacio o elemento relevante.",
    x: 18,
    y: 22,
  },
  {
    id: 2,
    nombre: "Referencia 02",
    categoria: "Académico",
    foto: "/fotos/referencia-02.jpg",
    descripcion: "Descripción del espacio observado durante el recorrido.",
    observaciones:
      "Agregar aquí una observación, uso del espacio o elemento relevante.",
    x: 40,
    y: 22,
  },
  {
    id: 3,
    nombre: "Referencia 03",
    categoria: "Gestión",
    foto: "/fotos/referencia-03.jpg",
    descripcion: "Descripción del espacio observado durante el recorrido.",
    observaciones:
      "Agregar aquí una observación, uso del espacio o elemento relevante.",
    x: 66,
    y: 25,
  },
  {
    id: 4,
    nombre: "Referencia 04",
    categoria: "Académico",
    foto: "/fotos/referencia-04.jpg",
    descripcion: "Descripción del espacio observado durante el recorrido.",
    observaciones:
      "Agregar aquí una observación, uso del espacio o elemento relevante.",
    x: 24,
    y: 48,
  },
  {
    id: 5,
    nombre: "Referencia 05",
    categoria: "Recreación",
    foto: "/fotos/referencia-05.jpg",
    descripcion: "Descripción del espacio observado durante el recorrido.",
    observaciones:
      "Agregar aquí una observación, uso del espacio o elemento relevante.",
    x: 49,
    y: 48,
  },
  {
    id: 6,
    nombre: "Referencia 06",
    categoria: "Servicios",
    foto: "/fotos/referencia-06.jpg",
    descripcion: "Descripción del espacio observado durante el recorrido.",
    observaciones:
      "Agregar aquí una observación, uso del espacio o elemento relevante.",
    x: 75,
    y: 48,
  },
  {
    id: 7,
    nombre: "Referencia 07",
    categoria: "Académico",
    foto: "/fotos/referencia-07.jpg",
    descripcion: "Descripción del espacio observado durante el recorrido.",
    observaciones:
      "Agregar aquí una observación, uso del espacio o elemento relevante.",
    x: 27,
    y: 74,
  },
  {
    id: 8,
    nombre: "Referencia 08",
    categoria: "General",
    foto: "/fotos/referencia-08.jpg",
    descripcion: "Descripción del espacio observado durante el recorrido.",
    observaciones:
      "Agregar aquí una observación, uso del espacio o elemento relevante.",
    x: 52,
    y: 74,
  },
  {
    id: 9,
    nombre: "Referencia 09",
    categoria: "Recreación",
    foto: "/fotos/referencia-09.jpg",
    descripcion: "Descripción del espacio observado durante el recorrido.",
    observaciones:
      "Agregar aquí una observación, uso del espacio o elemento relevante.",
    x: 78,
    y: 74,
  },
  {
    id: 10,
    nombre: "Referencia 10",
    categoria: "Servicios",
    foto: "/fotos/referencia-10.jpg",
    descripcion: "Descripción del espacio observado durante el recorrido.",
    observaciones:
      "Agregar aquí una observación, uso del espacio o elemento relevante.",
    x: 15,
    y: 90,
  },
  {
    id: 11,
    nombre: "Referencia 11",
    categoria: "Gestión",
    foto: "/fotos/referencia-11.jpg",
    descripcion: "Descripción del espacio observado durante el recorrido.",
    observaciones:
      "Agregar aquí una observación, uso del espacio o elemento relevante.",
    x: 50,
    y: 90,
  },
  {
    id: 12,
    nombre: "Referencia 12",
    categoria: "General",
    foto: "/fotos/referencia-12.jpg",
    descripcion: "Descripción del espacio observado durante el recorrido.",
    observaciones:
      "Agregar aquí una observación, uso del espacio o elemento relevante.",
    x: 84,
    y: 90,
  },
];

export const categorias = [
  "Todas",
  "General",
  "Académico",
  "Gestión",
  "Recreación",
  "Servicios",
] as const;

export type FiltroCategoria = (typeof categorias)[number];

export const info = {
  escuela: "Colegio Secundario Héroes de Malvinas N.º 5207",
  materia: "Taller Práctica Docente I",
  titulo: "Mapeo colectivo",
  subtitulo: "Una mirada situada sobre los espacios de la institución",
  anio: "2026",
};