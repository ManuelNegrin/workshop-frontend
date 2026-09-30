import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../../services/ticketsService";

export const fetchTickets = createAsyncThunk("tickets/fetchAll", async () => {
  const data = await getTickets();
  return data;
});

export const addTicket = createAsyncThunk("tickets/add", async (ticket) => {
  const data = await createTicket(ticket);
  return data;
});

export const editTicket = createAsyncThunk(
  "tickets/edit",
  async ({ id, ticketData }) => {
    const data = await updateTicket(id, ticketData);
    return data;
  }
);

export const removeTicket = createAsyncThunk("tickets/remove", async (id) => {
  await deleteTicket(id);
  return id;
});

const ticketsSlice = createSlice({
  name: "tickets",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addTicket.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editTicket.fulfilled, (state, action) => {
        const index = state.list.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(removeTicket.fulfilled, (state, action) => {
        state.list = state.list.filter((v) => v.id !== action.payload);
      });
  },
});

export default ticketsSlice.reducer;
