import { apiFetch } from "./api";

export const getViajes = async () => {
  return apiFetch("/api/viajes", { method: "GET" });
};

export const getViajeById = async (id) => {
  return apiFetch(`/api/viajes/${id}`, { method: "GET" });
};

export const createViaje = async (viajeData) => {
  return apiFetch("/api/viajes", {
    method: "POST",
    body: JSON.stringify(viajeData),
  });
};

export const updateViaje = async (id, viajeData) => {
  return apiFetch(`/api/viajes/${id}`, {
    method: "PUT",
    body: JSON.stringify(viajeData),
  });
};

export const deleteViaje = async (id) => {
  return apiFetch(`/api/viajes/${id}`, { method: "DELETE" });
};
