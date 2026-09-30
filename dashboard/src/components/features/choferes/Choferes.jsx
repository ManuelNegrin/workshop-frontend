import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchChoferes } from "../../../redux/slices/choferesSlice";

function Choferes() {
  const [filtro, setFiltro] = useState("Todos");
  const [choferSeleccionado, setChoferSeleccionado] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    list: choferes = [],
    loading,
    error,
  } = useSelector((state) => state.choferes);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found, redirecting to login");
      navigate("/login");
    } else {
      console.log("Token found:", token);
    }
  }, []);

  console.log(
    "Redux state.choferes:",
    useSelector((state) => state.choferes)
  );
  console.log("Choferes list:", choferes);

  useEffect(() => {
    dispatch(fetchChoferes());
  }, [dispatch]);

  const toggleSeleccion = (id) => {
    setChoferSeleccionado(choferSeleccionado === id ? null : id);
  };

  const choferesFiltrados = choferes.filter((chofer) =>
    filtro === "Disponibles"
      ? chofer.estado === "Disponible"
      : filtro === "En viaje"
      ? chofer.estado === "En viaje"
      : filtro === "Licencia"
      ? chofer.estado === "Licencia"
      : true
  );

  if (loading) {
    return <div>Cargando choferes...</div>;
  }

  if (error) {
    return <div>Error al cargar los choferes: {error}</div>;
  }

  return (
    <div className="p-0 m-0">
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h2 className="mb-4">Choferes</h2>
      </div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 gap-2">
        {/* botones de filtro desktop */}
        <div className="d-none d-md-flex gap-2">
          <button
            className={`btn me-2 ${
              filtro === "Todos" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("Todos")}
          >
            Todos
          </button>
          <button
            className={`btn me-2 ${
              filtro === "Disponibles" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("Disponibles")}
          >
            Disponibles
          </button>
          <button
            className={`btn me-2 ${
              filtro === "En viaje" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("En viaje")}
          >
            En viaje
          </button>
        </div>
        {/* botones de filtro mobile */}
        <div className="d-flex d-md-none flex-wrap gap-1 justify-content-between w-100">
          <button
            className={`btn btn-sm ${
              filtro === "Todos" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("Todos")}
          >
            Todos
          </button>
          <button
            className={`btn btn-sm ${
              filtro === "Disponibles" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("Disponibles")}
          >
            Disponibles
          </button>
          <button
            className={`btn btn-sm ${
              filtro === "En viaje" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("En viaje")}
          >
            En viaje
          </button>
        </div>
        <div className="d-none d-md-flex">
          <button
            className="btn btn-success ms-auto"
            onClick={() => navigate("/choferes/nuevoChofer")}
          >
            Nuevo Chofer
          </button>
        </div>
        <div className="d-flex d-md-none w-100">
          <button
            className="btn btn-success btn-sm w-100 w-md-auto"
            onClick={() => navigate("/choferes/nuevoChofer")}
          >
            Nuevo Chofer
          </button>
        </div>
      </div>

      <ul className="list-group">
        {choferesFiltrados.map((chofer) => (
          <li
            key={chofer.id}
            className="list-group-item"
            onClick={() => toggleSeleccion(chofer.id)}
            style={{ cursor: "pointer" }}
          >
            <strong>
              {chofer.nombre} {chofer.apellido}
            </strong>
            {choferSeleccionado === chofer.id && (
              <div className="mt-2 text-muted">
                <p>
                  <strong>Nombre:</strong> {chofer.nombre}
                </p>
                <p>
                  <strong>Telefono:</strong> {chofer.telefono}
                </p>
                <p>
                  <strong>Vencimiento de libreta: </strong>
                  {chofer.fechaLibreta}
                </p>
                <p>
                  <strong>Vehículo asignado:</strong>{" "}
                  {chofer.vehiculo || "Ninguno"}
                </p>
                <p>
                  <strong>Estado:</strong> {chofer.estado}
                </p>
                <div className="d-none d-md-flex justify-content-end mt-2">
                  <button
                    className="btn btn-warning ms-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/choferes/editar/${chofer.id}`);
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
                      navigate(`/choferes/editar/${chofer.id}`);
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

export default Choferes;
