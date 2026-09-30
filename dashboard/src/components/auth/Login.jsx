import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

export default function Login() {
  const { user, login } = useAuth(); const navigate = useNavigate(); const location = useLocation();
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [error, setError] = useState(""); const [sending, setSending] = useState(false);
  if (user) return <Navigate to={user.isPlatformAdmin ? "/platform" : "/"} replace />;
  const submit = async (event) => { event.preventDefault(); setSending(true); setError(""); try { const account = await login(email, password); navigate(account.isPlatformAdmin ? "/platform" : location.state?.from?.pathname || "/", { replace: true }); } catch (value) { setError(value.message || "No se pudo iniciar sesion."); } finally { setSending(false); } };
  return <main className="login-page"><form className="login-card shadow" onSubmit={submit}><h1 className="h3 mb-3">Gestion de flota</h1><p className="text-muted">Inicia sesion con tu correo.</p>{error && <div className="alert alert-danger">{error}</div>}<label className="form-label">Correo electronico</label><input className="form-control mb-3" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /><label className="form-label">Contrasena</label><input className="form-control mb-3" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" /><button className="btn btn-primary w-100" disabled={sending}>{sending ? "Ingresando..." : "Ingresar"}</button></form></main>;
}
