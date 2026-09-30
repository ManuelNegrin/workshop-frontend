import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getvehiculos,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../../services/vehiclesService";

export const fetchVehiculos = createAsyncThunk(
  "vehiculos/fetchAll",
  async () => {
    const data = await getvehiculos();
    return data;
  }
);

export const addVehicle = createAsyncThunk("vehiculos/add", async (vehicle) => {
  const data = await createVehicle(vehicle);
  return data;
});

export const editVehicle = createAsyncThunk(
  "vehiculos/edit",
  async ({ id, vehicleData }) => {
    const data = await updateVehicle(id, vehicleData);
    return data;
  }
);

export const removeVehicle = createAsyncThunk(
  "vehiculos/remove",
  async (id) => {
    await deleteVehicle(id);
    return id;
  }
);

const vehiculosSlice = createSlice({
  name: "vehiculos",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehiculos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVehiculos.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchVehiculos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addVehicle.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(editVehicle.fulfilled, (state, action) => {
        const index = state.list.findIndex((v) => v.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(removeVehicle.fulfilled, (state, action) => {
        state.list = state.list.filter((v) => v.id !== action.payload);
      });
  },
});

export default vehiculosSlice.reducer;
