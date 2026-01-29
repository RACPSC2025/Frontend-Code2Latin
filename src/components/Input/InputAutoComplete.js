import { Autocomplete, CircularProgress, TextField } from '@mui/material';
import { isEmpty, isEqual, isObject, isString } from 'radash';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../../lib/axios';
import BaseFormControl from '../BaseFormControl';

const InputAutoComplete = ({ field, value, onChange, error, size = 'small', ...rest }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const prevApiDetailsRef = useRef();

  const fieldID = `${field.id}-select`;

  const checkAPICallRequirements = (api_details) => {
    const isValidAPIURLAvailable = isObject(api_details) && typeof api_details.api_url === 'string';
    if (isValidAPIURLAvailable && !Object.prototype.hasOwnProperty.call(api_details, 'param_key')) {
      return true;
    }

    const isValidAPIParamAvailable =
      isObject(api_details) &&
      typeof api_details.param_key === 'string' &&
      typeof api_details.param_value === 'string';

    return isValidAPIURLAvailable && isValidAPIParamAvailable;
  };

  const getOptionsList = async (apiDetails) => {
    try {
      setLoading(true);
      const { api_url, param_key, param_value } = apiDetails;

      const formData = new FormData();
      if (param_key && param_value) formData.append(param_key, param_value);

      const response = await axiosInstance.post(api_url, formData);
      if (!(isEmpty(options) && isEmpty(response.data.data))) setOptions(response.data.data);
    } catch (error) {
      console.error('[Error] fetching options from API', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSelection = (e, newValue) => {
    if (Object.prototype.isPrototypeOf(newValue)) onChange(field.id, newValue.value);
    else onChange(field.id, newValue);
  };

  const isOptionItemTypeObject = useMemo(() => {
    if (options.length > 0) {
      return options.some((opt) => isObject(opt));
    }
    return false;
  }, [options]);

  const internalValue = useMemo(() => {
    if (isOptionItemTypeObject && isString(value)) {
      const selectedOption = options.find((opt) => opt.value === value);
      if (typeof selectedOption === 'undefined') return null;
      else return selectedOption;
    }
    return value;
  }, [value, options, isOptionItemTypeObject]);

  useEffect(() => {
    let active = true;
    const shouldFetch = (open || value) && options.length === 0;

    if (!shouldFetch) return undefined;

    const { api_details = {}, options: fieldOptions = [] } = field;
    const shouldFetchOptionsFromAPI = checkAPICallRequirements(api_details);

    if (active) {
      if (shouldFetchOptionsFromAPI) {
        // Fetch options from API, optionally pass the current value
        getOptionsList(api_details);
      } else if (fieldOptions.length) {
        setOptions(fieldOptions);
      }
    }

    return () => {
      active = false;
    };
  }, [open, value, options]);

  useEffect(() => {
    const currentApiDetails = field.api_details;
    const prevApiDetails = prevApiDetailsRef.current;
    if (isObject(currentApiDetails) && !isObject(prevApiDetails)) {
      // Update the ref to the current value
      prevApiDetailsRef.current = currentApiDetails;
    } else if (
      isObject(currentApiDetails) &&
      isObject(prevApiDetails) &&
      !isEqual(currentApiDetails, prevApiDetails)
    ) {
      // Update the ref to the current value
      prevApiDetailsRef.current = currentApiDetails;
      //clear the options
      setOptions([]);
    }
  }, [field.api_details]);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  const isEnabled = useMemo(() => {
    const { api_details = {}, options: fieldOptions } = field;
    return fieldOptions.length > 0 || checkAPICallRequirements(api_details);
  }, [field]);

  return (
    <BaseFormControl field={field} value={value} error={error} {...rest}>
      <Autocomplete
        id={fieldID}
        disabled={!isEnabled}
        size={size}
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        getOptionKey={(option) => option.value}
        value={internalValue}
        onChange={handleChangeSelection}
        options={options}
        getOptionLabel={(option) => t(option.label)} // Aquí se traduce el label
        loading={loading}
        renderInput={(params) => (
          <TextField
            // sx={{}}
            {...params}
            label={t(field.label)}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              )
            }}
          />
        )}
      />
    </BaseFormControl>
  );
};

export default InputAutoComplete;
