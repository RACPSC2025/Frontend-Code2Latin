// features/globalDataSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axiosInstance from '../lib/axios';
import { normalizeTimestamp } from '../utils/dateTimeFunctions';

// Async thunk for fetching user details
/*
export const fetchUserDetails = createAsyncThunk(
  'globalData/fetchUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/getUserDetails');
      const data = response.data.data;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
*/

/*
export const fetchUserDetails = createAsyncThunk(
  'globalData/fetchUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/tasklist_api/getUserDetails', {
        headers: {
          //'Auth-Token': localStorage.getItem('token') // o tu método de obtener token
          'Auth-Token': '$2y$10$HYG/Oj2NUm2wKLquLxct7.CBHw4.B2p3Hs67vimGaWZldraKmwcSa'
        }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
*/

export const fetchUserDetails = createAsyncThunk(
  'globalData/fetchUserDetails',
  async (_, { rejectWithValue }) => {
    try {
      // Simulación de respuesta
      const mockResponse = {
        status: 200,
        message: "Authorized.",
        token: "$2y$10$HYG/Oj2NUm2wKLquLxct7.CBHw4.B2p3Hs67vimGaWZldraKmwcSa",
        data: {
          id_administradores: "1",
          fullname: "Noel"
        }
      };
      
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Retornar solo la data como haría el API real
      return mockResponse.data;
      
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching list of users
export const fetchListOfUsers = createAsyncThunk(
  'globalData/fetchListOfUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/list_administradores');
      const data = response.data.data;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRegions = createAsyncThunk(
  'globalData/fetchRegions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/tasklist_api/list_level1');
      const data = response.data.data;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//Async thunk for checking new messages
export const fetchNewMessageCount = createAsyncThunk(
  'globalData/fetchNewMessageCount',
  async (timestamp, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('timestamp', normalizeTimestamp(timestamp));

      const response = await axiosInstance.post('/tasklist_api/check_new_message_counts', formData);
      const data = response.data.data;
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const globalDataSlice = createSlice({
  name: 'globalData',
  initialState: {
    userDetails: {},
    listOfUsers: [],
    regionsList: [],
    newMessageCount: 0,
    activeModule: null,
    loading: false,
    error: null,
    shouldCreateNewAction: false
  },
  reducers: {
    setActiveModule: (state, action) => {
      const { module } = action.payload;
      if (module) state.activeModule = module;
    },
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    toggleShouldCreateNewAction: (state, action) => {
      const { status } = action.payload;
      state.shouldCreateNewAction = status;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchListOfUsers.fulfilled, (state, action) => {
        state.listOfUsers = action.payload;
      })
      .addCase(fetchRegions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRegions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.regionsList = action.payload;
      })
      .addCase(fetchNewMessageCount.fulfilled, (state, action) => {
        state.newMessageCount = action.payload;
      });
  }
});

export const { setActiveModule, setUserDetails, toggleShouldCreateNewAction } = globalDataSlice.actions;

export default globalDataSlice.reducer;
