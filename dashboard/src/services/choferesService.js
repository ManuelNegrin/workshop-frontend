import { apiFetch } from "./api";

export const getChoferes = async () => {
  return apiFetch("/api/choferes", { method: "GET" });
};

export const getChoferById = async (id) => {
  return apiFetch(`/api/choferes/${id}`, { method: "GET" });
};

export const createChofer = async (choferData) => {
  return apiFetch("/api/choferes", {
    method: "POST",
    body: JSON.stringify(choferData),
  });
};

export const updateChofer = async (id, choferData) => {
  return apiFetch(`/api/choferes/${id}`, {
    method: "PUT",
    body: JSON.stringify(choferData),
  });
};

export const deleteChofer = async (id) => {
  return apiFetch(`/api/choferes/${id}`, { method: "DELETE" });
};
