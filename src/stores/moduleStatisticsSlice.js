import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  actions: {
    loading: false,
    data: null,
    error: null
  },
  tasks: {
    loading: false,
    data: null,
    error: null
  },
  legals: {
    loading: false,
    data: null,
    error: null
  }
};

const moduleStatisticsSlice = createSlice({
  name: 'moduleStatistics',
  initialState,
  reducers: {
    setModuleData: (state, action) => {
      const { moduleId, data, loading = false, error = null } = action.payload;
      state[moduleId] = { data, loading, error };
    },
    setModuleLoading: (state, action) => {
      const { moduleId, loading } = action.payload;
      if (state[moduleId]) {
        state[moduleId].loading = loading;
      }
    },
    setModuleError: (state, action) => {
      const { moduleId, error } = action.payload;
      if (state[moduleId]) {
        state[moduleId].error = error;
        state[moduleId].loading = false;
      }
    },
    resetModuleData: (state, action) => {
      const moduleId = action.payload;
      if (moduleId) {
        state[moduleId] = initialState[moduleId];
      } else {
        // Reset all modules if no specific moduleId provided
        Object.keys(state).forEach((key) => {
          state[key] = initialState[key];
        });
      }
    }
  }
});

export const { setModuleData, setModuleLoading, setModuleError, resetModuleData } =
  moduleStatisticsSlice.actions;

export default moduleStatisticsSlice.reducer;
