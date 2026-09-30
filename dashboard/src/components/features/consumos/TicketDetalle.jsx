import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function TicketDetalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Datos de ejemplo alineados con los que usa la lista de Tickets
  const tickets = [
    {
      id: 1,
      vehiculo: "ATP4008 - Remolque Araña 40",
      viaje: "Canelones - Montevideo",
      litrosCombustible: "29L",
      fecha: "2025-09-12",
      importeTotal: "4000 UYU",
      proveedor: "Ancap",
      kilometraje: "300 km",
      observaciones: "Cargó en Canelones",
    },
    {
      id: 2,
      vehiculo: "BCD5678 - VW Constellation",
      viaje: "Montevideo - Salto",
      litrosCombustible: "120L",
      fecha: "2025-09-30",
      importeTotal: "18000 UYU",
      proveedor: "Petrobras",
      kilometraje: "1500 km",
      observaciones: "Servicio completo",
    },
    {
      id: 3,
      vehiculo: "ACD1234 - Camión Internacional 430",
      viaje: "Montevideo - Colonia",
      litrosCombustible: "60L",
      fecha: "2025-10-02",
      importeTotal: "8000 UYU",
      proveedor: "Ancap",
      kilometraje: "800 km",
      observaciones: "Esperando repuestos",
    },
  ];

  const ticket = tickets.find((t) => t.id === parseInt(id));

  if (!ticket) {
    return (
      <div className="container mt-4">
        <h3 className="text-danger">Ticket no encontrado</h3>
        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate("/consumos/tickets")}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Detalle del Ticket #{ticket.id}</h2>
      <div className="card shadow mt-3">
        <div className="card-body">
          <h5 className="card-title mb-3">{ticket.vehiculo}</h5>

          <div className="row mb-2">
            <div className="col-md-6">
              <p>
                <strong>Viaje:</strong> {ticket.viaje || "—"}
              </p>
              <p>
                <strong>Fecha:</strong> {ticket.fecha || "—"}
              </p>
              <p>
                <strong>Litros:</strong> {ticket.litrosCombustible || "—"}
              </p>
            </div>

            <div className="col-md-6">
              <p>
                <strong>Importe:</strong> {ticket.importeTotal || "—"}
              </p>
              <p>
                <strong>Proveedor:</strong> {ticket.proveedor || "—"}
              </p>
              <p>
                <strong>Kilometraje:</strong> {ticket.kilometraje || "—"}
              </p>
            </div>
            <p>
            <strong>Observaciones:</strong> {ticket.observaciones || "—"}
            </p>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => console.log("Guardar:")}
            >
              Guardar cambios
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate("/consumos/tickets")}
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketDetalle;
