import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function OrdenEditar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const ordenes = [
    {
      id: 1,
      fechaEntrada: "2025-09-30",
      tipo: "Mantenimiento",
      descripcion: "Cambio de aceite y filtros",
      estado: "En proceso",
    },
    {
      id: 2,
      fechaEntrada: "2025-10-01",
      tipo: "Reparación",
      descripcion: "Reparación de frenos",
      estado: "Completado",
    },
  ];

  const o = ordenes.find((x) => x.id === parseInt(id));

  const initialForm = {
    fechaEntrada: o?.fechaEntrada || "",
    tipo: o?.tipo || "",
    descripcion: o?.descripcion || "",
    estado: o?.estado || "En proceso",
  };

  const [form, setForm] = useState(initialForm);

  if (!o) {
    return (
      <div className="container mt-4">
        <h3 className="text-danger">Orden no encontrada</h3>
        <button className="btn btn-secondary mt-3" onClick={() => navigate("/ordenesTaller")}>Volver</button>
      </div>
    );
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => { console.log("Guardar orden", id, form); navigate("/ordenesTaller"); };
  const handleDelete = () => { if (!confirm("¿Eliminar orden?")) return; console.log("Eliminar orden", id); navigate("/ordenesTaller"); };

  const handleDiscard = () => {
    navigate("/ordenesTaller");
  };

  return (
    <div className="container mt-4">
      <h2>Editar Orden #{id}</h2>
      <div className="card shadow mt-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Fecha de Entrada</label>
              <input type="date" className="form-control" name="fechaEntrada" value={form.fechaEntrada} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Tipo</label>
              <input className="form-control" name="tipo" value={form.tipo} onChange={handleChange} />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-12">
              <label className="form-label">Descripción</label>
              <textarea className="form-control" name="descripcion" rows="4" value={form.descripcion} onChange={handleChange}></textarea>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <label className="form-label">Estado</label>
              <select className="form-select" name="estado" value={form.estado} onChange={handleChange}>
                <option>En proceso</option>
                <option>Completado</option>
                <option>Cancelado</option>
                <option>Pendiente</option>
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

export default OrdenEditar;
