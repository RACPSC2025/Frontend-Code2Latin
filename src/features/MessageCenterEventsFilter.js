import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Button, Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

// Lazy load the Input component
const InputTextField = lazy(() => import('../components/Input/InputTextField'));
const InputTextAreaField = lazy(() => import('../components/Input/InputTextAreaField'));
const InputSelectField = lazy(() => import('../components/Input/InputSelectField'));
const InputRadioGroup = lazy(() => import('../components/Input/InputRadioGroup'));
const InputDateField = lazy(() => import('../components/Input/InputDateField'));
const InputSignatureField = lazy(() => import('../components/Input/InputSignatureField'));
const InputAutoComplete = lazy(() => import('../components/Input/InputAutoComplete'));
// const FileUploadComponent = lazy(() => import('../components/Input/FileUploadComponent'));

// TODO: Add form validation
// TODO: Add form translation

const fieldComponents = {
  text: InputTextField,
  textarea: InputTextAreaField,
  dropdown: InputSelectField,
  radio: InputRadioGroup,
  datetime: InputDateField,
  date: InputDateField,
  signature: InputSignatureField,
  autocomplete: InputAutoComplete
  //file: FileUploadComponent
};

const MessageCenterEventsFilter = ({
  dropdownData,
  initialValues,
  successCallback,
  clearCallback,
  cancelCallback,
  showActionButton = true,
  controlled = false,
  formFieldSize = 'small',
  onChange = () => {}
}) => {
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const usersData = useSelector((state) => state.globalData.listOfUsers);
  const regionsData = useSelector((state) => state.globalData.regionsList);

  const { t } = useTranslation();

  const formFieldsConfig = [
    {
      id: 'description',
      type: 'text',
      label: t('Description'),
      required: false
    },
    {
      id: 'status',
      type: 'dropdown',
      label: t('Status'),
      options: [
        {
          label: t('InProgress'),
          value: '1'
        },
        {
          label: t('Delayed'),
          value: '2'
        },
        {
          label: t('Pending'),
          value: '3'
        },
        {
          label: t('Completed'),
          value: '4'
        }
      ],
      required: false
    },
    {
      id: 'executioner',
      type: 'dropdown',
      label: t('Executioner'),
      options: usersData.map((user) => {
        return {
          label: user.label,
          value: user.id
        };
      }),
      required: false
    },
    {
      id: 'reviewer',
      type: 'dropdown',
      label: t('Reviewer'),
      options: [
        {
          // TODO: Find an API to get the list of reviewers
          label: 'Reviewer 1',
          value: '1'
        },
        {
          label: 'Reviewer 2',
          value: '2'
        }
      ],
      required: false
    },
    {
      id: 'region',
      type: 'dropdown',
      label: t('Region'),
      options: regionsData.map((region) => {
        return {
          label: region.label,
          value: region.value
        };
      }),
      required: false
    }
  ];

  const inputFields = formFieldsConfig;

  useEffect(() => {
    if (initialValues && !controlled) {
      setFormValues(initialValues);
    }
  }, [initialValues, controlled]);

  const validateField = (field, value) => {
    if (field.required && !value) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field.id]: 'Field is required'
      }));
      return false; // Field is invalid
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field.id]: null
      }));
      return true; // Field is valid
    }
  };

  const handleChange = (id, value) => {
    const field = inputFields.find((f) => f.id === id);
    validateField(field, value);
    if (controlled) onChange(id, value);
    else {
      setFormValues({
        ...formValues,
        [id]: value
      });
    }
  };

  const handleSubmit = () => {
    let isValid = true;
    inputFields.forEach((field) => {
      const value = getFieldValue(field);
      if (!validateField(field, value)) {
        isValid = false;
      }
    });
    if (isValid) {
      successCallback(formValues, resetFormFields);
    }
  };

  const handleClear = () => {
    resetFormFields();
    clearCallback(formValues, resetFormFields);
  };

  const handleCancel = () => {
    // Handle form cancel logic here
    resetFormFields();
    cancelCallback();
  };

  const getFieldValue = (field) =>
    (controlled ? initialValues[field.id] : formValues[field.id]) || defaultFieldValue(field.type);

  const defaultFieldValue = (fieldType) => {
    let defaultValue = '';
    switch (fieldType) {
      case 'autocomplete':
      case 'date':
      case 'datetime':
        defaultValue = null;
        break;
      default:
    }
    return defaultValue;
  };

  const resetFormFields = () => {
    let formValues = {};
    let errors = {};
    if (!controlled) {
      inputFields.forEach((field) => {
        const value = defaultFieldValue(field);
        formValues[field.id] = value;
        errors[field.id] = null;
      });
    }
    setFormValues(formValues);
    setErrors(errors);
    return true;
  };

  return (
    <Box
      component="form"
      sx={{
        display: 'flex',
        width: '96%',
        gap: 2,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexGrow: 1,
        mt: 2,
        mx: 2
      }}
    >
      {inputFields.map((field) => {
        const FieldComponent = fieldComponents[field.type];
        return FieldComponent ? (
          <Grid item xs={parseInt(field.gridSize) || 12} width="100%" key={field.id}>
            <Suspense fallback={<div>{t('loading')}</div>}>
              <FieldComponent
                field={field}
                sx={{ width: '100%', flexGrow: 1 }}
                value={getFieldValue(field)}
                size={formFieldSize}
                error={errors[field.id]}
                onChange={handleChange}
              />
            </Suspense>
          </Grid>
        ) : null;
      })}
      {showActionButton && (
        <Box
          sx={{
            display: 'flex',
            gap: 1
          }}
        >
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            {t('Filter')}
          </Button>
          <Button variant="outlined" color="primary" onClick={handleClear}>
            {t('Clear')}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MessageCenterEventsFilter;
