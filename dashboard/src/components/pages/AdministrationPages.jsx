import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/useAuth";
import { apiFetch } from "../../services/api";
import { changeOwnPassword } from "../../services/auth";
import { confirmToast } from "../ConfirmationToast";

const roleLabels = {
  Administrator: "Administrador",
  Logistics: "Logistica",
  Mechanics: "Mecanica",
};

const emptyUserForm = {
  fullName: "",
  email: "",
  password: "",
  status: "active",
  roleIds: [],
};

const fail = (value) => toast.error(value.message || "No se pudo completar la solicitud.");
const userStatus = (value) => value === "active" ? "Activo" : "Inactivo";

export function UserAdministrationPage() {
  const { user, hasPermission } = useAuth();
  const [organization, setOrganization] = useState(null);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [audit, setAudit] = useState([]);
  const [form, setForm] = useState(emptyUserForm);
  const [editing, setEditing] = useState(null);

  const load = useCallback(async () => {
    const results = await Promise.allSettled([
        hasPermission("organization.read") ? apiFetch("/api/admin/organization") : null,
        apiFetch("/api/admin/users"),
        apiFetch("/api/admin/users/roles"),
        hasPermission("audit.read") ? apiFetch("/api/admin/organization/audit") : [],
    ]);
    const [organizationResult, usersResult, rolesResult, auditResult] = results;
    if (organizationResult.status === "fulfilled") setOrganization(organizationResult.value);
    if (usersResult.status === "fulfilled") setUsers(usersResult.value);
    if (rolesResult.status === "fulfilled") setRoles(rolesResult.value);
    if (auditResult.status === "fulfilled") setAudit(auditResult.value);
    for (const result of results) if (result.status === "rejected") fail(result.reason);
  }, [hasPermission]);

  useEffect(() => { load(); }, [load]);

  const cancel = () => {
    setEditing(null);
    setForm(emptyUserForm);
  };

  const startEdit = (item) => {
    toast.info("Editando usuario.");
    setEditing(item);
    setForm({
      fullName: item.fullName,
      email: item.email,
      password: "",
      status: item.status,
      roleIds: item.roles.map((role) => role.id),
    });
  };

  const toggleRole = (roleId) => setForm((current) => ({
    ...current,
    roleIds: current.roleIds.includes(roleId)
      ? current.roleIds.filter((id) => id !== roleId)
      : [...current.roleIds, roleId],
  }));

  const submit = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        toast.info("Actualizando usuario...");
        await apiFetch(`/api/admin/users/${editing.id}`, {
          method: "PUT",
          body: {
            fullName: form.fullName,
            email: form.email,
            status: form.status,
            ...(form.password ? { password: form.password } : {}),
          },
        });
        if (editing.id !== user.id) {
          await apiFetch(`/api/admin/users/${editing.id}/roles`, {
            method: "PUT",
            body: { roleIds: form.roleIds },
          });
        }
        toast.success("Usuario actualizado.");
      } else {
        await apiFetch("/api/admin/users", { method: "POST", body: form });
        toast.success("Usuario creado.");
      }
      cancel();
      load();
    } catch (value) {
      fail(value);
    }
  };

  const deactivate = (item) => confirmToast(`¿Desactivar a ${item.fullName}?`, async () => {
    try {
      await apiFetch(`/api/admin/users/${item.id}`, { method: "DELETE" });
      toast.success("Usuario desactivado.");
      load();
    } catch (value) {
      fail(value);
    }
  });

  return <>
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
      <h1 className="h3 mb-0">Administracion de organizacion</h1>
      <button className="btn btn-outline-primary" onClick={load}>Actualizar</button>
    </div>
    {organization && <div className="card card-body shadow-sm mb-4">
      <strong>{organization.name}</strong>
      <span className="text-muted">Plan {organization.planCode} · {organization.status === "active" ? "Activo" : "Suspendido"}</span>
    </div>}
    <div className="row g-4">
      <div className="col-lg-4">
        <form className="card card-body shadow-sm" onSubmit={submit}>
          <h2 className="h5">{editing ? "Editar usuario" : "Nuevo usuario"}</h2>
          <input className="form-control mb-2" placeholder="Nombre completo" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} required />
          <input className="form-control mb-2" type="email" placeholder="Correo" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          {editing?.id !== user.id && <input className="form-control mb-2" type="password" placeholder={editing ? "Nueva contrasena (opcional)" : "Contrasena (minimo 12)"} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required={!editing} minLength="12" />}
          <select className="form-select mb-2" value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
          {editing?.id === user.id ? <p className="small text-muted mb-2">Tus perfiles se conservan. La contrasena tambien se cambia desde Mi perfil.</p> : <fieldset className="mb-3">
            <legend className="fs-6">Perfiles</legend>
            {roles.map((role) => <label className="form-check" key={role.id}>
              <input className="form-check-input" type="checkbox" checked={form.roleIds.includes(role.id)} onChange={() => toggleRole(role.id)} />
              <span className="form-check-label">{roleLabels[role.name] || role.name}</span>
            </label>)}
          </fieldset>}
          <div className="d-flex gap-2">
            <button className="btn btn-primary">{editing ? "Guardar cambios" : "Crear usuario"}</button>
            {editing && <button type="button" className="btn btn-outline-secondary" onClick={cancel}>Cancelar</button>}
          </div>
        </form>
      </div>
      <div className="col-lg-8">
        <div className="card shadow-sm table-responsive">
          <div className="card-header">Usuarios</div>
          <table className="table mb-0">
            <thead><tr><th>Nombre</th><th>Email</th><th>Estado</th><th>Perfiles</th><th /></tr></thead>
            <tbody>{users.map((item) => <tr key={item.id}>
              <td>{item.fullName}</td><td>{item.email}</td><td>{userStatus(item.status)}</td>
              <td>{item.roles.map((role) => roleLabels[role.name] || role.name).join(", ") || "-"}</td>
              <td className="text-nowrap"><button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEdit(item)}>Editar</button>{item.id !== user.id && item.status === "active" && <button className="btn btn-sm btn-outline-danger" onClick={() => deactivate(item)}>Desactivar</button>}</td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
      {hasPermission("audit.read") && <div className="col-12"><div className="card shadow-sm"><div className="card-header">Auditoria reciente</div><ul className="list-group list-group-flush">{audit.slice(0, 20).map((entry) => <li className="list-group-item" key={entry.id}><strong>{entry.action}</strong> · {entry.actor?.fullName || "Sistema"}</li>)}</ul></div></div>}
    </div>
  </>;
}

export function ProfilePage() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmation: "" });

  const submit = async (event) => {
    event.preventDefault();
    if (form.newPassword !== form.confirmation) return toast.error("Las contrasenas no coinciden.");
    try {
      toast.info("Actualizando contrasena...");
      await changeOwnPassword(form.currentPassword, form.newPassword);
      toast.success("Contrasena actualizada. Inicia sesion nuevamente.");
      logout();
      navigate("/login", { replace: true });
    } catch (value) {
      fail(value);
    }
  };

  return <><h1 className="h3 mb-4">Mi perfil</h1><form className="card card-body shadow-sm col-lg-5" onSubmit={submit}>
    <h2 className="h5">Cambiar contrasena</h2>
    <input className="form-control mb-2" type="password" placeholder="Contrasena actual" value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} required />
    <input className="form-control mb-2" type="password" placeholder="Nueva contrasena (minimo 12)" value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} minLength="12" required />
    <input className="form-control mb-3" type="password" placeholder="Repetir nueva contrasena" value={form.confirmation} onChange={(event) => setForm({ ...form, confirmation: event.target.value })} minLength="12" required />
    <button className="btn btn-primary align-self-start">Actualizar contrasena</button>
  </form></>;
}
