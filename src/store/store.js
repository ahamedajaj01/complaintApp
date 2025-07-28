import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../appFeatures/authSlice";
import complaintReducer from "../appFeatures/complainSlice";

const store = configureStore({
  reducer: {
    // Add reducers here
    auth: authReducer,
    complaint: complaintReducer,
    
  },
});

export default store;
