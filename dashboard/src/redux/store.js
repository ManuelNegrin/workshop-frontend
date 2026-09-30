import { configureStore } from "@reduxjs/toolkit";
import vehiclesReducer from "./slices/vehiclesSlice";
import choferesReducer from "./slices/choferesSlice";
import ordenesReducer from "./slices/ordenesSlice";
import viajesReducer from "./slices/viajesSlice";

export const store = configureStore({
  reducer: {
    vehiculos: vehiclesReducer,
    choferes: choferesReducer,
    ordenes: ordenesReducer,
    viajes: viajesReducer,
  },
  devTools: true,
});

export default store;
