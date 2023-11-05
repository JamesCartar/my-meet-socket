import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './slices/globalSlice';
import userReducer from './slices/userSlice';


export const store = configureStore({
  reducer: {
    global: roomReducer,
    user: userReducer,
    // Add userReducer here if needed for authentication
  },
});

export default store;
