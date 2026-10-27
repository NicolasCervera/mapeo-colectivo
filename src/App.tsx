import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  categorias,
  espacios,
  info,
  type Espacio,
  type FiltroCategoria,
} from "./data/espacios";

declare global {
  interface Window {
    L?: any;
  }
}

interface PuntoTerritorio {
  id: string;
  codigo: string;
  nombre: string;
  subtitulo: string;
  descripcion: string;
  lat: number;
  lng: number;
  esEscuela?: boolean;
}

const PUNTOS_TERRITORIO: PuntoTerritorio[] = [
  {
    id: "school",
    codigo: "E",
    nombre: "Colegio Secundario Héroes de Malvinas N.º 5207",
    subtitulo: "Seleccioná para ingresar al mapeo interno de la escuela.",
    descripcion:
      "Institución educativa de gestión estatal rural ubicada sobre la Ruta Provincial N° 11, en Finca San Roque. Comparte el edificio escolar con los niveles Inicial y Primario (turno mañana), funcionando el nivel Secundario en el turno tarde con orientación en Humanidades y una matrícula inferior a los 100 estudiantes.",
    lat: -24.6919084,
    lng: -65.1370439,
    esEscuela: true,
  },
  {
    id: "capilla",
    codigo: "VC",
    nombre: "Capilla Virgen del Carmen",
    subtitulo: "Referencia comunitaria y religiosa cercana al colegio.",
    descripcion:
      "Capilla ubicada sobre el corredor principal de Betania, a pocos metros de la escuela, punto de referencia histórico y social para las familias de la zona.",
    lat: -24.692982,
    lng: -65.135842,
  },
  {
    id: "betania",
    codigo: "B",
    nombre: "Paraje Rural de Betania",
    subtitulo: "Pueblo y entorno comunitario.",
    descripcion:
      "Entorno rural inmediato que rodea al establecimiento. Nuclea a familias vinculadas al trabajo agrícola estacional y pequeños productores rurales, constituyendo el radio de procedencia directa de gran parte del estudiantado.",
    lat: -24.694849,
    lng: -65.148925,
  },
  {
    id: "el-bordo",
    codigo: "EB",
    nombre: "Localidad de El Bordo",
    subtitulo: "Localidad vecina conectada con el circuito escolar.",
    descripcion:
      "Centros urbanos más próximos con los que interactúa la escuela. Desde estas localidades se desplaza diariamente parte del cuerpo docente y de los estudiantes de zonas periurbanas, siendo además los nodos de acceso a servicios de salud, comercio y administración.",
    lat: -24.6628,
    lng: -65.1061,
  },
  {
    id: "campo-santo",
    codigo: "CS",
    nombre: "Localidad de Campo Santo",
    subtitulo: "Cabecera municipal de referencia administrativa y social.",
    descripcion:
      "Centros urbanos más próximos con los que interactúa la escuela. Desde estas localidades se desplaza diariamente parte del cuerpo docente y de los estudiantes de zonas periurbanas, siendo además los nodos de acceso a servicios de salud, comercio y administración.",
    lat: -24.6785216,
    lng: -65.1046597,
  },
  {
    id: "fincas",
    codigo: "F",
    nombre: "Fincas y áreas productivas cercanas",
    subtitulo: "Referencias productivas del entorno inmediato a Betania.",
    descripcion:
      "Unidades de explotación agrícola intensiva (principalmente cultivo de tabaco, caña de azúcar y hortalizas) que rodean el predio escolar. La dinámica de siembra y cosecha organiza la economía familiar de los alumnos, caracterizada por ingresos variables según la temporada.",
    lat: -24.6855,
    lng: -65.1255,
  },
  {
    id: "campos",
    codigo: "CA",
    nombre: "Campos de los alrededores y reservorios",
    subtitulo: "Parcelas rurales, cuadros de cultivo y represas del sector.",
    descripcion:
      "Campos abiertos, lotes agrícolas, cortinas forestales y reservorios de agua que rodean el paraje de Betania y el predio del colegio.",
    lat: -24.6995,
    lng: -65.1395,
  },
];

let leafletLoaderPromise: Promise<any> | null = null;

function loadLeaflet(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.L) return Promise.resolve(window.L);
  if (leafletLoaderPromise) return leafletLoaderPromise;

  leafletLoaderPromise = new Promise((resolve) => {
    if (!document.getElementById("leaflet-css-cdn")) {
      const link = document.createElement("link");
      link.id = "leaflet-css-cdn";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    if (!document.getElementById("leaflet-custom-pin-styles")) {
      const style = document.createElement("style");
      style.id = "leaflet-custom-pin-styles";
      style.textContent = `
        .custom-territory-leaflet-pin {
          background: transparent !important;
          border: 0 !important;
        }
      `;
      document.head.appendChild(style);
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = () => {
      const fallback = document.createElement("script");
      fallback.src =
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      fallback.async = true;
      fallback.onload = () => resolve(window.L);
      document.head.appendChild(fallback);
    };
    document.head.appendChild(script);
  });

  return leafletLoaderPromise;
}

const transition = {
  duration: 0.35,
  ease: "easeOut" as const,
};

function Photo({
  space,
  className = "",
}: {
  space: Espacio;
  className?: string;
}) {
  return (
    <div className={`photo-frame ${className}`}>
      <img
        src={space.foto}
        alt={space.nombre}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none";
          event.currentTarget.parentElement?.classList.add("is-empty");
        }}
      />

      <div className="photo-empty">
        <span className="photo-empty-icon">📷</span>
        <strong>Foto pendiente</strong>
        <small>{space.foto.replace("/fotos/", "")}</small>
      </div>

      <div className="photo-shine" aria-hidden="true" />
    </div>
  );
}

function App() {
  const [view, setView] = useState<
    "cover" | "environment" | "home" | "map" | "detail"
  >("cover");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FiltroCategoria>("Todas");
  const [lightbox, setLightbox] = useState(false);
  const [selectedTerritoryPin, setSelectedTerritoryPin] = useState<
    string | null
  >(null);

  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);

  const selected = espacios.find((space) => space.id === selectedId) ?? null;

  const selectedTerritoryPoint = useMemo(
    () =>
      PUNTOS_TERRITORIO.find((punto) => punto.id === selectedTerritoryPin) ??
      null,
    [selectedTerritoryPin],
  );

  const filteredSpaces = useMemo(
    () =>
      filter === "Todas"
        ? espacios
        : espacios.filter((space) => space.categoria === filter),
    [filter],
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [view, selectedId]);

  useEffect(() => {
    if (!mapContainer) return;

    let cancelled = false;
    let currentMap: any = null;
    let resizeObserver: ResizeObserver | null = null;

    loadLeaflet().then((L) => {
      if (cancelled || !L || !mapContainer) return;

      currentMap = L.map(mapContainer, {
        center: [-24.682751, -65.1363263],
        zoom: 14,
        zoomControl: true,
      });

      setMapInstance(currentMap);

      // Vista satelital híbrida de Google Maps con rutas y nombres de localidades
      L.tileLayer("https://mt1.google.com/vt/lyrs=y&hl=es&x={x}&y={y}&z={z}", {
        maxZoom: 20,
        attribution: "© Google Maps",
      }).addTo(currentMap);

      PUNTOS_TERRITORIO.forEach((punto) => {
        const bgColor = punto.esEscuela ? "#1b2927" : "#d9a83d";
        const textColor = punto.esEscuela ? "#ffffff" : "#17211f";

        const icon = L.divIcon({
          className: "custom-territory-leaflet-pin",
          html: `<button type="button" aria-label="${punto.nombre}" style="display:flex;align-items:center;justify-content:center;width:38px;height:38px;padding:0;border:3px solid #fff;border-radius:50%;background:${bgColor};color:${textColor};font-family:'DM Sans',Arial,sans-serif;font-size:12px;font-weight:800;box-shadow:0 5px 16px rgba(0,0,0,0.45);cursor:pointer;">${punto.codigo}</button>`,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker([punto.lat, punto.lng], {
          icon,
          zIndexOffset: punto.esEscuela ? 1000 : 100,
        }).addTo(currentMap);

        marker.bindTooltip(punto.nombre, {
          direction: "top",
          offset: [0, -20],
        });

        marker.on("click", () => {
          if (punto.esEscuela) {
            setSelectedTerritoryPin(null);
            setView("home");
          } else {
            setSelectedTerritoryPin((prev) =>
              prev === punto.id ? null : punto.id,
            );
          }
        });
      });

      currentMap.invalidateSize();
      setTimeout(() => {
        if (currentMap) currentMap.invalidateSize();
      }, 250);

      if (typeof ResizeObserver !== "undefined") {
        resizeObserver = new ResizeObserver(() => {
          if (currentMap) currentMap.invalidateSize();
        });
        resizeObserver.observe(mapContainer);
      }
    });

    return () => {
      cancelled = true;
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (currentMap) {
        currentMap.remove();
      }
      setMapInstance(null);
    };
  }, [mapContainer]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(false);
        return;
      }

      if (view === "detail" && selected) {
        const current = espacios.findIndex((space) => space.id === selected.id);

        if (event.key === "ArrowRight") {
          const next = espacios[(current + 1) % espacios.length];
          setSelectedId(next.id);
        }

        if (event.key === "ArrowLeft") {
          const prev =
            espacios[(current - 1 + espacios.length) % espacios.length];

          setSelectedId(prev.id);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [view, selected]);

  const openSpace = (id: number) => {
    setSelectedId(id);
    setView("detail");
  };

  const goMap = () => {
    setLightbox(false);
    setView("map");
  };

  const goEnvironment = () => {
    setLightbox(false);
    setView("environment");
  };

  const goHome = () => {
    setLightbox(false);
    setView("home");
    setSelectedId(null);
  };

  const focusTerritoryPin = (punto: PuntoTerritorio) => {
    if (punto.esEscuela) {
      setSelectedTerritoryPin(null);
      setView("home");
      return;
    }

    setSelectedTerritoryPin(punto.id);
    if (mapInstance) {
      mapInstance.panTo([punto.lat, punto.lng], {
        animate: true,
      });
    }
  };

  return (
    <main className="app-shell">
      <AnimatePresence mode="wait">
        {view === "cover" && (
          <motion.section
            key="cover"
            className="screen cover-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={transition}
          >
            <div className="cover-grid" aria-hidden="true" />
            <nav className="topbar cover-topbar">
              <button className="brand" onClick={() => setView("cover")}>
                <span className="brand-mark">M</span>
                <span>MAPEO</span>
              </button>
              <span className="year-tag">{info.anio}</span>
            </nav>
            <div className="cover-content">
              <span className="eyebrow">IES N.º 6017 · FORMACIÓN DOCENTE</span>
              <h1>
                Mapeo colectivo
                <span>Contexto, Comunidad y Escuela</span>
              </h1>
              <p className="cover-description">
                Un recorrido situado por el entorno de Betania y los espacios de
                la institución, para reconocer el territorio que también forma
                parte de la vida escolar.
              </p>
              <div className="academic-card">
                <span className="academic-label">MATERIA</span>
                <strong>Práctica Docente I: Contexto, Comunidad y Escuela</strong>
                <span className="academic-label team-label">EQUIPO DOCENTE</span>
                <div className="team-grid">
                  <span>Prof. Ana Gabriela Pinto</span>
                  <span>Prof. Cecilia Alvarez</span>
                  <span>Prof. Nymra Dagil</span>
                </div>
                <span className="academic-label team-label">INTEGRANTES</span>
                <div className="team-grid">
                  <span>Emilse Mendisabal</span>
                  <span>Emilio Cervera</span>
                  <span>Ernesto Salazar</span>
                  <span>Valeria Gutierrez</span>
                </div>
              </div>
              <motion.button
                className="primary-button"
                onClick={goEnvironment}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Explorar el territorio</span>
                <span className="button-arrow">→</span>
              </motion.button>
            </div>
            <div className="hero-footer">
              <span>IES N.º 6017 · 2026</span>
            </div>
          </motion.section>
        )}

        {view === "environment" && (
          <motion.section
            key="environment"
            className="screen environment-screen"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={transition}
          >
            <header className="topbar light-topbar">
              <button
                className="brand dark-brand"
                onClick={() => setView("cover")}
              >
                <span className="brand-mark">M</span>
                <span>MAPEO</span>
              </button>
              <div className="topbar-title">
                <small>Práctica Docente I</small>
                <strong>Entorno de Betania</strong>
              </div>
              <button className="text-button" onClick={() => setView("cover")}>
                Portada
              </button>
            </header>
            <div className="map-header content-width">
              <div>
                <span className="section-kicker">01 · TERRITORIO</span>
                <h2>La escuela y su entorno</h2>
                <p>
                 El Colegio Secundario N° 5207 'Héroes de Malvinas' se emplaza sobre la Ruta 
                 Provincial N° 11, en el paraje rural de Finca San Roque (Betania), dentro de 
                 la jurisdicción de la localidad de Campo Santo, Departamento General Güemes. 
                 Su comunidad educativa se nutre tanto de jóvenes residentes en las fincas y 
                 parajes rurales aledaños como de estudiantes y docentes que se trasladan 
                 diariamente desde las localidades vecinas de Campo Santo y El Bordo.
                </p>
              </div>
            </div>
            <div className="content-width environment-map-wrap">
              <div className="environment-map-card territory-google-map">
                <div
                  ref={setMapContainer}
                  className="leaflet-map"
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                  }}
                  aria-label="Mapa satelital interactivo del entorno de Betania y la escuela"
                />
                <div className="map-help-chip">
                  Seleccioná un pin para ver qué representa
                </div>
                {selectedTerritoryPoint && (
                  <div className="map-pin-info" role="status">
                    <button
                      aria-label="Cerrar descripción"
                      onClick={() => setSelectedTerritoryPin(null)}
                    >
                      ×
                    </button>
                    <strong>{selectedTerritoryPoint.nombre}</strong>
                    <p>{selectedTerritoryPoint.descripcion}</p>
                    {selectedTerritoryPoint.esEscuela && (
                      <button
                        className="map-school-action"
                        onClick={() => {
                          setSelectedTerritoryPin(null);
                          setView("home");
                        }}
                      >
                        Ver mapeo de la escuela →
                      </button>
                    )}
                  </div>
                )}
              </div>
              <div className="territory-pins">
                {PUNTOS_TERRITORIO.map((punto) => (
                  <button
                    key={punto.id}
                    className={`territory-pin ${
                      punto.esEscuela ? "school-pin" : ""
                    }`}
                    onClick={() => focusTerritoryPin(punto)}
                  >
                    <span>●</span>
                    <div>
                      <strong>{punto.nombre}</strong>
                      <small>{punto.subtitulo}</small>
                    </div>
                    <b>{punto.esEscuela ? "→" : "⌖"}</b>
                  </button>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {/* =========================
            HOME
        ========================== */}

        {view === "home" && (
          <motion.section
            key="home"
            className="screen home-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              scale: 0.985,
            }}
            transition={transition}
          >
            <div className="hero-photo" aria-hidden="true" />
            <div className="hero-overlay" aria-hidden="true" />
            <div className="hero-grid" aria-hidden="true" />

            <nav className="topbar hero-topbar">
              <button
                className="brand"
                onClick={() => setView("cover")}
                aria-label="Volver a la portada"
              >
                <span className="brand-mark">M</span>
                <span>MAPEO</span>
              </button>

              <span className="year-tag">{info.anio}</span>
            </nav>

            <div className="hero-content">
              <motion.div
                className="eyebrow"
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  ...transition,
                  delay: 0.1,
                }}
              >
                {info.materia}
              </motion.div>

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  ...transition,
                  delay: 0.16,
                }}
              >
                {info.titulo}

                <span>{info.subtitulo}</span>
              </motion.h1>

              <motion.p
                className="hero-copy"
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  ...transition,
                  delay: 0.23,
                }}
              >
                Explorar la institución a través de sus espacios, recorridos y
                experiencias cotidianas.
              </motion.p>

              <motion.button
                className="primary-button"
                onClick={goMap}
                initial={{
                  opacity: 0,
                  y: 18,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  ...transition,
                  delay: 0.3,
                }}
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >
                <span>Ver el mapeo de la escuela</span>

                <span className="button-arrow">→</span>
              </motion.button>
            </div>

            <div className="hero-footer">
              <span>{info.escuela}</span>
              <button className="footer-link" onClick={goEnvironment}>
                Volver al entorno ↗
              </button>
            </div>
          </motion.section>
        )}

        {/* =========================
            MAPA
        ========================== */}

        {view === "map" && (
          <motion.section
            key="map"
            className="screen map-screen"
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -14,
            }}
            transition={transition}
          >
            <header className="topbar light-topbar">
              <button className="brand dark-brand" onClick={goHome}>
                <span className="brand-mark">M</span>

                <span>MAPEO</span>
              </button>

              <div className="topbar-title">
                <small>{info.materia}</small>

                <strong>{info.escuela}</strong>
              </div>

              <button className="text-button" onClick={goHome}>
                Inicio
              </button>
            </header>

            <div className="map-header content-width">
              <div>
                <span className="section-kicker">01 · RECORRIDO</span>

                <h2>Plano interactivo</h2>

                <p>
                  Seleccioná una referencia para conocer ese espacio y ver su
                  registro fotográfico.
                </p>
              </div>

              <div className="map-counter">
                <strong>{filteredSpaces.length}</strong>

                <span>referencias</span>
              </div>
            </div>

            <div
              className="filters content-width"
              aria-label="Filtrar referencias"
            >
              {categorias.map((category) => {
                const isActive = filter === category;

                return (
                  <button
                    key={category}
                    className={`filter-chip ${isActive ? "active" : ""}`}
                    onClick={() => setFilter(category)}
                    aria-pressed={isActive}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            <div className="content-width map-area">
              <div className="map-card">
                <div className="map-legend">
                  <span className="pulse-dot" />

                  <span>Referencia interactiva</span>
                </div>

                <div className="map-canvas">
                  <img
                    src="/croquis/croquis.png"
                    alt="Croquis de la escuela"
                    className="croquis-image"
                  />

                  <div className="map-fallback" aria-hidden="true">
                    <span>Colocá tu croquis en</span>

                    <strong>public/croquis/croquis.png</strong>
                  </div>

                  {filteredSpaces.map((space, index) => (
                    <motion.button
                      key={space.id}
                      className="map-marker"
                      style={{
                        left: `${space.x}%`,
                        top: `${space.y}%`,
                      }}
                      onClick={() => openSpace(space.id)}
                      initial={{
                        opacity: 0,
                        scale: 0.65,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        delay: 0.08 * index,
                        type: "spring",
                        stiffness: 350,
                        damping: 22,
                      }}
                      whileHover={{
                        scale: 1.13,
                        zIndex: 10,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      aria-label={`Abrir ${space.nombre}`}
                    >
                      <span className="marker-halo" />

                      <span className="marker-core">
                        {String(space.id).padStart(2, "0")}
                      </span>

                      <span className="marker-label">{space.nombre}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="map-note">
                <span className="note-icon">⌘</span>

                <p>
                  También podés usar <strong>← →</strong> dentro de una ficha
                  para pasar de una referencia a otra.
                </p>
              </div>
            </div>
          </motion.section>
        )}

        {/* =========================
            DETALLE
        ========================== */}

        {view === "detail" && selected && (
          <motion.section
            key={`detail-${selected.id}`}
            className="screen detail-screen"
            initial={{
              opacity: 0,
              x: 20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: -20,
            }}
            transition={transition}
          >
            <header className="topbar light-topbar detail-topbar">
              <button className="back-button" onClick={goMap}>
                <span>←</span>
                Volver al plano
              </button>

              <span className="detail-index">
                {String(selected.id).padStart(2, "0")}
                {" / "}
                {String(espacios.length).padStart(2, "0")}
              </span>

              <button className="text-button" onClick={goHome}>
                Inicio
              </button>
            </header>

            <div className="detail-grid content-width">
              <div className="detail-copy">
                <span className="section-kicker">{selected.categoria}</span>

                <h2>{selected.nombre}</h2>

                <p className="detail-description">{selected.descripcion}</p>

                <div className="observation-card">
                  <span>OBSERVACIÓN</span>

                  <p>{selected.observaciones}</p>
                </div>

                <div className="detail-actions">
                  <button className="secondary-button" onClick={goMap}>
                    Ver todas las referencias
                  </button>

                  <button
                    className="light-button"
                    onClick={() => setLightbox(true)}
                  >
                    Ampliar foto ↗
                  </button>
                </div>
              </div>

              <motion.button
                className="detail-photo-button"
                onClick={() => setLightbox(true)}
                whileHover={{
                  scale: 1.01,
                }}
                whileTap={{
                  scale: 0.995,
                }}
                aria-label={`Ampliar fotografía de ${selected.nombre}`}
              >
                <Photo space={selected} />

                <div className="photo-caption">
                  Registro fotográfico · {selected.nombre}
                </div>
              </motion.button>
            </div>

            <div className="detail-nav content-width">
              <button
                onClick={() => {
                  const current = espacios.findIndex(
                    (space) => space.id === selected.id,
                  );

                  setSelectedId(
                    espacios[(current - 1 + espacios.length) % espacios.length]
                      .id,
                  );
                }}
              >
                ← Anterior
              </button>

              <span>Deslizá / usá las flechas para continuar</span>

              <button
                onClick={() => {
                  const current = espacios.findIndex(
                    (space) => space.id === selected.id,
                  );

                  setSelectedId(espacios[(current + 1) % espacios.length].id);
                }}
              >
                Siguiente →
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* =========================
          LIGHTBOX
      ========================== */}

      <AnimatePresence>
        {lightbox && selected && (
          <motion.div
            className="lightbox"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onClick={() => setLightbox(false)}
            role="dialog"
            aria-modal="true"
            aria-label={`Foto ampliada de ${selected.nombre}`}
          >
            <motion.div
              className="lightbox-inner"
              initial={{
                scale: 0.92,
                y: 12,
              }}
              animate={{
                scale: 1,
                y: 0,
              }}
              exit={{
                scale: 0.95,
                y: 8,
              }}
              transition={transition}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="close-button"
                onClick={() => setLightbox(false)}
                aria-label="Cerrar"
              >
                ×
              </button>

              <Photo space={selected} className="lightbox-photo" />

              <div className="lightbox-info">
                <span>{selected.categoria}</span>

                <strong>{selected.nombre}</strong>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;