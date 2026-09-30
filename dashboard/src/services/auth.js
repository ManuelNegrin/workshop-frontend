import { apiFetch } from "./api";

export const login = (email, password) => apiFetch("/api/auth/login", {
  method: "POST",
  body: { email, password },
});

export const getCurrentUser = () => apiFetch("/api/auth/me");

export const changeOwnPassword = (currentPassword, newPassword) => apiFetch("/api/auth/me/password", {
  method: "PUT",
  body: { currentPassword, newPassword },
});
