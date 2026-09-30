import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOrdenes,
  createOrden,
  updateOrden,
  deleteOrden,
} from "../../services/ordenesService";

export const fetchOrdenes = createAsyncThunk("ordenes/fetchAll", async () => {
  const data = await getOrdenes();
  return data;
});

export const addOrden = createAsyncThunk("ordenes/add", async (orden) => {
  const data = await createOrden(orden);
  return data;
});

export const editOrden = createAsyncThunk(
  "ordenes/edit",
  async ({ id, ordenData }) => {
    const data = await updateOrden(id, ordenData);
    return data;
  }
);

export const removeOrden = createAsyncThunk("ordenes/remove", async (id) => {
  await deleteOrden(id);
  return id;
});

const ordenesSlice = createSlice({
  name: "ordenes",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdenes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrdenes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchOrdenes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addOrden.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editOrden.fulfilled, (state, action) => {
        const index = state.list.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(removeOrden.fulfilled, (state, action) => {
        state.list = state.list.filter((v) => v.id !== action.payload);
      });
  },
});

export default ordenesSlice.reducer;
