import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const links = [
  ["/", "Resumen", "dashboard.read"],
  ["/clientes", "Clientes", "customers.read"],
  ["/vehiculos", "Vehiculos", "vehicles.read"],
  ["/agenda", "Agenda", "appointments.read"],
  ["/ordenes", "Órdenes", "repair_orders.read"],
  ["/tecnicos", "Técnicos", "technicians.read"],
  ["/inventario", "Inventario", "inventory.read"],
  ["/sucursales", "Sucursales", "locations.read"],
  ["/admin", "Administracion", "users.manage"],
  ["/perfil", "Mi perfil", null],
];

export default function SideBar() {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="sidebar p-3">
      <div className="sidebar-brand">
        <div>TALLER</div>
      </div>
      <div className="small text-white-50 mb-3">{user?.fullName}</div>
      <nav className="nav nav-pills flex-column gap-1">
        {links
          .filter(
            ([, , permission]) => !permission || hasPermission(permission),
          )
          .map(([to, text]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              {text}
            </NavLink>
          ))}
      </nav>
      <button
        className="btn btn-outline-light btn-sm mt-auto"
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Cerrar sesion
      </button>
    </aside>
  );
}
