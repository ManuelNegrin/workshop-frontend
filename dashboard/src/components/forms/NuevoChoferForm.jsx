import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addChofer } from "../../redux/slices/choferesSlice";
import { toast } from "react-toastify";

function NuevoChoferForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    documento: "",
    telefono: "",
    vencimientoDeLibreta: "",
    vehiculoAsignado: "",
    estado: "Disponible",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addChofer(formData));
    setFormData({
      nombre: "",
      documento: "",
      telefono: "",
      vencimientoDeLibreta: "",
      vehiculoAsignado: "",
      estado: "Disponible",
    });
    console.log("Formulario enviado:", formData);
    // llamada a la api para guardar el nuevo chofer
    navigate("/choferes");
  };
  const handleDiscard = () => {
    navigate("/choferes");
  };

  return (
    <div className="container mt-4">
      <h2>Nuevo Chofer</h2>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Documento</label>
          <input
            type="text"
            className="form-control"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Telefono</label>
          <input
            type="text"
            className="form-control"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Vencimiento de Libreta</label>
          <input
            type="date"
            className="form-control"
            name="vencimientoDeLibreta"
            value={formData.vencimientoDeLibreta}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Vehículo Asignado</label>
          <input
            type="text"
            className="form-control"
            name="vehiculoAsignado"
            value={formData.vehiculoAsignado}
            onChange={handleChange}
          />
        </div>

        <div className="d-flex gap-2 mt-3">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => {
              toast.success("Chofer guardado correctamente", {
                position: "top-center",
              });
              navigate("/choferes");
            }}
          >
            Guardar Chofer
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleDiscard}
          >
            Descartar
          </button>
        </div>
      </form>
    </div>
  );
}

export default NuevoChoferForm;
