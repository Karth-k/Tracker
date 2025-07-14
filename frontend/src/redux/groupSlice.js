import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const fetchGroups = createAsyncThunk('groups/fetch', async () => {
  const res = await axios.get('http://localhost:5000/api/groups');
  return res.data;
});


export const joinGroup = createAsyncThunk('groups/join', async ({ groupId, token }) => {
  const res = await axios.post(`http://localhost:5000/api/groups/join/${groupId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return { groupId, message: res.data.message };
});

export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async ({ name, token }, thunkAPI) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post('http://localhost:5000/api/groups/create', { name }, config);
      return response.data.group;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create group');
    }
  }
);

const groupSlice = createSlice({
  name: 'groups',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
    joinedGroups: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
         .addCase(fetchGroups.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(joinGroup.fulfilled, (state, action) => {
        state.joinedGroups.push(action.payload.groupId);
      })
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.list.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default groupSlice.reducer;
