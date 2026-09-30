import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function ChoferEditar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const choferes = [
    {
      id: 1,
      nombre: "Juan",
      apellido: "Perez",
      ci: "3.456.456-7",
      telefono: "098752345",
      fechaNacimiento: "1980-05-10",
      fechaLibreta: "2026-09-10",
      vehiculo: "ACD1234",
      estado: "Disponible",
    },
    {
      id: 2,
      nombre: "Raul",
      apellido: "Gomez",
      ci: "5.678.678-9",
      telefono: "098752345",
      fechaNacimiento: "1978-08-10",
      fechaLibreta: "2029-02-18",
      vehiculo: "BCD5678",
      estado: "En viaje",
    },
  ];

  const c = choferes.find((x) => x.id === parseInt(id));

  const initialForm = {
    nombre: c?.nombre || "",
    apellido: c?.apellido || "",
    ci: c?.ci || "",
    telefono: c?.telefono || "",
    fechaNacimiento: c?.fechaNacimiento || "",
    fechaLibreta: c?.fechaLibreta || "",
    vehiculo: c?.vehiculo || "",
    estado: c?.estado || "Disponible",
  };

  const [form, setForm] = useState(initialForm);

  if (!c) {
    return (
      <div className="container mt-4">
        <h3 className="text-danger">Chofer no encontrado</h3>
        <button className="btn btn-secondary mt-3" onClick={() => navigate("/choferes")}>Volver</button>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    console.log("Guardar chofer", id, form);
    navigate("/choferes");
  };

  const handleDelete = () => {
    if (!confirm("¿Eliminar chofer? Esta acción no se puede deshacer.")) return;
    console.log("Eliminar chofer", id);
    navigate("/choferes");
  };

  const handleDiscard = () => {
    navigate("/choferes");
  };

  return (
    <div className="container mt-4">
      <h2>Editar Chofer #{id}</h2>
      <div className="card shadow mt-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Nombre</label>
              <input className="form-control" name="nombre" value={form.nombre} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Apellido</label>
              <input className="form-control" name="apellido" value={form.apellido} onChange={handleChange} />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-4">
              <label className="form-label">Documento (CI)</label>
              <input className="form-control" name="ci" value={form.ci} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Teléfono</label>
              <input className="form-control" name="telefono" value={form.telefono} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Vehículo asignado</label>
              <input className="form-control" name="vehiculo" value={form.vehiculo} onChange={handleChange} />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-4">
              <label className="form-label">Fecha Nacimiento</label>
              <input type="date" className="form-control" name="fechaNacimiento" value={form.fechaNacimiento} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Vencimiento de Libreta</label>
              <input type="date" className="form-control" name="fechaLibreta" value={form.fechaLibreta} onChange={handleChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Estado</label>
              <select className="form-select" name="estado" value={form.estado} onChange={handleChange}>
                <option>Disponible</option>
                <option>En viaje</option>
                <option>Licencia</option>
                <option>Inactivo</option>
              </select>
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

export default ChoferEditar;
