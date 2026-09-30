import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toast.css";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import Layout from "./components/layout/Layout";
import { DashboardPage } from "./components/pages/OperationsPages";
import { ProfilePage, UserAdministrationPage } from "./components/pages/AdministrationPages";
import { TripsPage, WorkOrderDetailPage, WorkOrdersPage } from "./components/pages/TripAndWorkshopPages";
import { TripDetailPage, VehicleDetailPage, VehiclesPage } from "./components/pages/FleetPages";
import { DriverDetailPage, DriversPage, FuelTicketDetailPage, FuelTicketsPage } from "./components/pages/ManagementPages";
import { CustomerDetailPage, CustomersPage } from "./components/pages/CustomerPages";

function PlatformRedirect() {
  const { logout } = useAuth();
  const url = import.meta.env.VITE_PLATFORM_CONSOLE_URL;
  if (url) { window.location.replace(url); return null; }
  return <main className="login-page"><div className="login-card shadow"><h1 className="h4">Consola de plataforma</h1><p>La cuenta es superadministradora. Configura VITE_PLATFORM_CONSOLE_URL para abrir la consola independiente.</p><button className="btn btn-outline-primary" onClick={logout}>Cerrar sesion</button></div></main>;
}

function HomePage() {
  const { hasPermission } = useAuth();
  if (hasPermission("dashboard.read")) return <DashboardPage />;
  if (hasPermission("vehicles.read")) return <Navigate to="/vehiculos" replace />;
  if (hasPermission("work_orders.read")) return <Navigate to="/taller" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return <><ToastContainer position="top-center" className="app-toast-center" newestOnTop pauseOnFocusLoss={false} /><AuthProvider><Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/platform" element={<PlatformRedirect />} />
    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route element={<ProtectedRoute permission="trips.read" />}><Route path="viajes" element={<TripsPage />} /><Route path="viajes/:id" element={<TripDetailPage />} /></Route>
        <Route element={<ProtectedRoute permission="customers.read" />}><Route path="clientes" element={<CustomersPage />} /><Route path="clientes/:id" element={<CustomerDetailPage />} /></Route>
        <Route element={<ProtectedRoute permission="vehicles.read" />}><Route path="vehiculos" element={<VehiclesPage />} /><Route path="vehiculos/:id" element={<VehicleDetailPage />} /></Route>
        <Route element={<ProtectedRoute permission="drivers.read" />}><Route path="choferes" element={<DriversPage />} /><Route path="choferes/:id" element={<DriverDetailPage />} /></Route>
        <Route element={<ProtectedRoute permission="fuel_tickets.read" />}><Route path="combustible" element={<FuelTicketsPage />} /><Route path="combustible/:id" element={<FuelTicketDetailPage />} /></Route>
        <Route element={<ProtectedRoute permission="work_orders.read" />}><Route path="taller" element={<WorkOrdersPage />} /><Route path="taller/:id" element={<WorkOrderDetailPage />} /></Route>
        <Route path="perfil" element={<ProfilePage />} />
        <Route element={<ProtectedRoute permission="users.manage" />}><Route path="admin" element={<UserAdministrationPage />} /></Route>
      </Route>
    </Route>
    <Route path="*" element={<Login />} />
  </Routes></AuthProvider></>;
}
