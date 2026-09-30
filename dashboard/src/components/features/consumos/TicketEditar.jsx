import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function TicketEditar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const tickets = [
    {
      id: 1,
      vehiculo: "ACD1234",
      viaje: "Montevideo-Melo",
      litrosCombustible: 50,
      fecha: "2025-09-30",
      importeTotal: 3500,
      proveedor: "Shell",
      kilometraje: 125000,
      observaciones: "Carga normal",
      estado: "Completado",
    },
    {
      id: 2,
      vehiculo: "BCD5678",
      viaje: "Montevideo-Salto",
      litrosCombustible: 45,
      fecha: "2025-10-01",
      importeTotal: 3150,
      proveedor: "Ancap",
      kilometraje: 143500,
      observaciones: "Carga normal",
      estado: "Completado",
    },
  ];

  const t = tickets.find((x) => x.id === parseInt(id));

  const initialForm = {
    vehiculo: t?.vehiculo || "",
    viaje: t?.viaje || "",
    litrosCombustible: t?.litrosCombustible || "",
    fecha: t?.fecha || "",
    importeTotal: t?.importeTotal || "",
    proveedor: t?.proveedor || "",
    kilometraje: t?.kilometraje || "",
    observaciones: t?.observaciones || "",
    estado: t?.estado || "Completado",
  };

  const [form, setForm] = useState(initialForm);

  if (!t) {
    return (
      <div className="container mt-4">
        <h3 className="text-danger">Ticket no encontrado</h3>
        <button className="btn btn-secondary mt-3" onClick={() => navigate("/consumos/tickets")}>Volver</button>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => { console.log("Guardar ticket", id, form); navigate("/consumos/tickets"); };
  const handleDelete = () => { if (!confirm("¿Eliminar ticket?")) return; console.log("Eliminar ticket", id); navigate("/consumos/tickets"); };

  const handleDiscard = () => {
    navigate("/consumos/tickets");
  };

  return (
    <div className="container mt-4">
      <h2>Editar Ticket #{id}</h2>
      <div className="card shadow mt-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Vehículo</label>
              <input className="form-control" name="vehiculo" value={form.vehiculo} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Viaje</label>
              <input className="form-control" name="viaje" value={form.viaje} onChange={handleChange} />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-3">
              <label className="form-label">Litros de Combustible</label>
              <input type="number" className="form-control" name="litrosCombustible" value={form.litrosCombustible} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Fecha</label>
              <input type="date" className="form-control" name="fecha" value={form.fecha} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Importe Total</label>
              <input type="number" className="form-control" name="importeTotal" value={form.importeTotal} onChange={handleChange} />
            </div>
            <div className="col-md-3">
              <label className="form-label">Proveedor</label>
              <input className="form-control" name="proveedor" value={form.proveedor} onChange={handleChange} />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <label className="form-label">Kilometraje</label>
              <input type="number" className="form-control" name="kilometraje" value={form.kilometraje} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Estado</label>
              <select className="form-select" name="estado" value={form.estado} onChange={handleChange}>
                <option>Completado</option>
                <option>Pendiente</option>
                <option>Cancelado</option>
              </select>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-12">
              <label className="form-label">Observaciones</label>
              <textarea className="form-control" name="observaciones" rows="3" value={form.observaciones} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={handleSave}>Guardar cambios</button>
              <button className="btn btn-secondary" onClick={handleDiscard}>Descartar cambios</button>
            </div>
            <div>
              <button className="btn btn-danger" onClick={handleDelete}>Eliminar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketEditar;
