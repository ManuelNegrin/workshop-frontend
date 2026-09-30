import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";
import { apiFetch } from "../../services/api";
import { confirmToast } from "../ConfirmationToast";

const labels = { active: "Activo", inactive: "Inactivo" };
const emptyCustomer = { name: "", taxId: "", contactName: "", phone: "", email: "", address: "", status: "active" };
const fail = (value) => toast.error(value.message || "No se pudo completar la solicitud.");

const useCustomers = () => {
  const [items, setItems] = useState([]);
  const refresh = useCallback(async () => {
    try { setItems(await apiFetch("/api/clientes")); } catch (value) { fail(value); }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return { items, refresh };
};

export function CustomersPage() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const customers = useCustomers();
  const [form, setForm] = useState(emptyCustomer);
  const [editing, setEditing] = useState(null);
  const canCreate = hasPermission("customers.create");
  const canUpdate = hasPermission("customers.update");
  const canDelete = hasPermission("customers.delete");
  const set = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const reset = () => { setEditing(null); setForm(emptyCustomer); };
  const edit = (customer) => {
    toast.info("Editando cliente.");
    setEditing(customer);
    setForm({ name: customer.name || "", taxId: customer.taxId || "", contactName: customer.contactName || "", phone: customer.phone || "", email: customer.email || "", address: customer.address || "", status: customer.status || "active" });
  };
  const submit = async (event) => {
    event.preventDefault();
    try {
      if (editing) { toast.info("Actualizando cliente..."); await apiFetch(`/api/clientes/${editing.id}`, { method: "PUT", body: form }); toast.success("Cliente actualizado."); }
      else { await apiFetch("/api/clientes", { method: "POST", body: form }); toast.success("Cliente creado."); }
      reset(); customers.refresh();
    } catch (value) { fail(value); }
  };
  const deactivate = (customer) => confirmToast(`¿Dar de baja a ${customer.name}?`, async () => {
    try { await apiFetch(`/api/clientes/${customer.id}`, { method: "DELETE" }); toast.success("Cliente dado de baja."); customers.refresh(); } catch (value) { fail(value); }
  });
  return <><div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4"><h1 className="h3 mb-0">Clientes</h1><button className="btn btn-outline-primary" onClick={customers.refresh}>Actualizar</button></div><div className="row g-4">{canCreate || editing ? <div className="col-lg-4"><form className="card card-body shadow-sm" onSubmit={submit}><h2 className="h5">{editing ? "Editar cliente" : "Nuevo cliente"}</h2><input className="form-control mb-2" placeholder="Nombre o razon social *" value={form.name} onChange={(event) => set("name", event.target.value)} required /><input className="form-control mb-2" placeholder="RUT / identificacion fiscal" value={form.taxId} onChange={(event) => set("taxId", event.target.value)} /><input className="form-control mb-2" placeholder="Contacto" value={form.contactName} onChange={(event) => set("contactName", event.target.value)} /><input className="form-control mb-2" placeholder="Telefono" value={form.phone} onChange={(event) => set("phone", event.target.value)} /><input className="form-control mb-2" type="email" placeholder="Email" value={form.email} onChange={(event) => set("email", event.target.value)} /><input className="form-control mb-2" placeholder="Direccion" value={form.address} onChange={(event) => set("address", event.target.value)} /><select className="form-select mb-3" value={form.status} onChange={(event) => set("status", event.target.value)}><option value="active">Activo</option><option value="inactive">Inactivo</option></select><div className="d-flex gap-2"><button className="btn btn-primary">{editing ? "Guardar cambios" : "Crear cliente"}</button>{editing && <button type="button" className="btn btn-outline-secondary" onClick={reset}>Cancelar</button>}</div></form></div> : null}<div className={canCreate || editing ? "col-lg-8" : "col-12"}><div className="card shadow-sm table-responsive"><table className="table mb-0"><thead><tr><th>Cliente</th><th>RUT</th><th>Contacto</th><th>Telefono</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{customers.items.map((customer) => <tr key={customer.id}><td>{customer.name}</td><td>{customer.taxId || "-"}</td><td>{customer.contactName || "-"}</td><td>{customer.phone || "-"}</td><td>{labels[customer.status] || customer.status}</td><td className="text-nowrap"><button className="btn btn-sm btn-outline-secondary me-1" onClick={() => navigate(`/clientes/${customer.id}`)}>Detalle</button>{canUpdate && <button className="btn btn-sm btn-outline-primary me-1" onClick={() => edit(customer)}>Editar</button>}{canDelete && customer.status === "active" && <button className="btn btn-sm btn-outline-danger" onClick={() => deactivate(customer)}>Baja</button>}</td></tr>)}{!customers.items.length && <tr><td colSpan="6" className="text-muted">No hay clientes registrados.</td></tr>}</tbody></table></div></div></div></>;
}

export function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  useEffect(() => { apiFetch(`/api/clientes/${id}`).then(setCustomer).catch(fail); }, [id]);
  if (!customer) return <div className="card card-body text-muted">Cargando cliente...</div>;
  const rows = [["RUT / identificacion fiscal", customer.taxId || "-"], ["Contacto", customer.contactName || "-"], ["Telefono", customer.phone || "-"], ["Email", customer.email || "-"], ["Direccion", customer.address || "-"], ["Estado", labels[customer.status] || customer.status]];
  return <><div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4"><h1 className="h3 mb-0">Detalle de cliente</h1><button className="btn btn-outline-primary" onClick={() => navigate("/clientes")}>Volver a clientes</button></div><div className="row g-4"><div className="col-lg-8"><div className="card shadow-sm"><div className="card-header"><strong>{customer.name}</strong></div><div className="card-body"><div className="row g-3">{rows.map(([label, value]) => <div className="col-md-6" key={label}><div className="small text-muted">{label}</div><div>{value}</div></div>)}</div></div></div></div><div className="col-lg-4"><div className="card shadow-sm"><div className="card-header">Viajes</div><div className="card-body"><div className="mb-3"><div className="small text-muted">Viajes totales</div><div className="display-6">{customer.metrics?.totalTrips ?? 0}</div></div><div><div className="small text-muted">Viajes del mes actual</div><div className="display-6">{customer.metrics?.currentMonthTrips ?? 0}</div></div></div></div></div></div></>;
}
