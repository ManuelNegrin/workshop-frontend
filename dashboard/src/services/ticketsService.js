import { apiFetch } from "./api";

export const getTickets = async () => {
  return apiFetch("/api/tickets-taller", { method: "GET" });
};

export const getTicketById = async (id) => {
  return apiFetch(`/api/tickets-taller/${id}`, { method: "GET" });
};

export const createTicket = async (ticketData) => {
  return apiFetch("/api/tickets-taller", {
    method: "POST",
    body: JSON.stringify(ticketData),
  });
};

export const updateTicket = async (id, ticketData) => {
  return apiFetch(`/api/tickets-taller/${id}`, {
    method: "PUT",
    body: JSON.stringify(ticketData),
  });
};

export const deleteTicket = async (id) => {
  return apiFetch(`/api/tickets-taller/${id}`, { method: "DELETE" });
};
