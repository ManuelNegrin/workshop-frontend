import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getViajes,
  createViaje,
  updateViaje,
  deleteViaje,
} from "../../services/viajesService";

export const fetchViajes = createAsyncThunk("viajes/fetchAll", async () => {
  const data = await getViajes();
  return data;
});

export const addViaje = createAsyncThunk("viajes/add", async (viaje) => {
  const data = await createViaje(viaje);
  return data;
});

export const editViaje = createAsyncThunk(
  "viajes/edit",
  async ({ id, viajeData }) => {
    const data = await updateViaje(id, viajeData);
    return data;
  }
);

export const removeViaje = createAsyncThunk("viajes/remove", async (id) => {
  await deleteViaje(id);
  return id;
});

const viajesSlice = createSlice({
  name: "viajes",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchViajes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchViajes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchViajes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addViaje.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editViaje.fulfilled, (state, action) => {
        const index = state.list.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(removeViaje.fulfilled, (state, action) => {
        state.list = state.list.filter((v) => v.id !== action.payload);
      });
  },
});

export default viajesSlice.reducer;
