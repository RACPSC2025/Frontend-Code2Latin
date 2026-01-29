import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';

import axiosInstance from '../lib/axios';

const initialStateStatus = {
  value: '-1' // Initial estatus
};

export const selectedStatus = createSlice({
  name: 'selectedStatus',
  initialStateStatus,
  reducers: {
    setSelectedStatus: (state, action) => {
      state.value = action.payload;
    }
  }
});

export const { setSelectedStatus } = selectedStatus.actions;
//export statusSlice.reducer;

const initialSelectedColumns = {
  value: 'false'
};
export const selectedColumns = createSlice({
  name: 'selectedColumns',
  initialSelectedColumns,
  reducers: {
    setSelectedColumns: (state, action) => {
      state.value = action.payload;
    }
  }
});

const initiallogTaskSelected = {
  value: {}
};
export const logTaskSelected = createSlice({
  name: 'logTaskSelected',
  initiallogTaskSelected,
  reducers: {
    setLogTaskSelected: (state, action) => {
      state.value = action.payload;
    }
  }
});
export const { setLogTaskSelected } = logTaskSelected.actions;

const initialIsTaskSelected = {
  value: 'false'
};
export const isTaskSelected = createSlice({
  name: 'isTaskSelected',
  initialIsTaskSelected,
  reducers: {
    setIsTaskSelected: (state, action) => {
      state.value = action.payload;
    }
  }
});
export const { setIsTaskSelected } = isTaskSelected.actions;

const viewTabArray = ['dashboard', 'calendar', 'list', 'table', 'report', 'adjustments']; // Add more views as needed
const initialTaskView = {
  value: 'calendar'
};
export const selectedTaskView = createSlice({
  name: 'selectedTaskView',
  initialTaskView,
  reducers: {
    setSelectedTaskView: (state, action) => {
      state.value = action.payload;
    }
  }
});
export const { setSelectedTaskView } = selectedTaskView.actions;

const initialState = {
  modules: {
    notifications: {
      filterData: {}, // filters specific to notifications
      listData: {} // dropdown lists for notifications
    },
    actions: {
      filterData: {}, // filters specific to actions
      listData: {} // dropdown lists for actions
    },
    events: {
      filterData: {}, // filters specific to events
      listData: {} // dropdown lists for events
    },
    events_table: {
      filterData: {}, // filters specific to events
      listData: {} // dropdown lists for events
    },
    events_list: {
      filterData: {}, // filters specific to events
      listData: {} // dropdown lists for events
    },
    legalMatrix: {
      filterData: {}, // filters specific to legalMatrix
      listData: {} // dropdown lists for legalMatrix
    },
    task: {
      filterData: {}, // filters specific to task
      listData: {} // dropdown lists for task
    }
    // more modules can be added here
  }
};

// Create a stable empty array reference
const EMPTY_ARRAY = Object.freeze([]);

// Selector to get list options based on module and fieldName
export const selectListOptions = createSelector(
  [(state) => state.filter.modules, (_s, module) => module, (_s, _m, fieldName) => fieldName],
  (modules, module, fieldName) => {
    const data = modules[module]?.listData[fieldName];
    return data || EMPTY_ARRAY; // Returns stable reference when empty
  }
);

// Selector to get filter value based on module and fieldName
export const selectFilterItemValue = createSelector(
  [(state) => state.filter.modules, (_s, module) => module, (_s, _m, filterItem) => filterItem],
  (modules, module, filterItem) => {
    const data = modules[module]?.filterData[filterItem];
    return data ?? null; // Returns stable null reference when undefined
  }
);

export const updateFilterValue = (module, filterItem, value) => ({
  type: 'UPDATE_FILTER_VALUE',
  payload: { module, filterItem, value }
});

// Selector to get applied filter model based on module
export const selectAppliedFilterModel = createSelector(
  [(state) => state.filter.modules, (_s, module) => module],
  (modules, module) => {
    return modules[module]?.filterData ?? {};
  }
);

// Async thunk for fetching autocomplete options
export const fetchAutocompleteOptions = createAsyncThunk(
  'filter/fetchAutocompleteOptions',
  async ({ api_url, module, fieldName, modifierFn, formData }) => {
    const response = await axiosInstance.post(api_url, formData);

    let data = response.data.data;
    if (Function.prototype.isPrototypeOf(modifierFn)) {
      data = modifierFn(data);
    }

    return { data, module, fieldName }; // Return data along with module and fieldName for reference
  }
);

const filterSlice = createSlice({
  name: 'filter',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      const { module, updatedFilter = {} } = action.payload;
      if (state.modules[module]) {
        state.modules[module].filterData = {
          ...state.modules[module].filterData,
          ...updatedFilter
        };
      }
    },
    removeFilter: (state, action) => {
      const { module, fieldID } = action.payload;
      if (state.modules[module]) {
        const { filterData } = state.modules[module];
        const { [fieldID]: removedFilter, ...restFilters } = filterData;
        state.modules[module].filterData = restFilters;
      }
    },
    removeAllFilters: (state, action) => {
      const { module } = action.payload;
      if (state.modules[module]) {
        state.modules[module].filterData = {};
      }
    },
    setListData: (state, action) => {
      const { module, listType, data } = action.payload;
      if (state.modules[module]) {
        state.modules[module].listData[listType] = data;
      }
    },
    // Reducer adicional para agregar un filtro (como ejemplo)
    addFilter: (state, action) => {
      const { module, fieldID, value } = action.payload;
      if (state.modules[module]) {
        state.modules[module].filterData[fieldID] = value;
      }
    }
    // Other reducers...
  },
  // Async thunks and extraReducers...
  extraReducers: (builder) => {
    builder.addCase(fetchAutocompleteOptions.fulfilled, (state, action) => {
      const { module, fieldName, data } = action.payload;
      if (!state.modules[module].listData[fieldName]) {
        state.modules[module].listData[fieldName] = [];
      }
      state.modules[module].listData[fieldName] = data;
    });
  }
});

export const { setFilter, removeFilter, removeAllFilters, setListData, addFilter } =
  filterSlice.actions;

export default filterSlice.reducer;
