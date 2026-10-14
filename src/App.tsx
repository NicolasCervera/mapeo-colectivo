import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  categorias,
  espacios,
  info,
  type Espacio,
  type FiltroCategoria,
} from "./data/espacios";

declare global { interface Window { L?: any } }

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
  const [view, setView] = useState<"cover" | "environment" | "home" | "map" | "detail">("cover");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FiltroCategoria>("Todas");
  const [lightbox, setLightbox] = useState(false);
  const [selectedTerritoryPin, setSelectedTerritoryPin] = useState<string | null>(null);

  const selected =
    espacios.find((space) => space.id === selectedId) ?? null;

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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLightbox(false);
        return;
      }

      if (view === "detail" && selected) {
        const current = espacios.findIndex(
          (space) => space.id === selected.id,
        );

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

  return (
    <main className="app-shell">
      <AnimatePresence mode="wait">
        {view === "cover" && (
          <motion.section key="cover" className="screen cover-screen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: .985 }} transition={transition}>
            <div className="cover-grid" aria-hidden="true" />
            <nav className="topbar cover-topbar"><button className="brand" onClick={() => setView("cover")}><span className="brand-mark">M</span><span>MAPEO</span></button><span className="year-tag">{info.anio}</span></nav>
            <div className="cover-content">
              <span className="eyebrow">IES N.º 6017 · FORMACIÓN DOCENTE</span>
              <h1>Mapeo colectivo<span>Escuela, territorio y experiencias cotidianas</span></h1>
              <p className="cover-description">Un recorrido situado por el entorno de Betania y los espacios de la institución, para reconocer el territorio que también forma parte de la vida escolar.</p>
              <div className="academic-card"><span className="academic-label">MATERIA</span><strong>Taller Práctica Docente I</strong><span className="academic-label team-label">INTEGRANTES</span><div className="team-grid"><span>Emilse Mendisabal</span><span>Emilio Cervera</span><span>Ernesto Salazar</span><span>Valeria Gutierrez</span></div></div>
              <motion.button className="primary-button" onClick={goEnvironment} whileHover={{ y: -2 }} whileTap={{ scale: .98 }}><span>Explorar el territorio</span><span className="button-arrow">→</span></motion.button>
            </div>
            <div className="hero-footer"><span>Taller Práctica Docente I</span><span>IES N.º 6017 · 2026</span></div>
          </motion.section>
        )}

        {view === "environment" && (
          <motion.section key="environment" className="screen environment-screen" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }} transition={transition}>
            <header className="topbar light-topbar"><button className="brand dark-brand" onClick={() => setView("cover")}><span className="brand-mark">M</span><span>MAPEO</span></button><div className="topbar-title"><small>Taller Práctica Docente I</small><strong>Entorno de Betania</strong></div><button className="text-button" onClick={() => setView("cover")}>Portada</button></header>
            <div className="map-header content-width"><div><span className="section-kicker">01 · TERRITORIO</span><h2>La escuela y su entorno</h2><p>Explorá el mapa y seleccioná los puntos para conocer las referencias del territorio. Las ubicaciones rurales generales son orientativas; pueden precisarse con el relevamiento de campo.</p></div></div>
            <div className="content-width environment-map-wrap">
              <div className="environment-map-card territory-google-map">
                <iframe
                  title="Mapa satelital del entorno de Betania y la escuela"
                  src="https://maps.google.com/maps?q=-24.6919084%2C-65.1370439&t=k&z=14&output=embed"
                  loading="eager"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
                <button className="map-pin pin-school" aria-label="Colegio Héroes de Malvinas" onClick={() => { setSelectedTerritoryPin(null); setView("home"); }}>E</button>
                <button className="map-pin pin-betania" aria-label="Betania" onClick={() => setSelectedTerritoryPin(selectedTerritoryPin === "betania" ? null : "betania")}>B</button>
                <button className="map-pin pin-fincas" aria-label="Fincas rurales" onClick={() => setSelectedTerritoryPin(selectedTerritoryPin === "fincas" ? null : "fincas")}>F</button>
                <button className="map-pin pin-represas" aria-label="Represas y reservorios" onClick={() => setSelectedTerritoryPin(selectedTerritoryPin === "represas" ? null : "represas")}>R</button>
                <div className="map-help-chip">Seleccioná un pin para ver qué representa</div>
                {selectedTerritoryPin && <div className="map-pin-info" role="status">
                  <button aria-label="Cerrar descripción" onClick={() => setSelectedTerritoryPin(null)}>×</button>
                  <strong>{({school:"Colegio Secundario Héroes de Malvinas N.º 5207",betania:"Betania",fincas:"Fincas y áreas rurales",represas:"Represas y reservorios"} as Record<string,string>)[selectedTerritoryPin]}</strong>
                  <p>{({school:"Institución educativa ubicada en el entorno rural de Betania. Seleccioná ‘Ver mapeo de la escuela’ para ingresar al proyecto institucional.",betania:"Localidad del municipio de Campo Santo, departamento General Güemes, Salta.",fincas:"Área rural de referencia alrededor de la escuela. El punto es orientativo y debe precisarse mediante observación de campo.",represas:"Referencia general para observar reservorios o represas visibles en la vista satelital; la ubicación exacta debe verificarse en campo."} as Record<string,string>)[selectedTerritoryPin]}</p>
                  {selectedTerritoryPin === "school" && <button className="map-school-action" onClick={() => { setSelectedTerritoryPin(null); setView("home"); }}>Ver mapeo de la escuela →</button>}
                </div>}
              </div>
              <div className="territory-pins">
                <button className="territory-pin school-pin" onClick={() => setView("home")}><span>●</span><div><strong>Colegio Secundario Héroes de Malvinas N.º 5207</strong><small>Seleccioná para ingresar al mapeo interno de la escuela.</small></div><b>→</b></button>
                <button className="territory-pin" onClick={() => setSelectedTerritoryPin("betania")}><span>●</span><div><strong>Betania</strong><small>Localidad y entorno comunitario.</small></div><b>⌖</b></button>
                <button className="territory-pin" onClick={() => setSelectedTerritoryPin("fincas")}><span>●</span><div><strong>Fincas y áreas rurales cercanas</strong><small>Referencias territoriales para verificar durante el recorrido.</small></div><b>⌖</b></button>
                <button className="territory-pin" onClick={() => setSelectedTerritoryPin("represas")}><span>●</span><div><strong>Represas / reservorios del sector</strong><small>Ubicación exacta a confirmar con el relevamiento.</small></div><b>⌖</b></button>
              </div>
              <p className="map-note"><span className="note-icon">⌖</span><span>El mapa satelital está centrado en las coordenadas de la escuela tomadas del enlace que compartiste. Los pines de Betania, fincas y represas son referencias visuales orientativas, no relevamientos GPS exactos. El pin de la escuela abre el mapeo institucional original.</span></p>
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

              <span className="year-tag">
                {info.anio}
              </span>
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

                <span>
                  {info.subtitulo}
                </span>
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
                Explorar la institución a través de sus espacios,
                recorridos y experiencias cotidianas.
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

                <span className="button-arrow">
                  →
                </span>
              </motion.button>
            </div>

            <div className="hero-footer">
              <span>{info.escuela}</span>
              <button className="footer-link" onClick={goEnvironment}>Volver al entorno ↗</button>
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

              <button
                className="brand dark-brand"
                onClick={goHome}
              >
                <span className="brand-mark">
                  M
                </span>

                <span>
                  MAPEO
                </span>
              </button>

              <div className="topbar-title">
                <small>{info.materia}</small>

                <strong>
                  {info.escuela}
                </strong>
              </div>

              <button
                className="text-button"
                onClick={goHome}
              >
                Inicio
              </button>

            </header>

            <div className="map-header content-width">

              <div>
                <span className="section-kicker">
                  01 · RECORRIDO
                </span>

                <h2>
                  Plano interactivo
                </h2>

                <p>
                  Seleccioná una referencia para conocer
                  ese espacio y ver su registro fotográfico.
                </p>
              </div>

              <div className="map-counter">
                <strong>
                  {filteredSpaces.length}
                </strong>

                <span>
                  referencias
                </span>
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
                    className={`filter-chip ${
                      isActive ? "active" : ""
                    }`}
                    onClick={() =>
                      setFilter(category)
                    }
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

                  <span>
                    Referencia interactiva
                  </span>
                </div>

                <div className="map-canvas">

                  <img
                    src="/croquis/croquis.png"
                    alt="Croquis de la escuela"
                    className="croquis-image"
                  />

                  <div
                    className="map-fallback"
                    aria-hidden="true"
                  >
                    <span>
                      Colocá tu croquis en
                    </span>

                    <strong>
                      public/croquis/croquis.png
                    </strong>
                  </div>

                  {filteredSpaces.map(
                    (space, index) => (
                      <motion.button
                        key={space.id}
                        className="map-marker"
                        style={{
                          left: `${space.x}%`,
                          top: `${space.y}%`,
                        }}
                        onClick={() =>
                          openSpace(space.id)
                        }
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
                          {String(space.id).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <span className="marker-label">
                          {space.nombre}
                        </span>

                      </motion.button>
                    ),
                  )}

                </div>
              </div>

              <div className="map-note">

                <span className="note-icon">
                  ⌘
                </span>

                <p>
                  También podés usar{" "}
                  <strong>
                    ← →
                  </strong>{" "}
                  dentro de una ficha para pasar
                  de una referencia a otra.
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

              <button
                className="back-button"
                onClick={goMap}
              >
                <span>←</span>
                Volver al plano
              </button>

              <span className="detail-index">
                {String(selected.id).padStart(2, "0")}
                {" / "}
                {String(espacios.length).padStart(2, "0")}
              </span>

              <button
                className="text-button"
                onClick={goHome}
              >
                Inicio
              </button>

            </header>

            <div className="detail-grid content-width">

              <div className="detail-copy">

                <span className="section-kicker">
                  {selected.categoria}
                </span>

                <h2>
                  {selected.nombre}
                </h2>

                <p className="detail-description">
                  {selected.descripcion}
                </p>

                <div className="observation-card">

                  <span>
                    OBSERVACIÓN
                  </span>

                  <p>
                    {selected.observaciones}
                  </p>

                </div>

                <div className="detail-actions">

                  <button
                    className="secondary-button"
                    onClick={goMap}
                  >
                    Ver todas las referencias
                  </button>

                  <button
                    className="light-button"
                    onClick={() =>
                      setLightbox(true)
                    }
                  >
                    Ampliar foto ↗
                  </button>

                </div>
              </div>

              <motion.button
                className="detail-photo-button"
                onClick={() =>
                  setLightbox(true)
                }
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
                  Registro fotográfico ·{" "}
                  {selected.nombre}
                </div>

              </motion.button>
            </div>

            <div className="detail-nav content-width">

              <button
                onClick={() => {
                  const current =
                    espacios.findIndex(
                      (space) =>
                        space.id === selected.id,
                    );

                  setSelectedId(
                    espacios[
                      (current -
                        1 +
                        espacios.length) %
                        espacios.length
                    ].id,
                  );
                }}
              >
                ← Anterior
              </button>

              <span>
                Deslizá / usá las flechas
                para continuar
              </span>

              <button
                onClick={() => {
                  const current =
                    espacios.findIndex(
                      (space) =>
                        space.id === selected.id,
                    );

                  setSelectedId(
                    espacios[
                      (current + 1) %
                        espacios.length
                    ].id,
                  );
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
            onClick={() =>
              setLightbox(false)
            }
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
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              <button
                className="close-button"
                onClick={() =>
                  setLightbox(false)
                }
                aria-label="Cerrar"
              >
                ×
              </button>

              <Photo
                space={selected}
                className="lightbox-photo"
              />

              <div className="lightbox-info">

                <span>
                  {selected.categoria}
                </span>

                <strong>
                  {selected.nombre}
                </strong>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default App;