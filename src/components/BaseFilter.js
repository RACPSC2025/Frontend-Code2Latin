import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, IconButton, InputAdornment, Typography } from '@mui/material';
import { isEmpty } from 'radash';
import { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { filterConfigs } from '../config/filterConfig';
import {
  fetchAutocompleteOptions,
  removeAllFilters,
  removeFilter,
  selectFilterItemValue,
  selectListOptions,
  setFilter
} from '../stores/filterSlice';
import DebouncedTextField from './DebouncedTextField';
import { InputAutoComplete, InputDateRangePicker } from './Input';

// Custom hook to get list options
const useListOptions = (module, fieldName) =>
  useSelector((state) => selectListOptions(state, module, fieldName));

const useListOptionsGlobal = (fieldName) =>
  useSelector((state) => state.globalData?.[fieldName] ?? []);

const useFilterItemValue = (module, fieldName) =>
  useSelector((state) => selectFilterItemValue(state, module, fieldName));

/*
useEffect(() => {
  if (selectedTaskView != undefined){
    if (component === 'events') {
      config = filterConfigs[component+'_'+selectedTaskView];
      component = component+'_'+selectedTaskView;
    }
    else {
      config = filterConfigs[component];
    }
    console.log('config', config);
    console.log('component', component);
    console.log('selectedTaskView', selectedTaskView);
  }    
}, [selectedTaskView, component]); // Se ejecuta cuando cambian las variables de los filtros
*/

function BaseFilter({ component = '' }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const selectedTaskView = useSelector((state) =>
    selectFilterItemValue(state, 'task', 'selectedTaskView')
  );

  const config = filterConfigs[component];

  const groupedFilterItems = useMemo(() => {
    if (!config) return {};

    const updatedConfig = config.reduce((acc, cur) => {
      const { group_by_key, group_by_label, name, ...rest } = cur;

      // 👇 Excluir si es el dateRangeField en events/list
      if (
        component === 'events' &&
        selectedTaskView === 'list' &&
        Array.isArray(name) &&
        name.includes('filter_start_date') &&
        name.includes('filter_end_date')
      ) {
        return acc;
      }

      const item = { name, ...rest };

      let group = acc[group_by_key];
      if (!group) {
        group = {
          label: t(group_by_label),
          items: [item]
        };
      } else {
        group.items.push(item);
      }

      acc[group_by_key] = group;
      return acc;
    }, {});

    return updatedConfig;
  }, [component, selectedTaskView, t]);

  /*
  const groupedFilterItems = useMemo(() => {
    const config = filterConfigs[component];

    if (!config) return {};

    const updatedConfig = config.reduce((acc, cur) => {
      const { group_by_key, group_by_label, ...rest } = cur;
      let group = acc[group_by_key];

      if (!group) {
        group = {
          label: t(group_by_label),
          items: [rest]
        };
      } else {
        group.items.push(rest);
      }

      acc[group_by_key] = group;
      return acc;
    }, {});

    return updatedConfig;
  }, [component, t]);
  */

  /*
  useEffect(() => {
    handleFetchEventList();
  }, [filterData]);
  */
  const getFilterItemKey = (key) => {
    if (Array.prototype.isPrototypeOf(key)) return key.join('#');
    else return key;
  };

  const clearAllFilters = () => {
    const payload = { module: component };
    dispatch(removeAllFilters(payload));
  };

  return (
    <>
      {Object.keys(groupedFilterItems).map((groupKey, idx) => {
        return (
          <Box key={`{groupKey}_${idx}`} sx={{ mt: idx > 0 ? 3 : 0 }}>
            <Typography variant="caption" display="block" gutterBottom>
              {groupedFilterItems[groupKey].label}
            </Typography>
            {groupedFilterItems[groupKey].items.map((item, index) => {
              return (
                <BaseFilterItem
                  key={`${component}_${getFilterItemKey(item.name)}_${index}`}
                  {...item}
                  module={component}
                  type={item.type}
                  label={t(item.labelKey) ? t(item.labelKey) : null}
                  id={getFilterItemKey(item.name)}
                  gutterBottom={index < groupedFilterItems[groupKey].items.length - 1}
                />
              );
            })}
          </Box>
        );
      })}
      <Button variant="contained" sx={{ mt: 2, width: '100%' }} onClick={clearAllFilters}>
        {t('ClearFilters')}
      </Button>
    </>
  );
}

function BaseFilterItem({ module, type, label, id, gutterBottom = false, ...rest }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let filterItem = null;
  label = t(label) ? t(label) : null;

  const shouldFetchList = useRef(false);

  const {
    fieldStyle = {},
    fieldAttrs = {},
    options = [],
    storageType = null,
    storageKey = null,
    api_details = {},
    modifierFn,
    level
  } = rest;

  const updatedStyle = { ...fieldStyle, mb: gutterBottom ? 2 : 0 };

  const handleFetchOptionList = (apiParams) => {
    let params = {
      api_url: api_details.api_url,
      module, // This is your module name e.g., 'notifications'
      fieldName: id, // This is the specific field name e.g., 'filter_status',
      ...apiParams
    };

    if (Function.prototype.isPrototypeOf(modifierFn)) {
      params['modifierFn'] = modifierFn;
    }
    dispatch(fetchAutocompleteOptions(params));
  };

  useEffect(() => {
    if (shouldFetchList.current) {
      handleFetchOptionList();
    }
  }, [shouldFetchList]);

  let updatedOptions = [];
  if (type === 'autocomplete') {
    if (options.length > 0) {
      updatedOptions = options;
    } else if (options.length === 0 && storageType === 'global' && storageKey) {
      updatedOptions = useListOptionsGlobal(storageKey);
    } else {
      updatedOptions = useListOptions(module, id);
      if (updatedOptions.length === 0) {
        shouldFetchList.current = true;
      }
    }
  }

  if (type === 'autocompleteWithoutLevel') {
    if (options.length > 0) {
      updatedOptions = options;
    } else if (options.length === 0 && storageType === 'global' && storageKey) {
      updatedOptions = useListOptionsGlobal(storageKey);
    } else {
      updatedOptions = useListOptions(module, id);
      if (updatedOptions.length === 0) {
        shouldFetchList.current = true;
      }
    }
  }

  // const handleChangeFilterItemValue = (value, level) => {
  //   const apiUrl = `/tasklist_api/tasklist_api/get_level${level + 1}`;
  //   const formData = new FormData();
  //   formData.append(`id_level${level}`, value);

  //   const params = {
  //     api_url: apiUrl,
  //     fieldName: id,
  //     formData: formData
  //   };

  //   if (isValidValue(value)) {
  //     handleSetFilterItemValue(value);
  //     handleFetchOptionList(params);
  //   } else {
  //     handleClearFilterItemValue();
  //   }
  // };

  // const handleChangeFilterItemValueWithoutLevel = (value, id) => {
  //   dispatch(setFilter(module, id, value));
  //   handleSetFilterItemValue(value);
  // };

  // const handleChangeItemValue = (value, id) => {
  //   dispatch(setFilter(module, id, value));
  //   handleSetFilterItemValue(value);
  // };

  const handleClearFilterItemValue = (specificFieldID = null) => {
    if (!specificFieldID) {
      return;
    }

    let formFieldIDs = [];

    // If a specific field ID is provided, only clear that field
    if (specificFieldID.includes('#')) {
      // Handle date-range fields
      const [startDateKey, endDateKey] = specificFieldID.split('#');
      formFieldIDs.push(startDateKey);
      formFieldIDs.push(endDateKey);
    } else {
      formFieldIDs.push(specificFieldID);
    }

    formFieldIDs.forEach((fieldID) => {
      dispatch(removeFilter({ module, fieldID }));
    });
  };

  const handleSetFilterItemValue = (value) => {
    // If value is null or empty, clear the filter
    
    let payload = { module };

    if (
      value === null ||
      value === undefined ||
      (Array.isArray(value) && value.every((item) => item === null))
    ) {
      handleClearFilterItemValue(id);
      return;
    }

    if (type !== 'date-range') {
      const updatedFilterItemValue = { [id]: value };
      payload = { ...payload, updatedFilter: updatedFilterItemValue };
    } else {
      const [startDate, endDate] = value;
      const [startDateKey, endDateKey] = id.split('#');
      const updatedDateRangeValue = {
        [startDateKey]: startDate,
        [endDateKey]: endDate
      };
      payload = { ...payload, updatedFilter: updatedDateRangeValue };
    }

    dispatch(setFilter(payload));
  };

  const handleChangeFilterItemValue = (value, level) => {
    if (level == undefined) {
      level = 0;
    }
    const nextLevel = level + 1;
    //const nextFieldConfig = filterConfigs.legalMatrix.find((config) => config.level === nextLevel);
    const nextFieldConfig = filterConfigs[module]?.find((config) => config.level === nextLevel);

    if (!nextFieldConfig) {
      console.error(`No configuration found for level ${nextLevel}`);
      return;
    }

    const nextFieldId = nextFieldConfig.name; // Get the ID for Level 2 (e.g., "filter_company")
    const apiUrl = `/tasklist_api/tasklist_api/get_level${nextLevel}`;
    const formData = new FormData();
    formData.append(`id_level${level}`, value);

    const params = {
      api_url: apiUrl,
      fieldName: nextFieldId, // Use the ID for Level 2
      formData: formData
    };

    if (isValidValue(value)) {
      handleSetFilterItemValue(value); // Set the value for the current field
      handleFetchOptionList(params); // Fetch options for the dependent field (Level 2)
    } else {
      handleClearFilterItemValue(nextFieldId); // Clear the dependent field if invalid
    }
  };

  const isValidValue = (value) => {
    let isValid = false;

    switch (type) {
      case 'date-range':
        isValid = value.every((datePart) => datePart !== null);
        break;

      default:
        isValid = !isEmpty(value);
    }

    return isValid;
  };

  const getDefaultFilterItemValue = (itemType) => {
    let value;
    switch (itemType) {
      case 'text-search-field':
        value = '';
        break;
      case 'date-range':
        value = [null, null];
        break;
      default:
        value = null;
    }
    return value;
  };

  let value;
  if (type === 'date-range') {
    const [startDateKey, endDateKey] = id.split('#');
    const dateRanges = [
      useFilterItemValue(module, startDateKey),
      useFilterItemValue(module, endDateKey)
    ];
    if (dateRanges.every((datePart) => !datePart)) {
      value = getDefaultFilterItemValue(type);
    } else {
      value = dateRanges;
    }
  } else {
    value = useFilterItemValue(module, id) || getDefaultFilterItemValue(type);
  }

  switch (type) {
    case 'text-search-field':
      filterItem = (
        <DebouncedTextField
          field={{ id }}
          variant="outlined"
          size="small"
          autoComplete="off"
          value={value}
          onChange={(_, value) => handleSetFilterItemValue(value)}
          placeholder={t(label)}
          sx={updatedStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <IconButton sx={{ padding: '10px', cursor: 'text' }}>
                  <SearchIcon sx={{ color: 'white' }} />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      );
      break;
    case 'autocomplete':
      filterItem = (
        <InputAutoComplete
          field={{ id, options: updatedOptions, label }}
          value={value}
          onChange={(_, value) => handleChangeFilterItemValue(value, level)}
          sx={updatedStyle}
        />
      );
      break;
    case 'autocompleteWithoutLevel':
      filterItem = (
        <InputAutoComplete
          field={{ id, options: updatedOptions, label: t(label) }}
          value={value}
          onChange={(_, value) => handleSetFilterItemValue(value)}
          sx={updatedStyle}
        />
      );
      break;
    case 'date-range':
      filterItem = (
        <InputDateRangePicker
          field={{ id }}
          value={value}
          {...fieldAttrs}
          onChange={(_, value) => handleSetFilterItemValue(value)}
        />
      );
      break;
    default:
  }

  return filterItem;
}

export default BaseFilter;
