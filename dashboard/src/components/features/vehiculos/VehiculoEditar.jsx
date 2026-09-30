import { useNavigate, useParams } from "react-router-dom";
import { use, useEffect, useState } from "react";
import {
  editVehicle,
  fetchVehiculos,
  removeVehicle,
} from "../../../redux/slices/vehiclesSlice";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function VehiculoEditar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const vehiculos = useSelector((state) => state.vehiculos.list);
  const loading = useSelector((state) => state.vehiculos.loading);

  const [form, setForm] = useState({
    matricula: "",
    tipo: "",
    marca: "",
    modelo: "",
    estado: "Disponible",
  });
  const [originalForm, setOriginalForm] = useState(null);

  useEffect(() => {
    if (!loading && vehiculos.length === 0) {
      dispatch(fetchVehiculos());
    }
  }, [vehiculos, loading, dispatch]);

  console.log(
    "### STATE.vehiculos crudo:",
    useSelector((state) => state.vehiculos)
  );
  console.log("### vehiculos (array usado):", vehiculos);
  console.log("### id param:", id, "tipo:", typeof id);

  useEffect(() => {
    if (!vehiculos.length) return;
    const v = vehiculos.find((x) => x.id === parseInt(id));
    console.log("### Resultado de find():", v);
    console.log(
      "### Items con IDs:",
      vehiculos.map((x) => ({ id: x.id, tipo: typeof x.id }))
    );
    if (v) {
      const vehicileData = {
        matricula: v.matricula || "",
        tipo: v.tipo || "",
        marca: v.marca || "",
        modelo: v.modelo || "",
        estado: v.estado || "Disponible",
      };
      setForm(vehicileData);
      setOriginalForm(vehicileData);
    }
  }, [vehiculos, id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async () => {
    await dispatch(editVehicle({ id, data: form }));
    navigate("/vehiculos");
  };
  const handleDelete = async () => {
    await dispatch(removeVehicle(id));
    navigate("/vehiculos");
  };

  const handleDiscard = () => {
    console.log("Descartando cambios...");
    const v = vehiculos.find((x) => x.id === parseInt(id));
    console.log("Vehículo original:", v);
    if (!v) return;
    if (JSON.stringify(form) === JSON.stringify(v)) return;
    setForm(originalForm);
    console.log("Cambios descartados");
    navigate("/vehiculos");
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <h4>Cargando...</h4>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Editar Vehículo #{id}</h2>
      <div className="card shadow mt-3">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Tipo</label>
              <input
                className="form-control"
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Matrícula</label>
              <input
                className="form-control"
                name="matricula"
                value={form.matricula}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Marca</label>
              <input
                className="form-control"
                name="marca"
                value={form.marca}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6">
              <label className="form-label">Modelo</label>
              <input
                className="form-control"
                name="modelo"
                value={form.modelo}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Estado</label>
              <select
                className="form-select"
                name="estado"
                value={form.estado}
                onChange={handleChange}
              >
                <option>Disponible</option>
                <option>En Reparacion</option>
                <option>En Uso</option>
              </select>
            </div>
          </div>

          <div className="d-flex justify-content-between mt-4">
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={handleSave}>
                Guardar cambios
              </button>
              <button className="btn btn-secondary" onClick={handleDiscard}>
                Descartar cambios
              </button>
            </div>
            <div>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  console.log("Solicitando confirmación de eliminación...");
                  toast.info(
                    ({ closeToast }) => (
                      <div>
                        <p>¿Seguro que quieres eliminar este vehículo?</p>
                        <div className="d-flex justify-content-end gap-2 mt-2">
                          <button
                            className="btn btn-outline-danger"
                            onClick={async () => {
                              await handleDelete();
                              closeToast();
                              toast.success(
                                "Vehículo eliminado correctamente",
                                {
                                  position: "top-center",
                                }
                              );
                            }}
                          >
                            Confirmar
                          </button>

                          <button
                            className="btn btn-secondary"
                            onClick={closeToast}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    ),
                    {
                      position: "top-center",
                      autoClose: false,
                      closeOnClick: false,
                      closeButton: false,
                      draggable: false,
                      pauseOnHover: true,
                    }
                  );
                }}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehiculoEditar;
