import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function OrdenDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const ordenes = [
    {
      id: 1,
      vehiculo: "ACD1234 - Camión Internacional 430",
      trabajo: "Cambio de frenos",
      fechaIngreso: "2025-09-01",
      fechaEgreso: "2025-09-10",
      estado: "En proceso",
      observaciones: "Cintas nuevas",
    },
    {
      id: 2,
      vehiculo: "BCD5678 - VW Constellation",
      trabajo: "Servicio completo",
      fechaIngreso: "2025-09-05",
      fechaEgreso: "2025-09-15",
      estado: "Finalizado",
      observaciones: "Listo para retirar",
    },
    {
      id: 3,
      vehiculo: "ATP4008 - Remolque Araña 40",
      trabajo: "Cambio de neumáticos",
      fechaIngreso: "2025-09-08",
      fechaEgreso: "2025-09-12",
      estado: "Pendiente",
      observaciones: "Esperando repuestos",
    },
  ];

  const orden = ordenes.find((o) => o.id === parseInt(id));
  const [estado, setEstado] = useState(orden?.estado || "");

  if (!orden) {
    return (
      <div className="container mt-4">
        <h3 className="text-danger">Orden no encontrada</h3>
        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate("/ordenesTaller")}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Detalle de la Orden #{orden.id}</h2>
      <div className="card shadow mt-3">
        <div className="card-body">
          <h5 className="card-title mb-3">{orden.vehiculo}</h5>

          <p>
            <strong>Chofer:</strong> {orden.chofer}
          </p>
          <p>
            <strong>Trabajo:</strong> {orden.trabajo}
          </p>
          <p>
            <strong>Fecha Ingreso:</strong> {orden.fechaIngreso}
          </p>
          <p>
            <strong>Fecha Egreso:</strong> {orden.fechaEgreso}
          </p>
          <p>
            <strong>Observaciones:</strong> {orden.observaciones}
          </p>

          <div className="mb-3">
            <label className="form-label">
              <strong>Estado:</strong>
            </label>
            <select
              className="form-select"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option>Pendiente</option>
              <option>En proceso</option>
              <option>Finalizado</option>
            </select>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-primary">Guardar cambios</button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/ordenesTaller")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrdenDetalle;
