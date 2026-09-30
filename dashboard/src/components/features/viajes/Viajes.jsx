import { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchViajes } from "../../../redux/slices/viajesSlice";

function Viajes() {
  const [filtro, setFiltro] = useState("Todo");
  const [viajeSeleccionado, setViajeSeleccionado] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { list: viajes, loading, error } = useSelector((state) => state.viajes);

  useEffect(() => {
    if (error) {
      console.error("Error cargando viajes:", error);
    }
  }, [error]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
    } else {
      console.log("Token found:", token);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchViajes());
  }, [dispatch]);

  // const viajesFiltrados = viajes.filter((viaje) =>
  //   filtro === "Todo" ? true : viaje.estado === filtro
  // );

  const viajesFiltrados = viajes.filter((viaje) => {
    if (filtro === "Activo") {
      return viaje.estado === "Pendiente" || viaje.estado === "En progreso";
    } else if (filtro === "Finalizado") {
      return viaje.estado === "Finalizado";
    } else {
      return true;
    }
  });

  const toggleSeleccion = (id) => {
    setViajeSeleccionado(viajeSeleccionado === id ? null : id);
  };

  const handleEstadoChange = (id, nuevoEstado) => {
    setViajes(viajes.map((v) => (v.id === id ? { ...v, estado: nuevoEstado } : v)));
  };
  if (loading) {
    return <div>Cargando viajes...</div>;
  }

  if (error) {
    return <div>Error al cargar los viajes: {error}</div>;
  }

  return (
    <div className="p-0 m-0">
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h2 className="mb-4">Viajes ({filtro}s)</h2>
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        {/* botones de filtro desktop */}
        <div className="d-none d-md-flex gap-2">
          <button
            className={`btn me-2 ${
              filtro === "Todo" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("Todo")}
          >
            Todos
          </button>
          <button
            className={`btn me-2 ${
              filtro === "Activo" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("Activo")}
          >
            Activos
          </button>
          <button
            className={`btn me-2 ${
              filtro === "Pendiente" ? "btn-secondary" : "btn-outline-secondary"
            }`}
            onClick={() => setFiltro("Pendiente")}
          >
            Pendientes
          </button>
          <button
            className={`btn me-2 ${
              filtro === "Finalizado"
                ? "btn-secondary"
                : "btn-outline-secondary"
            }`}
            onClick={() => setFiltro("Finalizado")}
          >
            Finalizados
          </button>
        </div>
        {/* botones de filtro mobile */}
        <div className="d-flex d-md-none flex-wrap gap-1 justify-content-between w-100">
          <button
            className={`btn btn-sm ${
              filtro === "Activo" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("Activo")}
          >
            Activos
          </button>
          <button
            className={`btn btn-sm ${
              filtro === "Pendiente" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("Pendiente")}
          >
            Pendientes
          </button>
          <button
            className={`btn btn-sm ${
              filtro === "Finalizado"
                ? "btn-secondary"
                : "btn-outline-secondary"
            }`}
            onClick={() => setFiltro("Finalizado")}
          >
            Finalizados
          </button>
          <button
            className={`btn btn-sm ${
              filtro === "Todo" ? "btn-secondary" : "btn-outline-secondary"
            }`}
            onClick={() => setFiltro("Todo")}
          >
            Todos
          </button>
        </div>
        <div className="d-none d-md-flex">
          <button
            className="btn btn-success ms-auto"
            onClick={() => navigate("/viajes/nuevoViaje")}
          >
            Nuevo Viaje
          </button>
        </div>
        <div className="d-flex d-md-none w-100">
          <button
            className="btn btn-success btn-sm w-100 w-md-auto"
            onClick={() => navigate("/viajes/nuevoViaje")}
          >
            Nuevo Viaje
          </button>
        </div>
      </div>

      <ul className="list-group">
        {viajesFiltrados.map((viaje) => (
          <li
            key={viaje.id}
            className="list-group-item"
            onClick={() => toggleSeleccion(viaje.id)}
            style={{ cursor: "pointer" }}
          >
            <strong>{viaje.virada}</strong> — {viaje.contenedor}
            {viajeSeleccionado === viaje.id && (
              <div className="mt-2 text-muted">
                <p>
                  <strong>Fecha Carga:</strong> {viaje.fechaSalida}
                </p>
                <p>
                  <strong>Fecha Entrada:</strong> {viaje.fechaLlegada}
                </p>
                <p>
                  <strong>Estado:</strong> {viaje.estado}
                </p>
                <p>
                  <strong>Chofer:</strong> {viaje.chofer}
                </p>
                <p>
                  <strong>Camion:</strong> {viaje.camion}
                </p>
                <p>
                  <strong>Remolque:</strong> {viaje.remolque}
                </p>
                <p>
                  <strong>Notas:</strong> {viaje.notas}
                </p>
                <div className="mb-3">
                  <label className="form-label"><strong>Estado:</strong></label>
                  <select 
                    className="form-select" 
                    value={viaje.estado} 
                    onChange={(e) => handleEstadoChange(viaje.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option>Activo</option>
                    <option>Pendiente</option>
                    <option>Finalizado</option>
                    <option>Cancelado</option>
                  </select>
                </div>
                <div className="d-none d-md-flex justify-content-end mt-2">
                  <button
                    className="btn btn-warning ms-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/viajes/editar/${viaje.id}`);
                    }}
                  >
                    Editar
                  </button>
                </div>
                <div className="d-flex d-md-none mt-2">
                  <button
                    className="btn btn-warning btn-sm w-100 w-md-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/viajes/editar/${viaje.id}`);
                    }}
                  >
                    Editar
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Viajes;
