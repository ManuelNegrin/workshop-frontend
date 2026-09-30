import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const links = [
  ["/", "Resumen", "dashboard.read"],
  ["/viajes", "Viajes", "trips.read"],
  ["/clientes", "Clientes", "customers.read"],
  ["/vehiculos", "Vehiculos", "vehicles.read"],
  ["/choferes", "Choferes", "drivers.read"],
  ["/combustible", "Combustible", "fuel_tickets.read"],
  ["/taller", "Ordenes de taller", "work_orders.read"],
  ["/admin", "Administracion", "users.manage"],
  ["/perfil", "Mi perfil", null],
];

export default function SideBar() {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  return (
    <aside className="sidebar p-3">
      <div className="sidebar-brand">
        <div>FIXORIS</div>
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
