export interface Espacio {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  observaciones: string;
  foto: string;
  x: number; // Porcentaje horizontal en el croquis
  y: number; // Porcentaje vertical en el croquis
}

export const categorias = [
  "Todas",
  "ENTRADA",
  "AULAS",
  "PATIOS",
  "SECTORES ADMINISTRATIVOS",
  "MÁSTIL",
  "SALONES"
] as const;

export type FiltroCategoria = typeof categorias[number];

export const info = {
  anio: "2026",
  materia: "Práctica Docente I",
  titulo: "Mapeo colectivo",
  subtitulo: "Contexto, Comunidad y Escuela",
  escuela: "Colegio Secundario Héroes de Malvinas N.º 5207",
};

export const espacios: Espacio[] = [
  {
    id: 1,
    nombre: "Patio Externo",
    categoria: "PATIOS",
    descripcion: "Área principal de recreación, esparcimiento y actividades al aire libre de los estudiantes.",
    observaciones: "Espacio abierto equipado con áreas verdes y bancos perimetrales.",
    foto: "/fotos/patio externo.jpeg",
    x: 13,
    y: 25
  },
  {
    id: 2,
    nombre: "4° Año",
    categoria: "AULAS",
    descripcion: "Aula correspondiente al cuarto año del nivel secundario.",
    observaciones: "Ubicada en el ala norte de aulas principales.",
    foto: "/fotos/4anio.jpeg",
    x: 35,
    y: 33
  },
  {
    id: 3,
    nombre: "3° Año",
    categoria: "AULAS",
    descripcion: "Aula correspondiente al tercer año.",
    observaciones: "Zona de circulación frecuente de estudiantes.",
    foto: "/fotos/3anio.jpeg",
    x: 43,
    y: 33
  },
  {
    id: 4,
    nombre: "1° Año",
    categoria: "AULAS",
    descripcion: "Aula correspondiente al primer año de la institución.",
    observaciones: "Espacio destinado al ingreso al ciclo secundario.",
    foto: "/fotos/1anio.jpeg",
    x: 51,
    y: 33
  },
  {
    id: 5,
    nombre: "2° Año",
    categoria: "AULAS",
    descripcion: "Aula correspondiente al segundo año.",
    observaciones: "Ubicada en la continuidad del ala de aulas principales.",
    foto: "/fotos/2anio.jpeg",
    x: 61,
    y: 33
  },
  {
    id: 6,
    nombre: "5° Año",
    categoria: "AULAS",
    descripcion: "Aula correspondiente al último año del ciclo orientado.",
    observaciones: "Sector próximo a las áreas administrativas y de circulación.",
    foto: "/fotos/5to año.jpeg",
    x: 33,
    y: 45
  },
  {
    id: 7,
    nombre: "Entrada",
    categoria: "ENTRADA",
    descripcion: "Acceso principal a la institución educativa.",
    observaciones: "Punto de recepción, llegada y control de ingreso.",
    foto: "/fotos/entrada.jpeg",
    x: 76.5,
    y: 18
  },
  {
    id: 8,
    nombre: "Patio Interno",
    categoria: "PATIOS",
    descripcion: "Pasillo central y espacio distribuidor de circulación institucional.",
    observaciones: "Caracterizado por su coloración distintiva en el plano arquitectónico.",
    foto: "/fotos/patio interno.jpeg",
    x: 50,
    y: 45
  },
  {
    id: 9,
    nombre: "Mástil",
    categoria: "MÁSTIL",
    descripcion: "Sitio cívico central destinado a los actos escolares y formaciones.",
    observaciones: "Ubicado frente al sector morado y pasillos de circulación.",
    foto: "/fotos/mastil.jpeg",
    x: 59,
    y: 50
  },
  {
    id: 10,
    nombre: "Dirección Secundaria",
    categoria: "SECTORES ADMINISTRATIVOS",
    descripcion: "Oficina directiva y de gestión del nivel secundario.",
    observaciones: "Área administrativa para la coordinación institucional.",
    foto: "/fotos/direccion.jpeg",
    x: 77,
    y: 48
  },
   {
    id: 11,
    nombre: "SUM",
    categoria: "SALONES",
    descripcion: "Salón de uso generales.",
    observaciones: "Salón amplio para actividades diversas, reuniones y eventos escolares.",
    foto: "/fotos/sum.jpeg",
    x: 37,
    y: 72
  },
   {
    id: 12,
    nombre: "SALA DE INFORMÁTICA",
    categoria: "SALONES",
    descripcion: "Salón para uso de informática.",
    observaciones: "Sala dedicada especialmente para el trabajo con computadoras y tecnología educativa.",
    foto: "/fotos/direccion.jpeg",
    x: 84,
    y: 15
  }
];

export const ZONAS_CRITICAS = [
  {
    id: 'critica-1',
    titulo: 'Zona Crítica 1: Vulnerabilidad Vial y Anegamiento (RP N° 11)',
    tipo: 'Riesgo Vial y Climático',
    coords: [-24.6915, -65.1376],
    radio: 120,
    color: '#ef4444',
    descripcion:
      'Tramo de acceso directo a la escuela sobre la Ruta Provincial N° 11 y caminos vecinales de tierra. En días de lluvia presenta anegamiento y barro que dificultan el transporte público y rural, generando ausentismo estudiantil y docente. Además, el tránsito pesado de camiones y maquinaria agrícola sin dársenas peatonales implica riesgo vial en horarios de ingreso y salida.'
  },
  {
    id: 'critica-2',
    titulo: 'Zona Crítica 2: Exposición Ambiental por Actividad Agrícola Intensiva',
    tipo: 'Problemática Socioambiental',
    coords: [-24.6902, -65.1352],
    radio: 180,
    color: '#f97316',
    descripcion:
      'Perímetro de fincas productivas colindantes al predio escolar. La cercanía inmediata a los lotes de cultivo expone a la comunidad educativa a la deriva de fumigaciones con agroquímicos, polvo en suspensión durante el movimiento de suelo y humo por quema de rastrojos o pastizales.'
  },
  {
    id: 'critica-3',
    titulo: 'Zona Crítica 3: Riesgo Físico y Sanitario en Represas de Riego',
    tipo: 'Riesgo Físico y Ambiental',
    coords: [-24.6942, -65.1398],
    radio: 140,
    color: '#eab308',
    descripcion:
      'Reservorios de agua y canales de riego cercanos a los recorridos cotidianos. La falta de cerramientos perimetrales seguros y señalización representa un peligro físico para niños y jóvenes, además de constituir potenciales focos de proliferación de vectores sanitarios (como el mosquito del dengue) en época estival.'
  },
  {
    id: 'critica-4',
    titulo: 'Zona Crítica 4: Brecha Digital y Limitación de Conectividad Rural',
    tipo: 'Problemática Estructural / Pedagógica',
    coords: [-24.6923, -65.1365],
    radio: 110,
    color: '#a855f7',
    descripcion:
      'Restricción de ancho de banda en el entorno rural (limitado a 1-2 Mbps por dispositivo en el piso tecnológico escolar mediante enlace de Nubicom) e inestabilidad de señal móvil en las fincas aledañas, lo que condiciona el uso continuo de recursos interactivos en el aula y dificulta la continuidad pedagógica virtual cuando el clima impide asistir.'
  }
];