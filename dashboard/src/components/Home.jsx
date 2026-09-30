import { Card } from "react-bootstrap";

function Home() {
  const viajes = [
    {
      id: 1,
      destino: "Montevideo-Melo",
      chofer: "Juan Perez",
      fechaEntrada: "2025-10-01",
      estado: "Activo",
    },
    {
      id: 2,
      destino: "Montevideo-Salto",
      chofer: "Raul Gomez",
      fechaEntrada: "2025-10-01",
      estado: "Activo",
    },
    {
      id: 3,
      destino: "Montevideo-Colonia",
      chofer: "Pedro Gonzalez",
      fechaEntrada: "2025-10-01",
      estado: "Finalizado",
    },
    {
      id: 4,
      destino: "Montevideo-Melo",
      chofer: "Juan Gomez",
      fechaEntrada: "2025-10-01",
      estado: "Activo",
    },
    {
      id: 5,
      destino: "Montevideo-Tacuarembó",
      chofer: "Federico Pintos",
      fechaEntrada: "2025-10-01",
      estado: "Finalizado",
    },
  ];

  const remolquesLibres = [
    { id: 1, matricula: "ATP4008", tipo: "Araña 40", estado: "Disponible" },
    { id: 2, matricula: "ATP4009", tipo: "Araña 40", estado: "Disponible" },
    { id: 3, matricula: "ATP4010", tipo: "Camara", estado: "Disponible" },
    { id: 4, matricula: "ATP4011", tipo: "Araña 20", estado: "Disponible" },
  ];

  const camionesTaller = [
    {
      id: 1,
      matricula: "ACD1234",
      modelo: "Internacional 430",
      motivo: "Cambio aceite",
    },
    {
      id: 2,
      matricula: "BCD5678",
      modelo: "VW Constellation 19.320",
      motivo: "Reparación",
    },
    {
      id: 3,
      matricula: "CDE9101",
      modelo: "Internacional 350",
      motivo: "Revisión sucta",
    },
  ];

  const consumoCamiones = [
    { id: 1, matricula: "ACD1234", promedio: "2.8 km/l" },
    { id: 2, matricula: "BCD5678", promedio: "3.1 km/l" },
    { id: 3, matricula: "CDE9101", promedio: "2.5 km/l" },
    { id: 4, matricula: "DEF2345", promedio: "3.0 km/l" },
    { id: 5, matricula: "EFG3456", promedio: "2.9 km/l" },
  ];

  return (
    <div className="container my-4">
      <h2 className="mb-4 text-center">Resumen General</h2>

      <div className="row g-4 p-3">
        <div className="col-12 col-md-6 col-lg-6">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>🚛 Viajes Activos</Card.Title>
              <div className="card-text">
                <div className="text-bold">
                  Cantidad de viajes en curso:{" "}
                  <strong>
                    {viajes.filter((viaje) => viaje.estado === "Activo").length}
                  </strong>
                </div>
                <br />
                <ul className="list-group list-group-flush">
                  {viajes
                    .filter((viaje) => viaje.estado === "Activo")
                    .map((viaje) => (
                      <li key={viaje.id} className="list-group-item p-0 pt-1">
                        <div className="fw-bold">{viaje.destino}</div>
                        <span>Fecha de Entrada: {viaje.fechaEntrada}</span>
                        <br />
                        <span>Chofer: {viaje.chofer}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-12 col-md-6 col-lg-6">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>🛻 Remolques Libres</Card.Title>
              <div className="card-text">
                <span>
                  Total disponibles: <strong>8</strong>
                </span>
                <ul className="list-group list-group-flush">
                  <br />
                  {remolquesLibres.map((remolque) => (
                    <li key={remolque.id} className="list-group-item p-0 pt-1">
                      <div className="fw-bold">
                        {remolque.matricula} - {remolque.tipo}
                      </div>
                      Estado: {remolque.estado}
                    </li>
                  ))}
                </ul>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-12 col-md-6 col-lg-6">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>⛽ Consumo de Combustible</Card.Title>
              <div className="card-text">
                <br />
                <ul className="list-group list-group-flush">
                  {consumoCamiones.map((camion) => (
                    <li key={camion.id} className="list-group-item p-0 pt-1">
                      {camion.matricula} - Promedio: {camion.promedio}
                    </li>
                  ))}
                </ul>
              </div>
            </Card.Body>
          </Card>
        </div>

        <div className="col-12 col-md-6 col-lg-6">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>🔧 Unidades en Taller</Card.Title>
              <div className="card-text">
                <br />
                <ul className="list-group list-group-flush">
                  {camionesTaller.map((camionesTaller) => (
                    <li
                      key={camionesTaller.id}
                      className="list-group-item p-0 pt-1"
                    >
                      {camionesTaller.matricula} — {camionesTaller.motivo}
                    </li>
                  ))}
                </ul>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Home;
