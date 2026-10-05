import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toast.css";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/useAuth";
import Login from "./components/auth/Login";
import ProtectedRoute from "./components/auth/ProtectedRoutes";
import Layout from "./components/layout/Layout";
import { ProfilePage, UserAdministrationPage } from "./components/pages/AdministrationPages";
import {
  DashboardPage, CustomersPage, CustomerDetailPage, VehiclesPage, VehicleDetailPage,
  AppointmentsPage, RepairOrdersPage, RepairOrderDetailPage, LocationsPage, TechniciansPage,
  InventoryPage,
  DeliveryNotePrintPage,
} from "./components/pages/WorkshopPages";

function PlatformRedirect() {
  const { logout } = useAuth();
  const url = import.meta.env.VITE_PLATFORM_CONSOLE_URL;
  if (url) { window.location.replace(url); return null; }
  return <main className="login-page"><div className="login-card shadow"><h1 className="h4">Consola de plataforma</h1><p>Configurá la URL de la consola de plataforma.</p><button className="btn btn-outline-primary" onClick={logout}>Cerrar sesión</button></div></main>;
}

function HomePage() {
  const { hasPermission } = useAuth();
  if (hasPermission("dashboard.read")) return <DashboardPage />;
  if (hasPermission("repair_orders.read")) return <Navigate to="/ordenes" replace />;
  if (hasPermission("customers.read")) return <Navigate to="/clientes" replace />;
  return <p>No tenés permisos de consulta. Contactá a un administrador.</p>;
}

export default function App() {
  return <><ToastContainer position="top-center" newestOnTop /><AuthProvider><Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/platform" element={<PlatformRedirect />} />
    <Route element={<ProtectedRoute />}><Route element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route element={<ProtectedRoute permission="customers.read" />}><Route path="clientes" element={<CustomersPage />} /><Route path="clientes/:id" element={<CustomerDetailPage />} /></Route>
      <Route element={<ProtectedRoute permission="vehicles.read" />}><Route path="vehiculos" element={<VehiclesPage />} /><Route path="vehiculos/:id" element={<VehicleDetailPage />} /></Route>
      <Route element={<ProtectedRoute permission="appointments.read" />}><Route path="agenda" element={<AppointmentsPage />} /></Route>
      <Route element={<ProtectedRoute permission="repair_orders.read" />}><Route path="ordenes" element={<RepairOrdersPage />} /><Route path="ordenes/:id" element={<RepairOrderDetailPage />} /></Route>
      <Route element={<ProtectedRoute permission="delivery_notes.read" />}><Route path="ordenes/:id/remito" element={<DeliveryNotePrintPage />} /></Route>
      <Route element={<ProtectedRoute permission="locations.read" />}><Route path="sucursales" element={<LocationsPage />} /></Route>
      <Route element={<ProtectedRoute permission="technicians.read" />}><Route path="tecnicos" element={<TechniciansPage />} /></Route>
      <Route element={<ProtectedRoute permission="inventory.read" />}><Route path="inventario" element={<InventoryPage />} /></Route>
      <Route path="perfil" element={<ProfilePage />} />
      <Route element={<ProtectedRoute permission="users.manage" />}><Route path="admin" element={<UserAdministrationPage />} /></Route>
    </Route></Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></AuthProvider></>;
}
