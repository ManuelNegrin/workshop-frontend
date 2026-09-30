import { apiFetch } from "./api";

export const getOrdenes = async () => {
  return apiFetch("/api/ordenes-taller", { method: "GET" });
};

export const getOrdenById = async (id) => {
  return apiFetch(`/api/ordenes-taller/${id}`, { method: "GET" });
};

export const createOrden = async (ordenData) => {
  return apiFetch("/api/ordenes-taller", {
    method: "POST",
    body: JSON.stringify(ordenData),
  });
};

export const updateOrden = async (id, ordenData) => {
  return apiFetch(`/api/ordenes-taller/${id}`, {
    method: "PUT",
    body: JSON.stringify(ordenData),
  });
};

export const deleteOrden = async (id) => {
  return apiFetch(`/api/ordenes-taller/${id}`, { method: "DELETE" });
};
