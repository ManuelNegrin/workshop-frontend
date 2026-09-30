import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Tickets() {
  const navigate = useNavigate();
  const [filtro] = useState("Tickets");
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);
  const [tickets] = useState([
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
  ]);

  return (
    <div className="mx-3">
      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h2 className="mb-2">Tickets de Combustible</h2>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-2">
        {/* botones de filtro desktop */}
        <div className="d-none d-md-flex gap-2">
          <button
            className={`btn me-2 ${
              filtro === "Consumo" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => navigate("/consumos")}
          >
            Consumo
          </button>
          <button
            className={`btn me-2 ${
              filtro === "Tickets"
                ? "btn-primary"
                : "btn-outline-primary"
            }`}
            onClick={() => navigate("/consumos/tickets")}
          >
            Tickets
          </button>
        </div>
        <div className="d-none d-md-flex">
          <button
            className="btn btn-success ms-auto"
            onClick={() => navigate("/consumos/tickets/nuevo")}
          >
            Nuevo Ticket
          </button>
        </div>
        {/* botones de filtro mobile */}
        <div className="d-flex d-md-none flex-wrap gap-1 justify-content-between w-100">
          <button
            className={`btn btn-sm ${
              filtro === "Consumo" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => navigate("/consumos")}
          >
            Consumo
          </button>
          <button
            className={`btn btn-sm ${
              filtro === "Tickets"
                ? "btn-secondary"
                : "btn-outline-secondary"
            }`}
            onClick={() => navigate("/consumos/tickets")}
          >
            Tickets
          </button>

          <button
            className="btn btn-success btn-sm w-100 w-md-auto"
            onClick={() => navigate("/consumos/tickets/nuevo")}
          >
            Nuevo Ticket
          </button>
        </div>

          

      </div>

      {/* Vista tabla (desktop) */}
      <div className="d-none d-md-block table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Vehículo</th>
              <th>Viaje</th>
              <th>Fecha</th>
              <th>Litros</th>
              <th>Importe</th>
              <th>Proveedor</th>
              <th>Kilometraje</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                onClick={() => setTicketSeleccionado(ticketSeleccionado === ticket.id ? null : ticket.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{ticket.id}</td>
                <td>{ticket.vehiculo}</td>
                <td>{ticket.viaje}</td>
                <td>{ticket.fecha}</td>
                <td>{ticket.litrosCombustible}</td>
                <td>{ticket.importeTotal}</td>
                <td>{ticket.proveedor}</td>
                <td>{ticket.kilometraje}</td>
                <td>
                  {ticketSeleccionado === ticket.id && (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/consumos/tickets/editar/${ticket.id}`);
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
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="card mb-3 shadow-sm"
            onClick={() => setTicketSeleccionado(ticketSeleccionado === ticket.id ? null : ticket.id)}
            style={{ cursor: "pointer" }}
          >
            <div className="card-body">
              <h5 className="card-title">{ticket.vehiculo}</h5>
              {ticketSeleccionado === ticket.id && (
                <div className="mt-2 text-muted">
                  <p className="card-text">
                    <strong>Viaje:</strong> {ticket.viaje} <br />
                    <strong>Fecha:</strong> {ticket.fecha} <br />
                    <strong>Litros Combustible:</strong> {ticket.litrosCombustible} <br />
                    <strong>Importe Total:</strong> {ticket.importeTotal} <br />
                    <strong>Proveedor:</strong> {ticket.proveedor} <br />
                    <strong>Kilometraje:</strong> {ticket.kilometraje} <br />
                    <strong>Observaciones:</strong> {ticket.observaciones}
                  </p>
                  <button
                    className="btn btn-warning btn-sm w-100 w-md-auto mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/consumos/tickets/editar/${ticket.id}`);
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

export default Tickets;
