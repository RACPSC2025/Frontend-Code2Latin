import { Add, Close } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Toolbar,
  Typography
} from '@mui/material';
import { clone, isEmpty, isObject } from 'radash';
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BaseFeaturePageLayout from '../components/BaseFeaturePageLayout';
import SpeedDialComponent from '../components/SpeedDialComponent';
import { fetchActionFormFields } from '../stores/actions/fetchActionFormFieldsSlice';
import { fetchActionFormModel } from '../stores/actions/fetchActionFormModelSlice';
import { fetchActionList } from '../stores/actions/fetchActionSlice';
import { fetchTableColumns } from '../stores/actions/fetchTableColumnsSlice';
import { getActionDetails } from '../stores/actions/getActionDetailsSlice';
import { submitActionForm } from '../stores/actions/submitActionFormSlice';
import { selectAppliedFilterModel, selectListOptions } from '../stores/filterSlice';
import { toggleShouldCreateNewAction } from '../stores/globalDataSlice';
import { fetchTaskListLevel } from '../stores/tasks/fetchtaskListLevelSlice';
import { convertString, not, showErrorMsg, showSuccessMsg } from '../utils/others';
import MessageCenterActionViewTable from './MessageCenterActionViewTable';

const MessageCenterActionDetails = lazy(() => import('./MessageCenterActionDetails'));
const MessageCenterActionComments = lazy(() => import('./MessageCenterActionComments'));

const useAppliedFilterModel = (module) =>
  useSelector((state) => selectAppliedFilterModel(state, module));

// Custom hook to get list options
const useListOptions = (module, fieldName) =>
  useSelector((state) => selectListOptions(state, module, fieldName));

export function Component() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const newActionFormModel = useRef(null);

  const [actionFormModel, setActionFormModel] = useState({});
  const [formFields, setFormFields] = useState([]);
  const [formTabItems, setFormTabItems] = useState([]);
  const [tableColumnConfig, setTableColumnConfig] = useState([]);
  const [selectedAction, setSelectedAction] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [viewType, setViewType] = useState(null);
  const [level1Options, setLevel1Options] = useState([]);
  const [level1Selected, setLevel1Selected] = useState('');
  const [level2Options, setLevel2Options] = useState([]);
  const [level2Selected, setLevel2Selected] = useState('');
  const [loadingLevel2, setLoadingLevel2] = useState(true);
  const [level3Options, setLevel3Options] = useState([]);
  const [level3Selected, setLevel3Selected] = useState('');
  const [loadingLevel3, setLoadingLevel3] = useState(true);
  const [level4Options, setLevel4Options] = useState([]);
  const [level4Selected, setLevel4Selected] = useState('');
  const [loadingLevel4, setLoadingLevel4] = useState(true);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);

  const filterData = useAppliedFilterModel('actions');

  const shouldCreateNewAction = useSelector((state) => state?.globalData?.shouldCreateNewAction);
  const actionDetailsLoading = useSelector((state) => state?.getActionDetails?.loading ?? false);
  const { loading: actionListLoading = false, data: actionListData = {} } = useSelector(
    (state) => state?.actionData?.actionList || {}
  );
  const actionList = actionListData?.data || [];

  const actionStatusList = useListOptions('actions', 'filter_status');
  const actionStatus = actionStatusList.reduce((acc, cur) => {
    const { value, ...rest } = cur;
    acc[value] = { value, ...rest };
    return acc;
  }, {});

  const drawerStyleAttrs = {
    view_action: {
      sx: {
        maxWidth: '50vw', // Maximum width on all screens
        width: {
          sm: '50vw', // On 1280px width, make it 35vw
          md: '30vw', // On 1366px width, make it 38vw
          lg: '45vw' // On 1920px width and above, make it 40vw
        }
      }
    },
    view_comment: {
      sx: {
        maxWidth: '50vw', // Maximum width on all screens
        width: {
          lg: '45vw', // On 1280px width and above, make it 35vw,
          xl: '32vw', // On 1366px width, make it 32vw
          xxl: '40vw'
        }
      }
    }
  };

  //const drawerTitle = viewType === 'view_action' ? 'Action Details' : 'Action Comment(s)';
  const drawerTitle = viewType === 'view_action' ? 'Action Details' : 'Comentarios de la acción';

  const flattenFormFields = useMemo(() => {
    const formFieldGroups = Object.keys(formFields);
    return formFieldGroups.reduce((acc, cur) => {
      const fieldMapping = formFields[cur];
      return [...acc, ...Object.keys(fieldMapping).map((fieldKey) => fieldMapping[fieldKey])];
    }, []);
  }, [formFields]);

  const prepareAPIParams = () => {
    const formData = new FormData();

    if (Object.keys(filterData).length > 0) {
      Object.keys(filterData).forEach((filterKey) => {
        formData.append(filterKey, filterData[filterKey]);
      });
    }

    return formData;
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setViewType(null);
    if (shouldCreateNewAction) {
      dispatch(toggleShouldCreateNewAction({ status: false }));
    }
  };

  function handleClearFilters() {
    setLevel1Selected('');
    setLevel2Selected('');
    setLevel3Selected('');
    setLevel4Selected('');
  }

  const handleFetchTaskListLevel = (level, formData) => {
    const optionSetters = {
      1: setLevel1Options,
      2: setLevel2Options,
      3: setLevel3Options,
      4: setLevel4Options
    };
    const loadingSetter = {
      2: setLoadingLevel2,
      3: setLoadingLevel3,
      4: setLoadingLevel4
    };
    loadingSetter[level]?.(true);
    const data = { level, formData };
    dispatch(fetchTaskListLevel(data)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const level1Options = data?.payload?.data.map((item) => ({
          value: item.value,
          label: item.label
        }));

        optionSetters[level]?.(level1Options);
      }
      loadingSetter[level]?.(false);
    });
  };

  const handleFetchActionList = () => {
    const formData = prepareAPIParams();
    dispatch(fetchActionList(formData));
  };

  const handleActionForm = (formData) => {
    dispatch(submitActionForm(formData)).then((data) => {
      if (data?.payload?.status === 1) {
        showSuccessMsg(data?.payload?.messages);
        setTimeout(() => {
          handleFetchActionList();
          handleCloseDrawer();
        }, 3000);
      } else {
        showErrorMsg(data?.payload ?? data?.payload?.messages);
      }
    });
  };

  const handleSubmitActionData = () => {
    if (isObject(selectedAction) || shouldCreateNewAction) {
      const { action_id = '', action_table: module_string_id = 'hs_action' } = selectedAction || {};
      const formData = { ...actionFormModel, action_id, module_string_id };
      handleActionForm(formData);
    }
  };

  const handleUpdateModel = (id, value) => {
    setActionFormModel((prevFormModel) => ({
      ...prevFormModel,
      [id]: value
    }));
    checkDependentFields(id, value);
  };

  const getConfig = (config, isTableColumnConfig = true) => {
    const tableConfigFilterFn = (data) => data.display_in_table;
    const otherConfigFilterFn = not(tableConfigFilterFn);
    return config.filter(isTableColumnConfig ? tableConfigFilterFn : otherConfigFilterFn);
  };

  const modifyTableColumns = (columnConfig) => {
    return columnConfig.map((config) => {
      const { column: field, title: headerName, column_width: width, ...rest } = config;
      return {
        ...rest,
        field,
        headerName,
        width
      };
    });
  };

  const getFormFieldGroup = (fieldID) => {
    const formFieldGroups = Object.keys(formFields);
    const group = formFieldGroups.find((fieldGroup) => {
      const fieldIDs = Object.keys(formFields[fieldGroup]);
      return fieldIDs.includes(fieldID);
    });
    return group;
  };

  const handleClickTableActionButton = (actionData, viewType) => {
    setSelectedAction(actionData);
    setViewType(viewType);
    setDrawerOpen(true);
  };

  const updateCascadingDropdownFormFields = (formModel) => {
    const formFieldGroups = Object.keys(formFields);
    const updatedFormFields = formFieldGroups.reduce((acc, cur) => {
      const fieldMapping = formFields[cur];
      acc[cur] = Object.keys(fieldMapping).reduce((facc, fieldKey) => {
        const field = fieldMapping[fieldKey];
        facc[fieldKey] = getUpdatedCascadingDropdownField(field, formModel);
        return facc;
      }, {});
      return acc;
    }, {});

    setFormFields((formFields) => ({ ...formFields, ...updatedFormFields }));
  };

  const getUpdatedCascadingDropdownField = (field, formModel) => {
    const { api_details = {} } = field;
    const { param_value, ...restDetails } = api_details;

    const isParentValueAvailable =
      Object.prototype.hasOwnProperty.call(api_details, 'parent_element') &&
      formModel[api_details.parent_element];
    if (isParentValueAvailable) {
      return {
        ...field,
        api_details: {
          ...restDetails,
          param_value: isParentValueAvailable
        }
      };
    }

    return {
      ...field,
      api_details: restDetails
    };
  };

  const checkDependentFields = (id, value) => {
    const findFormField = (id) => flattenFormFields.find((field) => field.name === id);

    const formField = findFormField(id);
    const { dependent = [] } = formField || {};

    if (dependent.length) {
      const [firstDependentID] = dependent;
      //Clear the next dependent field
      handleUpdateModel(firstDependentID, null);

      //Also update API details for dependent field
      const dependentFieldDetails = findFormField(firstDependentID);
      const updatedDependentFieldDetails = getUpdatedCascadingDropdownField(dependentFieldDetails, {
        ...actionFormModel,
        [id]: value
      });

      const dependentFieldGroup = getFormFieldGroup(firstDependentID);
      const updatedDependentFieldGroup = {
        ...formFields[dependentFieldGroup],
        [firstDependentID]: updatedDependentFieldDetails
      };
      setFormFields((formFields) => ({
        ...formFields,
        [dependentFieldGroup]: updatedDependentFieldGroup
      }));
    }
  };

  const speedDialActions = [{ icon: <Add />, name: 'Crear Acción' }];

  const filterArray = [
    {
      id: 'level1',
      label: 'Business',
      value: level1Selected,
      handleChange: setLevel1Selected,
      options: level1Options,
      isDisabled: false
    },
    {
      id: 'level2',
      label: 'Company',
      value: level2Selected,
      handleChange: setLevel2Selected,
      options: level2Options,
      isDisabled: loadingLevel2
    },
    {
      id: 'level3',
      label: 'Region',
      value: level3Selected,
      handleChange: setLevel3Selected,
      options: level3Options,
      isDisabled: loadingLevel3
    },
    {
      id: 'level4',
      label: 'Location',
      value: level4Selected,
      handleChange: setLevel4Selected,
      options: level4Options,
      isDisabled: loadingLevel4
    }
  ];

  const handleFetchTableColumns = () => {
    dispatch(fetchTableColumns()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const tableData = data?.payload?.data ?? {};
        const config = Object.keys(tableData?.headers).map(
          (columnKey) => tableData?.headers[columnKey]
        );
        const columnConfig = modifyTableColumns(getConfig(config));
        setTableColumnConfig(columnConfig);
      }
    });
  };

  const handleFetchFormFields = () => {
    dispatch(fetchActionFormFields()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        let rawFormFields = data?.payload?.data;
        const tabItems = Object.keys(rawFormFields).map((fieldGroupKey) => ({
          key: convertString(fieldGroupKey),
          label: fieldGroupKey
        }));

        rawFormFields = Object.keys(rawFormFields).reduce((acc, cur) => {
          const tabItem = tabItems.find((item) => item.label === cur);
          if (tabItem) {
            acc[tabItem.key] = rawFormFields[tabItem.label];
          }
          return acc;
        }, {});

        setFormTabItems(tabItems);
        setFormFields(rawFormFields);
      }
    });
  };

  const handleFetchFormModel = () => {
    dispatch(fetchActionFormModel()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        newActionFormModel.value = data?.payload?.data;
      }
    });
  };

  const handleGetActionDetails = (formData) => {
    dispatch(getActionDetails(formData)).then((data) => {
      if (data?.payload?.status === 1) {
        const rawFormModel = data?.payload?.data;
        updateCascadingDropdownFormFields(rawFormModel);
        setActionFormModel(rawFormModel);
      }
    });
  };

  useEffect(() => {
    handleFetchTableColumns();
    handleFetchFormFields();
    handleFetchFormModel();
  }, [actionStatusList]);

  useEffect(() => {
    handleFetchActionList();
  }, [filterData]);

  useEffect(() => {
    if (isObject(selectedAction) && !isEmpty(selectedAction)) {
      const { id: dashboard_action_id, action_table, action_id } = selectedAction;
      const formData = { dashboard_action_id, action_table, action_id };
      handleGetActionDetails(formData);
    }
  }, [selectedAction]);

  useEffect(() => {
    if (shouldCreateNewAction) {
      setViewType('view_action');
      setDrawerOpen(true);
    }
    setActionFormModel(clone(newActionFormModel.value));
  }, [shouldCreateNewAction]);

  useEffect(() => {
    // Fetch level 1
    handleFetchTaskListLevel(1);
  }, []);

  useEffect(() => {
    // Fetch level 2 if level 1 is selected
    if (level1Selected) {
      setLoadingLevel2(true);
      const level2FormData = new FormData();
      level2FormData.append('id_level1', level1Selected);
      handleFetchTaskListLevel(2, level2FormData);
    }
  }, [level1Selected]);

  useEffect(() => {
    // Fetch level 3 if level 2 is selected
    if (level2Selected) {
      setLoadingLevel3(true);
      const level3FormData = new FormData();
      level3FormData.append('id_level2', level2Selected);
      handleFetchTaskListLevel(3, level3FormData);
    }
  }, [level2Selected]);

  useEffect(() => {
    // Fetch level 4 if level 3 is selected
    if (level3Selected) {
      setLoadingLevel4(true);
      const level4FormData = new FormData();
      level4FormData.append('id_level3', level3Selected);
      handleFetchTaskListLevel(4, level4FormData);
    }
  }, [level3Selected]);

  return (
    <>
      <BaseFeaturePageLayout>
        <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box
            display="flex"
            justifyContent="start"
            gap={1}
            alignItems="center"
            padding="20px"
            bgcolor="white"
          >
            <Box display="flex" justifyContent="start" gap={1} alignItems="center" flexGrow={1}>
              {filterArray?.map((filter, filterIndex) => {
                return (
                  <FormControl sx={{ minWidth: 100 }} size="small" key={filterIndex}>
                    <InputLabel id={filter?.id}>{t(filter?.label)}</InputLabel>
                    <Select
                      labelId={filter?.id}
                      id={filter?.id}
                      value={filter?.value}
                      disabled={filter?.isDisabled}
                      onChange={(e) => filter?.handleChange(e.target.value)}
                    >
                      {filter?.options.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
              })}

              <Button variant="outlined" color="primary" onClick={handleClearFilters}>
                {t('clear_filters')}
              </Button>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, minHeight: 0 }}>
            <MessageCenterActionViewTable
              actions={actionList ?? []}
              actionStatus={actionStatus}
              columnConfig={tableColumnConfig}
              isFetching={actionListLoading}
              onClickTableAction={handleClickTableActionButton}
            />
          </Box>
        </Box>

        {/*  SpeedDial for create action
        <SpeedDialComponent
          openSpeedDial={openSpeedDial}
          handleCloseSpeedDial={() => setOpenSpeedDial(false)}
          handleOpenSpeedDial={() => setOpenSpeedDial(true)}
          speedDialActions={speedDialActions}
          handleClick={() => dispatch(toggleShouldCreateNewAction({ status: true }))}
        />
        */}
        
      </BaseFeaturePageLayout>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleCloseDrawer}
        PaperProps={drawerStyleAttrs[viewType] || {}}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
              {t(drawerTitle)}
            </Typography>
            <IconButton edge="end" onClick={handleCloseDrawer} aria-label="close">
              <Close sx={{ color: 'white' }} />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Suspense fallback={<div>{t('loading')}</div>}>
          {viewType === 'view_comment' ? (
            <MessageCenterActionComments actionDetails={selectedAction} />
          ) : viewType === 'view_action' ? (
            <MessageCenterActionDetails
              isFetching={actionDetailsLoading}
              formFields={formFields}
              formTabItems={formTabItems}
              formModel={actionFormModel}
              onUpdateModel={handleUpdateModel}
              onSubmit={handleSubmitActionData}
              onCancel={handleCloseDrawer}
            />
          ) : (
            ''
          )}
        </Suspense>
      </Drawer>
    </>
  );
}

Component.displayName = 'MessageCenterActions';
export default Component;
