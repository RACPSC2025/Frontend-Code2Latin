import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../lib/axios';

export const fetchTaskTags = createAsyncThunk(
  'taskCreation/fetchTaskTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('tasklist_api/list_tags');
      const data = response.data.data;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


//cambio
const taskDataSlice = createSlice({
  name: 'taskCreation',
  initialState: {
    tags: []
  },
  reducers: {}
});

export default taskDataSlice.reducer;
