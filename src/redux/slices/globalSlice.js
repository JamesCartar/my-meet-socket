import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createRoom, joinARoom, getRoomData } from '../../services/apiService';
import { getRoomsData } from '../../services/firebaseService';

const initialState = {
  isLoading: false,
  roomId: JSON.parse(localStorage.getItem('roomId')) || null,
  roomData: JSON.parse(localStorage.getItem('roomData')) || null,
  userData: JSON.parse(localStorage.getItem('userData')) || null,
  error: null,
};

const roomSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    emptyError: (state, action) => {
      state.error = null;
    },
    emptyState: (state, action) => {
      state.isLoading = false;
      state.roomId = null;
      state.roomData = null;
      state.userData = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roomId = action.payload.room._id;
        state.roomData = action.payload.room;
        state.userData = action.payload.room.admin;
        state.error = null;
      })
      .addCase(addRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(joinRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(joinRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roomId = action.payload.roomId;
        state.userData = action.payload.user;
        state.roomData = action.payload.room;
        state.error = null;
      })
      .addCase(joinRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getRoom.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRoom.fulfilled, (state, action) => {
        state.isLoading = false;
        state.roomData = action.payload.room;
        state.roomId = JSON.parse(localStorage.getItem('roomId'));
        state.user = JSON.parse(localStorage.getItem('userData'))
        state.error = null;
      })
      .addCase(getRoom.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const addRoom = createAsyncThunk('global/addRoom', async (body, { rejectWithValue }) => {
  try {
    const responseCreateRoom = await createRoom(body);
    if (responseCreateRoom.success === false) {
      // Handle the 400 Bad Request error here
      return rejectWithValue(responseCreateRoom.message);
    }

    const responseRoomData = await getRoomData(responseCreateRoom.roomId);
    localStorage.setItem('roomId', JSON.stringify(responseCreateRoom.roomId));
    localStorage.setItem('userData', JSON.stringify(responseCreateRoom.user));
    localStorage.setItem('roomData', JSON.stringify(responseRoomData.room));
    return responseRoomData;
  } catch (e) {
    // Handle the error and return it using rejectWithValue
    return rejectWithValue(e.message);
  }
});

export const joinRoom = createAsyncThunk('global/joinRoom', async (body, { rejectWithValue }) => {
  const responseJoinRoom = await joinARoom(body);
  if (responseJoinRoom.success === false) {
    // Handle the 400 Bad Request error here
    return rejectWithValue(responseJoinRoom.message);
  }

  const responseRoomData = await getRoomData(responseJoinRoom.roomId);
  localStorage.setItem('roomId', JSON.stringify(responseJoinRoom.roomId));
  localStorage.setItem('userData', JSON.stringify(responseJoinRoom.user));
  localStorage.setItem('roomData', JSON.stringify(responseRoomData.room));

  return { room: responseRoomData.room, user: responseJoinRoom.user, roomId: responseJoinRoom.roomId };
});

export const getRoom = createAsyncThunk('global/getRoom', async (body) => {
  const roomDataresponse = await getRoomData(body);
  localStorage.setItem('roomData', JSON.stringify(roomDataresponse.room));
  console.log('room data: ', roomDataresponse)

  return roomDataresponse;
});
// exporting Actions
export const { emptyError, emptyState } = roomSlice.actions;

export const getGlobalState = (state) => state.global;

export default roomSlice.reducer;
