import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { apiFetch } from "../../services/api";
import { confirmToast } from "../ConfirmationToast";

const statuses = { pending: "Pendiente", in_progress: "En curso", completed: "Completado", cancelled: "Cancelado" };
const fail = (value) => toast.error(value.message || "No se pudo completar la solicitud.");
const dateValue = (value) => value ? String(value).slice(0, 10) : "";
const displayDate = (value) => {
  const [year, month, day] = dateValue(value).split("-");
  return year ? `${day}/${month}/${year}` : "-";
};
const emptyTrip = {
  customerId: "", trailerVehicleId: "", truckVehicleId: "", driverId: "", origin: "", destination: "",
  departureAt: "", arrivalAt: "", cargoType: "refrigerated", containerNumber: "", rotation: "", notes: "", status: "pending",
};
const emptyWorkOrder = { vehicleId: "", checkInAt: "", type: "", odometer: "", description: "" };
const createIdempotencyKey = () => window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
const emptyFilters = { origin: "", destination: "", customerId: "", trailerVehicleId: "", truckVehicleId: "", dateExact: "", dateFrom: "", dateTo: "" };
const emptyWorkOrderFilters = { search: "", vehicleId: "", status: "", dateExact: "", dateFrom: "", dateTo: "" };

const useCollection = (endpoint) => {
  const [items, setItems] = useState([]);
  const refresh = useCallback(async () => {
    try { setItems(await apiFetch(endpoint)); } catch (value) { fail(value); }
  }, [endpoint]);
  useEffect(() => { refresh(); }, [refresh]);
  return { items, refresh };
};

export function TripsPage() {
  const navigate = useNavigate();
  const trips = useCollection("/api/viajes");
  const customers = useCollection("/api/clientes");
  const vehicles = useCollection("/api/vehiculos");
  const drivers = useCollection("/api/choferes");
  const [form, setForm] = useState(emptyTrip);
  const [editing, setEditing] = useState(null);
  const [idempotencyKey, setIdempotencyKey] = useState(createIdempotencyKey);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitLock = useRef(false);
  const [truckAssignments, setTruckAssignments] = useState({});
  const [filters, setFilters] = useState(emptyFilters);

  const availableTrucks = useMemo(() => vehicles.items.filter((vehicle) => vehicle.type === "truck" && vehicle.status === "available"), [vehicles.items]);
  const availableTrailers = useMemo(() => vehicles.items.filter((vehicle) => vehicle.type === "trailer" && vehicle.status === "available"), [vehicles.items]);
  const activeDrivers = useMemo(() => drivers.items.filter((driver) => driver.status === "active"), [drivers.items]);
  const activeCustomers = useMemo(() => customers.items.filter((customer) => customer.status === "active"), [customers.items]);
  const filteredTrips = useMemo(() => trips.items.filter((trip) => {
    const includes = (value, filter) => !filter || String(value || "").toLowerCase().includes(filter.toLowerCase());
    const departureAt = dateValue(trip.departureAt);
    if (!includes(trip.origin, filters.origin) || !includes(trip.destination, filters.destination)) return false;
    if (filters.customerId && trip.customerId !== filters.customerId) return false;
    if (filters.trailerVehicleId && trip.trailerVehicleId !== filters.trailerVehicleId) return false;
    if (filters.truckVehicleId && trip.truckVehicleId !== filters.truckVehicleId) return false;
    if (filters.dateExact && departureAt !== filters.dateExact) return false;
    if (!filters.dateExact && filters.dateFrom && departureAt < filters.dateFrom) return false;
    if (!filters.dateExact && filters.dateTo && departureAt > filters.dateTo) return false;
    return true;
  }), [trips.items, filters]);
  const refresh = async () => { await Promise.all([trips.refresh(), customers.refresh(), vehicles.refresh(), drivers.refresh()]); };

  const set = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const reset = () => { setEditing(null); setForm(emptyTrip); setIdempotencyKey(createIdempotencyKey()); };
  const setFilter = (field, value) => setFilters((current) => ({ ...current, [field]: value }));
  const selectOptions = (items, selectedId) => items.some((item) => item.id === selectedId) ? items : [...items, ...vehicles.items.filter((item) => item.id === selectedId)];
  const customersForForm = activeCustomers.some((item) => item.id === form.customerId) ? activeCustomers : [...activeCustomers, ...customers.items.filter((item) => item.id === form.customerId)];
  const trailersForForm = selectOptions(availableTrailers, form.trailerVehicleId);
  const trucksForForm = selectOptions(availableTrucks, form.truckVehicleId);

  const prepare = () => ({ ...form, truckVehicleId: form.truckVehicleId || null, arrivalAt: form.arrivalAt || null, containerNumber: form.cargoType === "container" ? form.containerNumber : null });
  const submit = async (event) => {
    event.preventDefault();
    if (submitLock.current) return;
    submitLock.current = true;
    setIsSubmitting(true);
    try {
      const body = prepare();
      if (editing) { toast.info("Actualizando viaje..."); await apiFetch(`/api/viajes/${editing.id}`, { method: "PUT", body }); toast.success("Viaje actualizado."); }
      else { await apiFetch("/api/viajes", { method: "POST", headers: { "Idempotency-Key": idempotencyKey }, body: { ...body, status: "pending" } }); toast.success("Viaje creado. El remolque quedó En viaje."); }
      reset(); await refresh();
    } catch (value) { fail(value); } finally { submitLock.current = false; setIsSubmitting(false); }
  };
  const edit = (trip) => {
    toast.info("Editando viaje.");
    setEditing(trip);
    setForm({
      customerId: trip.customerId || "", trailerVehicleId: trip.trailerVehicleId || "", truckVehicleId: trip.truckVehicleId || "", driverId: trip.driverId || "",
      origin: trip.origin || "", destination: trip.destination || "", departureAt: dateValue(trip.departureAt), arrivalAt: dateValue(trip.arrivalAt),
      cargoType: trip.cargoType || "refrigerated", containerNumber: trip.containerNumber || "", rotation: trip.rotation || "", notes: trip.notes || "", status: trip.status,
    });
  };
  const updateTrip = async (id, body, message) => {
    toast.info("Actualizando viaje...");
    try { await apiFetch(`/api/viajes/${id}`, { method: "PUT", body }); toast.success(message); refresh(); } catch (value) { fail(value); }
  };
  const assignTruck = (trip) => {
    const truckVehicleId = truckAssignments[trip.id];
    if (!truckVehicleId) return toast.error("Selecciona un camion disponible.");
    updateTrip(trip.id, { truckVehicleId }, "Camion asignado.");
  };
  const start = (trip) => {
    const truckVehicleId = trip.truckVehicleId || truckAssignments[trip.id];
    if (!truckVehicleId) return toast.error("Asigna un camion antes de iniciar el viaje.");
    updateTrip(trip.id, { truckVehicleId, status: "in_progress" }, "Viaje iniciado. Camion y remolque quedaron En viaje.");
  };
  const complete = (trip) => updateTrip(trip.id, { status: "completed", arrivalAt: new Date().toISOString().slice(0, 10) }, "Viaje completado. Las unidades fueron liberadas.");
  const cancel = (trip) => confirmToast(`¿Cancelar el viaje ${trip.rotation ? `Virada ${trip.rotation} · ` : ""}${trip.origin} - ${trip.destination}?`, async () => {
    try { await apiFetch(`/api/viajes/${trip.id}`, { method: "DELETE" }); toast.success("Viaje cancelado. Las unidades fueron liberadas."); refresh(); } catch (value) { fail(value); }
  });

  return <>
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4"><h1 className="h3 mb-0">Viajes</h1><button className="btn btn-outline-primary" onClick={refresh}>Actualizar</button></div>
    <div className="row g-4">
      <div className="col-lg-4"><form className="card card-body shadow-sm" onSubmit={submit}>
        <h2 className="h5">{editing ? "Editar viaje" : "Nuevo viaje"}</h2>
        <select className="form-select mb-2" value={form.customerId} onChange={(event) => set("customerId", event.target.value)} required><option value="">Cliente *</option>{customersForForm.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</select>
        <select className="form-select mb-2" value={form.trailerVehicleId} onChange={(event) => set("trailerVehicleId", event.target.value)} required><option value="">Remolque *</option>{trailersForForm.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.licensePlate}</option>)}</select>
        <select className="form-select mb-2" value={form.truckVehicleId} onChange={(event) => set("truckVehicleId", event.target.value)}><option value="">Camion (opcional al planificar)</option>{trucksForForm.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.licensePlate}</option>)}</select>
        <select className="form-select mb-2" value={form.driverId} onChange={(event) => set("driverId", event.target.value)} required><option value="">Chofer *</option>{activeDrivers.map((driver) => <option key={driver.id} value={driver.id}>{driver.fullName}</option>)}</select>
        <input className="form-control mb-2" placeholder="Origen" value={form.origin} onChange={(event) => set("origin", event.target.value)} required />
        <input className="form-control mb-2" placeholder="Destino" value={form.destination} onChange={(event) => set("destination", event.target.value)} required />
        <input className="form-control mb-2" type="date" value={form.departureAt} onChange={(event) => set("departureAt", event.target.value)} required />
        <select className="form-select mb-2" value={form.cargoType} onChange={(event) => set("cargoType", event.target.value)}><option value="refrigerated">Camara de frio</option><option value="container">Contenedor</option></select>
        {form.cargoType === "container" && <input className="form-control mb-2" placeholder="Numero de contenedor" value={form.containerNumber} onChange={(event) => set("containerNumber", event.target.value)} required />}
        <input className="form-control mb-2" placeholder="Virada / rotacion" value={form.rotation} onChange={(event) => set("rotation", event.target.value)} />
        <textarea className="form-control mb-2" placeholder="Notas" value={form.notes} onChange={(event) => set("notes", event.target.value)} />
        {editing && <><select className="form-select mb-2" value={form.status} onChange={(event) => set("status", event.target.value)}><option value="pending">Pendiente</option><option value="in_progress">En curso</option><option value="completed">Completado</option><option value="cancelled">Cancelado</option></select>{form.status === "completed" && <input className="form-control mb-2" type="date" value={form.arrivalAt} onChange={(event) => set("arrivalAt", event.target.value)} />}</>}
        <div className="d-flex gap-2"><button className="btn btn-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? (editing ? "Guardando..." : "Creando viaje...") : (editing ? "Guardar cambios" : "Crear viaje")}</button>{editing && <button type="button" className="btn btn-outline-secondary" onClick={reset} disabled={isSubmitting}>Cancelar</button>}</div>
      </form></div>
      <div className="col-lg-8">
        <div className="card card-body shadow-sm mb-3">
          <div className="row g-2">
            <div className="col-md-6"><input className="form-control" placeholder="Filtrar por origen" value={filters.origin} onChange={(event) => setFilter("origin", event.target.value)} /></div>
            <div className="col-md-6"><input className="form-control" placeholder="Filtrar por destino" value={filters.destination} onChange={(event) => setFilter("destination", event.target.value)} /></div>
            <div className="col-md-6"><select className="form-select" value={filters.trailerVehicleId} onChange={(event) => setFilter("trailerVehicleId", event.target.value)}><option value="">Todos los remolques</option>{vehicles.items.filter((item) => item.type === "trailer").map((item) => <option key={item.id} value={item.id}>{item.licensePlate}</option>)}</select></div>
            <div className="col-md-6"><select className="form-select" value={filters.truckVehicleId} onChange={(event) => setFilter("truckVehicleId", event.target.value)}><option value="">Todos los camiones</option>{vehicles.items.filter((item) => item.type === "truck").map((item) => <option key={item.id} value={item.id}>{item.licensePlate}</option>)}</select></div>
            <div className="col-md-4"><label className="form-label small mb-1">Fecha puntual</label><input className="form-control" type="date" value={filters.dateExact} onChange={(event) => setFilter("dateExact", event.target.value)} /></div>
            <div className="col-md-4"><label className="form-label small mb-1">Desde</label><input className="form-control" type="date" disabled={Boolean(filters.dateExact)} value={filters.dateFrom} onChange={(event) => setFilter("dateFrom", event.target.value)} /></div>
            <div className="col-md-4"><label className="form-label small mb-1">Hasta</label><input className="form-control" type="date" disabled={Boolean(filters.dateExact)} value={filters.dateTo} onChange={(event) => setFilter("dateTo", event.target.value)} /></div>
          </div>
          <button className="btn btn-sm btn-outline-secondary mt-3 align-self-start" onClick={() => setFilters(emptyFilters)}>Limpiar filtros</button>
        </div>
        <div className="card shadow-sm table-responsive">
          <table className="table mb-0">
            <thead><tr><th>Ruta</th><th>Virada</th><th>Recursos</th><th>Carga</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>{filteredTrips.map((trip) => <tr key={trip.id}>
              <td><strong>{trip.origin} - {trip.destination}</strong><br /><small>{displayDate(trip.departureAt)}</small></td>
              <td>{trip.rotation || "-"}</td>
              <td>{trip.trailer?.licensePlate || "-"}<br />{trip.truck?.licensePlate || "Sin camion"}</td>
              <td>{trip.cargoType === "container" ? `Contenedor ${trip.containerNumber}` : "Camara de frio"}</td>
              <td>{statuses[trip.status]}</td>
              <td className="text-nowrap"><button className="btn btn-sm btn-outline-secondary me-1 mb-1" onClick={() => navigate(`/viajes/${trip.id}`)}>Detalle</button>{trip.status === "pending" && !trip.truckVehicleId && <div className="d-flex gap-1 mb-1"><select className="form-select form-select-sm" value={truckAssignments[trip.id] || ""} onChange={(event) => setTruckAssignments({ ...truckAssignments, [trip.id]: event.target.value })}><option value="">Camion</option>{availableTrucks.map((truck) => <option key={truck.id} value={truck.id}>{truck.licensePlate}</option>)}</select><button className="btn btn-sm btn-outline-primary" onClick={() => assignTruck(trip)}>Asignar</button></div>}<button className="btn btn-sm btn-outline-primary me-1 mb-1" onClick={() => edit(trip)}>Editar</button>{trip.status === "pending" && <button className="btn btn-sm btn-success me-1 mb-1" onClick={() => start(trip)}>Iniciar</button>}{trip.status === "in_progress" && <button className="btn btn-sm btn-success me-1 mb-1" onClick={() => complete(trip)}>Completar</button>}{!(["completed", "cancelled"].includes(trip.status)) && <button className="btn btn-sm btn-outline-danger mb-1" onClick={() => cancel(trip)}>Cancelar</button>}</td>
            </tr>)}{!filteredTrips.length && <tr><td colSpan="6" className="text-muted">No hay viajes que coincidan con los filtros.</td></tr>}</tbody>
          </table>
        </div>
      </div>
    </div>
  </>;
}

export function WorkOrdersPage() {
  const navigate = useNavigate();
  const orders = useCollection("/api/ordenes-taller");
  const vehicles = useCollection("/api/vehiculos");
  const [form, setForm] = useState(emptyWorkOrder);
  const [draftStatuses, setDraftStatuses] = useState({});
  const [filters, setFilters] = useState(emptyWorkOrderFilters);
  const filteredOrders = useMemo(() => orders.items.filter((order) => {
    const searchable = `${order.vehicle?.licensePlate || ""} ${order.type || ""} ${order.description || ""}`.toLowerCase();
    const checkInAt = dateValue(order.checkInAt);
    if (filters.search && !searchable.includes(filters.search.toLowerCase())) return false;
    if (filters.vehicleId && order.vehicleId !== filters.vehicleId) return false;
    if (filters.status && order.status !== filters.status) return false;
    if (filters.dateExact && checkInAt !== filters.dateExact) return false;
    if (!filters.dateExact && filters.dateFrom && checkInAt < filters.dateFrom) return false;
    if (!filters.dateExact && filters.dateTo && checkInAt > filters.dateTo) return false;
    return true;
  }), [orders.items, filters]);
  const refresh = async () => { await Promise.all([orders.refresh(), vehicles.refresh()]); };
  const submit = async (event) => {
    event.preventDefault();
    try { await apiFetch("/api/ordenes-taller", { method: "POST", body: { ...form, odometer: form.odometer ? Number(form.odometer) : null, status: "pending" } }); toast.success("Orden creada. El vehiculo ahora esta En taller."); setForm(emptyWorkOrder); refresh(); } catch (value) { fail(value); }
  };
  const updateStatus = async (order) => {
    const status = draftStatuses[order.id] || order.status;
    toast.info("Actualizando orden de taller...");
    try { await apiFetch(`/api/ordenes-taller/${order.id}`, { method: "PUT", body: { status, ...(status === "completed" ? { checkOutAt: new Date().toISOString().slice(0, 10) } : {}) } }); toast.success(status === "completed" ? "Orden completada. El vehiculo esta Disponible." : "Estado de orden actualizado."); refresh(); } catch (value) { fail(value); }
  };
  const cancel = (order) => confirmToast("¿Cancelar esta orden de taller?", async () => {
    try { await apiFetch(`/api/ordenes-taller/${order.id}`, { method: "DELETE" }); toast.success("Orden cancelada."); refresh(); } catch (value) { fail(value); }
  });
  const setFilter = (field, value) => setFilters((current) => ({ ...current, [field]: value }));
  return <><div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4"><h1 className="h3 mb-0">Ordenes de taller</h1><button className="btn btn-outline-primary" onClick={refresh}>Actualizar</button></div><div className="row g-4"><div className="col-lg-4"><form className="card card-body shadow-sm" onSubmit={submit}><h2 className="h5">Nueva orden</h2><select className="form-select mb-2" value={form.vehicleId} onChange={(event) => setForm({ ...form, vehicleId: event.target.value })} required><option value="">Vehiculo *</option>{vehicles.items.filter((vehicle) => vehicle.status === "available" || vehicle.status === "in_service" || vehicle.status === "maintenance").map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.licensePlate}</option>)}</select><input className="form-control mb-2" type="date" value={form.checkInAt} onChange={(event) => setForm({ ...form, checkInAt: event.target.value })} required /><input className="form-control mb-2" placeholder="Tipo de trabajo" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })} /><input className="form-control mb-2" type="number" placeholder="Odometro" value={form.odometer} onChange={(event) => setForm({ ...form, odometer: event.target.value })} /><textarea className="form-control mb-3" placeholder="Descripcion *" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required /><button className="btn btn-primary">Crear orden</button></form></div><div className="col-lg-8"><div className="card card-body shadow-sm mb-3"><div className="row g-2"><div className="col-md-5"><input className="form-control" placeholder="Buscar por vehiculo, tipo o descripcion" value={filters.search} onChange={(event) => setFilter("search", event.target.value)} /></div><div className="col-md-4"><select className="form-select" value={filters.vehicleId} onChange={(event) => setFilter("vehicleId", event.target.value)}><option value="">Todos los vehiculos</option>{vehicles.items.map((vehicle) => <option key={vehicle.id} value={vehicle.id}>{vehicle.licensePlate}</option>)}</select></div><div className="col-md-3"><select className="form-select" value={filters.status} onChange={(event) => setFilter("status", event.target.value)}><option value="">Todos los estados</option><option value="pending">Pendiente</option><option value="in_progress">En curso</option><option value="completed">Completado</option><option value="cancelled">Cancelado</option></select></div><div className="col-md-4"><label className="form-label small mb-1">Fecha puntual</label><input className="form-control" type="date" value={filters.dateExact} onChange={(event) => setFilter("dateExact", event.target.value)} /></div><div className="col-md-4"><label className="form-label small mb-1">Desde</label><input className="form-control" type="date" disabled={Boolean(filters.dateExact)} value={filters.dateFrom} onChange={(event) => setFilter("dateFrom", event.target.value)} /></div><div className="col-md-4"><label className="form-label small mb-1">Hasta</label><input className="form-control" type="date" disabled={Boolean(filters.dateExact)} value={filters.dateTo} onChange={(event) => setFilter("dateTo", event.target.value)} /></div></div><button className="btn btn-sm btn-outline-secondary mt-3 align-self-start" onClick={() => setFilters(emptyWorkOrderFilters)}>Limpiar filtros</button></div><div className="card shadow-sm table-responsive"><table className="table mb-0"><thead><tr><th>Vehiculo</th><th>Ingreso</th><th>Descripcion</th><th>Estado</th><th>Acciones</th></tr></thead><tbody>{filteredOrders.map((order) => <tr key={order.id}><td>{order.vehicle?.licensePlate || "-"}</td><td>{displayDate(order.checkInAt)}</td><td>{order.description}</td><td>{statuses[order.status]}</td><td className="text-nowrap"><button className="btn btn-sm btn-outline-secondary me-1" onClick={() => navigate(`/taller/${order.id}`)}>Detalle</button>{!(["completed", "cancelled"].includes(order.status)) && <><select className="form-select form-select-sm d-inline-block w-auto me-1" value={draftStatuses[order.id] || order.status} onChange={(event) => setDraftStatuses({ ...draftStatuses, [order.id]: event.target.value })}><option value="pending">Pendiente</option><option value="in_progress">En curso</option><option value="completed">Completado</option></select><button className="btn btn-sm btn-success me-1" onClick={() => updateStatus(order)}>Guardar</button><button className="btn btn-sm btn-outline-danger" onClick={() => cancel(order)}>Cancelar</button></>}</td></tr>)}{!filteredOrders.length && <tr><td colSpan="5" className="text-muted">No hay ordenes que coincidan con los filtros.</td></tr>}</tbody></table></div></div></div></>;
}

export function WorkOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  useEffect(() => { apiFetch(`/api/ordenes-taller/${id}`).then(setOrder).catch(fail); }, [id]);
  if (!order) return <div className="card card-body text-muted">Cargando orden...</div>;
  const rows = [["Vehiculo", order.vehicle?.licensePlate || "-"], ["Estado", statuses[order.status] || order.status], ["Ingreso", displayDate(order.checkInAt)], ["Finalizacion", displayDate(order.checkOutAt)], ["Tipo de trabajo", order.type || "-"], ["Odometro", order.odometer ?? "-"]];
  return <><div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4"><h1 className="h3 mb-0">Detalle de orden de taller</h1><button className="btn btn-outline-primary" onClick={() => navigate("/taller")}>Volver a taller</button></div><div className="card shadow-sm"><div className="card-body"><div className="row g-3">{rows.map(([label, value]) => <div className="col-md-4" key={label}><div className="small text-muted">{label}</div><div>{value}</div></div>)}<div className="col-12"><div className="small text-muted">Descripcion del trabajo</div><div>{order.description}</div></div></div></div></div></>;
}
