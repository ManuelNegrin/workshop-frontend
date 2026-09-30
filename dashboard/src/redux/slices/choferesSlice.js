import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getChoferes,
  createChofer,
  updateChofer,
  deleteChofer,
} from "../../services/choferesService";

export const fetchChoferes = createAsyncThunk("choferes/fetchAll", async () => {
  const data = await getChoferes();
  return data;
});

export const addChofer = createAsyncThunk("choferes/add", async (chofer) => {
  const data = await createChofer(chofer);
  return data;
});

export const editChofer = createAsyncThunk(
  "choferes/edit",
  async ({ id, choferData }) => {
    const data = await updateChofer(id, choferData);
    return data;
  }
);

export const removeChofer = createAsyncThunk("choferes/remove", async (id) => {
  await deleteChofer(id);
  return id;
});

const choferesSlice = createSlice({
  name: "choferes",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChoferes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChoferes.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchChoferes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addChofer.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editChofer.fulfilled, (state, action) => {
        const index = state.list.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(removeChofer.fulfilled, (state, action) => {
        state.list = state.list.filter((v) => v.id !== action.payload);
      });
  },
});

export default choferesSlice.reducer;
