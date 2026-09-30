import { Card } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const data = [
  { matricula: "ABC-123", ultimo: 3.1, mensual: 3.5, historico: 3.8 },
  { matricula: "XYZ-789", ultimo: 2.8, mensual: 3.2, historico: 3.5 },
  { matricula: "LMN-456", ultimo: 2.2, mensual: 2.7, historico: 2.9 },
];

function Consumos() {

  const [filtro] = useState("Consumo");
  const navigate = useNavigate();

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-left">Consumos de Combustible</h2>
    <div className="row g-4">

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-0 gap-2">
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
        </div>
      
      
      </div>
        {data.map((vehiculo, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title className="text-center">
                  {vehiculo.matricula}
                </Card.Title>
                <div className="mt-3">
                  <p>
                    <strong>Último viaje:</strong>{" "}
                    <span
                      className={
                        vehiculo.ultimo > 3
                          ? "text-success"
                          : vehiculo.ultimo >= 2.5
                          ? "text-warning"
                          : "text-danger"
                      }
                    >
                      {vehiculo.ultimo} km/l
                    </span>
                  </p>
                  <p>
                    <strong>Promedio mensual:</strong> {vehiculo.mensual} km/l
                  </p>
                  <p>
                    <strong>Histórico:</strong> {vehiculo.historico} km/l
                  </p>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Consumos;
