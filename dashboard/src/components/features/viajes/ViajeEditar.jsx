import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

function ViajeEditar() {
  const { id } = useParams();
  const navigate = useNavigate();

  const viajes = [
    {
      id: 1,
      destino: "Montevideo-Melo",
      chofer: "Juan Perez",
      fechaCarga: "2025-09-30",
      fechaEntrada: "2025-10-01",
      estado: "Activo",
    },
    {
      id: 2,
      destino: "Montevideo-Salto",
      chofer: "Raul Gomez",
      fechaCarga: "2025-09-30",
      fechaEntrada: "2025-10-01",
      estado: "Activo",
    },
  ];

  const v = viajes.find((x) => x.id === parseInt(id));

  const initialForm = {
    destino: v?.destino || "",
    chofer: v?.chofer || "",
    fechaCarga: v?.fechaCarga || "",
    fechaEntrada: v?.fechaEntrada || "",
    estado: v?.estado || "Activo",
  };

  const [form, setForm] = useState(initialForm);

  if (!v) {
    return (
      <div className="container mt-4">
        <h3 className="text-danger">Viaje no encontrado</h3>
        <button
          className="btn btn-secondary mt-3"
          onClick={() => navigate("/viajes")}
        >
          Volver
        </button>
      </div>
    );
  }

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    console.log("Guardar viaje", id, form);
    navigate("/viajes");
  };
  const handleDelete = () => {
    if (!confirm("¿Eliminar viaje?")) return;
    console.log("Eliminar viaje", id);
    navigate("/viajes");
  };

  const handleDiscard = () => {
    navigate("/viajes");
  };

  return (
    <div className="container mt-4">
      <h2>Editar Viaje #{id}</h2>
      <div className="card shadow mt-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <label className="form-label">Destino</label>
              <input
                className="form-control"
                name="destino"
                value={form.destino}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Chofer</label>
              <input
                className="form-control"
                name="chofer"
                value={form.chofer}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <label className="form-label">Fecha de Carga</label>
              <input
                type="date"
                className="form-control"
                name="fechaCarga"
                value={form.fechaCarga}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Fecha de Entrada</label>
              <input
                type="date"
                className="form-control"
                name="fechaEntrada"
                value={form.fechaEntrada}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                <option>Activo</option>
                <option>Pendiente</option>
                <option>Finalizado</option>
                <option>Cancelado</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <div className="d-flex gap-2">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => {
                  toast.success("Viaje guardado correctamente", {
                    position: "top-center",
                  });
                  navigate("/viajes");
                }}
              >
                Guardar Viaje
              </button>
              <button className="btn btn-secondary" onClick={handleDiscard}>
                Descartar cambios
              </button>
            </div>
            <div>
              <button className="btn btn-danger" onClick={handleDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViajeEditar;
