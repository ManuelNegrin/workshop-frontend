import { apiFetch } from "./api";

export const getvehiculos = async () => {
  return apiFetch("/api/vehiculos", { method: "GET" });
};

export const getVehicleById = async (id) => {
  return apiFetch(`/api/vehiculos/${id}`, { method: "GET" });
};

export const createVehicle = async (vehicleData) => {
  return apiFetch("/api/vehiculos", {
    method: "POST",
    body: JSON.stringify(vehicleData),
  });
};

export const updateVehicle = async (id, vehicleData) => {
  return apiFetch(`/api/vehiculos/${id}`, {
    method: "PUT",
    body: JSON.stringify(vehicleData),
  });
};

export const deleteVehicle = async (id) => {
  return apiFetch(`/api/vehiculos/${id}`, { method: "DELETE" });
};
