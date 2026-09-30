import { useState } from "react";
import { useNavigate } from "react-router-dom";

function OrdenesTaller() {
  const navigate = useNavigate();
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [ordenes] = useState([
    {
      id: 1,
      vehiculo: "ACD1234 - Camión Internacional 430",
      trabajo: "Cambio de frenos",
      fechaIngreso: "2025-09-01",
      fechaSalida: "2025-09-10",
      estado: "En proceso",
      observaciones: "Cintas nuevas",
    },
    {
      id: 2,
      vehiculo: "BCD5678 - VW Constellation",
      trabajo: "Servicio completo",
      fechaIngreso: "2025-09-05",
      fechaSalida: "2025-09-15",
      estado: "Finalizado",
      observaciones: "Listo para retirar",
    },
    {
      id: 3,
      vehiculo: "ATP4008 - Remolque Araña 40",
      trabajo: "Cambio de neumáticos",
      fechaIngreso: "2025-09-08",
      fechaSalida: "2025-09-12",
      estado: "Pendiente",
      observaciones: "Esperando repuestos",
    },
  ]);

  return (
    <div className="mx-3">
      <div className="d-flex justify-content-between align-items-center mt-4 mb-0">
        <h2 className="mb-2">Órdenes de Taller</h2>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        {/* Botón desktop */}
        <div className="d-none d-md-flex ms-auto">
          <button
            className="btn btn-success"
            onClick={() => navigate("/ordenesTaller/nuevaOrden")}
          >
            Nueva Orden
          </button>
        </div>
        
        {/* Botón mobile */}
        <div className="d-flex d-md-none w-100">
          <button
            className="btn btn-success btn-sm w-100"
            onClick={() => navigate("/ordenesTaller/nuevaOrden")}
          >
            Nueva Orden
          </button>
        </div>
      </div>

      {/* Vista tabla (desktop) */}
      <div className="d-none d-md-block">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Vehículo</th>
              <th>Trabajo</th>
              <th>Fecha Ingreso</th>
              <th>Estado</th>
              <th>Fecha Salida</th>
              <th>Observaciones</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr
                key={orden.id}
                onClick={() => setOrdenSeleccionada(ordenSeleccionada === orden.id ? null : orden.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{orden.id}</td>
                <td>{orden.vehiculo}</td>
                <td>{orden.trabajo}</td>
                <td>{orden.fechaIngreso}</td>
                <td>{orden.estado}</td>
                <td>{orden.fechaSalida}</td>
                <td>{orden.observaciones}</td>
                <td>
                  {ordenSeleccionada === orden.id && (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/ordenesTaller/editar/${orden.id}`);
                      }}
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista cards (mobile) */}
      <div className="d-md-none">
        {ordenes.map((orden) => (
          <div
            key={orden.id}
            className="card mb-3 shadow-sm"
            onClick={() => setOrdenSeleccionada(ordenSeleccionada === orden.id ? null : orden.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="card-body">
              <h5 className="card-title">{orden.vehiculo}</h5>
              {ordenSeleccionada === orden.id && (
                <div className="mt-2 text-muted">
                  <p className="card-text">
                    <strong>Trabajo:</strong> {orden.trabajo} <br />
                    <strong>Fecha Ingreso:</strong> {orden.fechaIngreso} <br />
                    <strong>Fecha Salida:</strong> {orden.fechaSalida} <br />
                    <strong>Estado:</strong> {orden.estado} <br />
                    <strong>Observaciones:</strong> {orden.observaciones}
                  </p>
                  <button
                    className="btn btn-warning btn-sm w-100 w-md-auto mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/ordenesTaller/editar/${orden.id}`);
                    }}
                  >
                    Editar
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdenesTaller;
