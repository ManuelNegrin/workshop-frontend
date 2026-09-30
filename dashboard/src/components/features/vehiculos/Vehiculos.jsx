import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchVehiculos } from "../../../redux/slices/vehiclesSlice";

function Vehiculos() {
  const [filtro, setFiltro] = useState("Todos");
  const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    list: vehiculos,
    loading,
    error,
  } = useSelector((state) => state.vehiculos);

  // const vehiculos = [
  //   {
  //     id: 1,
  //     tipo: "Camion",
  //     matricula: "ACD1234",
  //     chofer: "Juan Perez",
  //     modelo: "Internacional 430",
  //     estado: "Disponible",
  //   },
  //   {
  //     id: 2,
  //     tipo: "Camion",
  //     matricula: "BCD5678",
  //     chofer: "Raul Gomez",
  //     modelo: "VW Constellation 19.320",
  //     estado: "En Reparacion",
  //   },
  //   {
  //     id: 3,
  //     tipo: "Remolque",
  //     matricula: "ATP4008",
  //     modelo: "Araña 40",
  //     estado: "Disponible",
  //   },
  //   {
  //     id: 4,
  //     tipo: "Remolque",
  //     matricula: "ATP4009",
  //     modelo: "Araña 40",
  //     estado: "En Uso",
  //   },
  //   {
  //     id: 5,
  //     tipo: "Camion",
  //     matricula: "CDE6789",
  //     chofer: "Pedro Gonzalez",
  //     modelo: "Scania R450",
  //     estado: "Disponible",
  //   },
  //   {
  //     id: 6,
  //     tipo: "Remolque",
  //     matricula: "ATP4010",
  //     modelo: "Camara",
  //     estado: "Disponible",
  //   },
  // ];

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
    dispatch(fetchVehiculos());
  }, [dispatch]);

  const toggleSeleccion = (id) => {
    setVehiculoSeleccionado(vehiculoSeleccionado === id ? null : id);
  };

  const vehiculosFiltrados = vehiculos.filter((vehiculo) => {
    if (filtro === "Camiones") return vehiculo.tipo === "Camion";
    if (filtro === "Remolques") return vehiculo.tipo === "Remolque";
    return true;
  });

  if (loading) {
    return <div>Cargando vehiculos...</div>;
  }
  if (error) {
    return <div>Error al cargar vehiculos: {error}</div>;
  }

  return (
    <div className="p-0 m-0">
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h2 className="mb-4">Vehiculos</h2>
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
              filtro === "Camiones" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("Camiones")}
          >
            Camiones
          </button>
          <button
            className={`btn me-2 ${
              filtro === "Remolques" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("Remolques")}
          >
            Remolques
          </button>
        </div>
        {/*Botones de filtro mobile */}
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
              filtro === "Camiones" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("Camiones")}
          >
            Camiones
          </button>
          <button
            className={`btn btn-sm ${
              filtro === "Remolques" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFiltro("Remolques")}
          >
            Remolques
          </button>
        </div>
        <div className="d-none d-md-flex">
          <button
            className="btn btn-success"
            onClick={() => navigate("/vehiculos/nuevovehiculo")}
          >
            Nuevo Vehiculo
          </button>
        </div>
        <div className="d-flex d-md-none w-100">
          <button
            className="btn btn-sm btn-success w-100 w-md-auto"
            onClick={() => navigate("/vehiculos/nuevovehiculo")}
          >
            Nuevo Vehiculo
          </button>
        </div>
      </div>

      <ul className="list-group">
        {vehiculosFiltrados.map((vehiculo) => (
          <li
            key={vehiculo.id}
            className="list-group-item"
            onClick={() => toggleSeleccion(vehiculo.id)}
            style={{ cursor: "pointer" }}
          >
            <strong>{vehiculo.matricula}</strong>
            {vehiculoSeleccionado === vehiculo.id && (
              <div className="mt-2 text-muted">
                <p>
                  <strong>Estado:</strong> {vehiculo.estado}
                </p>
                <p>
                  <strong>Matricula:</strong> {vehiculo.matricula}
                </p>
                <p>
                  <strong>Chofer:</strong> {vehiculo.chofer}{" "}
                  {!vehiculo.chofer && "---"}
                </p>
                <p>
                  <strong>Modelo:</strong> {vehiculo.modelo}
                </p>
                <div className="d-none d-md-flex justify-content-end mt-2">
                  <button
                    className="btn btn-warning ms-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/vehiculos/editar/${vehiculo.id}`);
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
                      navigate(`/vehiculos/editar/${vehiculo.id}`);
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

export default Vehiculos;
