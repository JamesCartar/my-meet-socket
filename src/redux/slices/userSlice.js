import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUsersData } from '../../services/firebaseService';

const initialState = {
  isLoading: false,
  data: JSON.parse(localStorage.getItem('user')) || null,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  }
});


export const addUser = createAsyncThunk('user/addUser', async (body) => {
  const response = await getUsersData(body);
  localStorage.setItem('user', JSON.stringify(response));
  return response;
});

// export const { addUser } = userSlice.actions;

export const selectUsers = (state) => state.user;

export default userSlice.reducer;
