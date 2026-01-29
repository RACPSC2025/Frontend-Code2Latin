import { Add } from '@mui/icons-material';
import { Box, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { clone, isEmpty, isObject } from 'radash';
import { lazy, useEffect, useMemo, useRef, useState } from 'react';
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
import { convertString, isValidArray, not } from '../utils/others';
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
  const [isLoading, setIsLoading] = useState(true);
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
  const actionStatusList = useListOptions('actions', 'filter_status');
  const listLevelLoading = useSelector((state) => state?.fetchTaskListLevel?.loading ?? false);
  const shouldCreateNewAction = useSelector((state) => state.globalData.shouldCreateNewAction);
  const { loading: actionListLoading = false, data: actionListData = {} } = useSelector(
    (state) => state?.actionData?.actionList || {}
  );
  const actions = actionListData?.data || [];
  const actionDetailLoading = useSelector((state) => state?.getActionDetails?.loading ?? false);

  const handleOpenSpeedDial = () => setOpenSpeedDial(true);
  const handleCloseSpeedDial = () => setOpenSpeedDial(false);

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
        const list = data?.payload?.data ?? [];
        const levelOptions = list.map((item) => ({
          value: item.value,
          label: item.label
        }));

        optionSetters[level]?.(levelOptions);
      }
      loadingSetter[level]?.(false);
    });
  };

  function handleLimpiarFiltrosGeo() {
    setLevel1Selected('');
    setLevel2Selected('');
    setLevel3Selected('');
    setLevel4Selected('');
  }

  const actionStatus = actionStatusList.reduce((acc, cur) => {
    const { value, ...rest } = cur;
    acc[value] = { value, ...rest };
    return acc;
  }, {});

  const drawerStyleAttrs = {
    view_finding: {
      sx: {
        maxWidth: '600px', // Maximum width on all screens
        width: {
          sm: '50vw', // On 1280px width, make it 35vw
          md: '30vw', // On 1366px width, make it 38vw
          lg: '600px' // On 1920px width and above, make it 40vw
        }
      }
    },
    view_comment: {
      sx: {
        maxWidth: '500px', // Maximum width on all screens
        width: {
          lg: '35vw', // On 1280px width and above, make it 35vw,
          xl: '32vw', // On 1366px width, make it 32vw
          xxl: '500px'
        }
      }
    }
  };
  // TODO: Translate this
  const drawerTitle = viewType === 'view_finding' ? 'Findings Details' : 'Findings Comment(s)';

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

  const handleFetchActions = () => {
    const formData = prepareAPIParams();
    dispatch(fetchActionList(formData));
  };

  const handleSubmitActionForm = (callbackFn) => {
    if (isObject(selectedAction) || shouldCreateNewAction) {
      const { action_id = '', action_table: module_string_id = 'hs_action' } = selectedAction || {};
      const formData = { ...actionFormModel, action_id, module_string_id };
      dispatch(submitActionForm(formData)).then((data) => {
        if (data?.payload?.messages === 'Success') {
          callbackFn();
        }
        setTimeout(() => {
          handleCloseDrawer();
          handleFetchActions();
        }, 3000);
      });
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

  const closeDrawer = () => {
    setDrawerOpen(false);
    setViewType(null);
    if (shouldCreateNewAction) {
      dispatch(toggleShouldCreateNewAction({ status: false }));
    }
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

  const levelFilteringFormData = [
    {
      id: 'level_1',
      label: 'Negocio',
      type: 'autocomplete',
      default_value: '',
      options: [
        { value: '1', label: 'Negocio 1' },
        { value: '2', label: 'Negocio 2' },
        { value: '3', label: 'Negocio 3' }
      ]
    },
    {
      id: 'level_2',
      label: 'Compañía',
      type: 'autocomplete',
      default_value: '',
      options: [
        { value: '1', label: 'Compañía 1' },
        { value: '2', label: 'Compañía 2' },
        { value: '3', label: 'Compañía 3' }
      ]
    },
    {
      id: 'level_3',
      label: 'Región',
      type: 'autocomplete',
      default_value: '',
      options: [
        { value: '1', label: 'Región 1' },
        { value: '2', label: 'Región 2' },
        { value: '3', label: 'Región 3' }
      ]
    },
    {
      id: 'level_4',
      label: 'Localidad',
      type: 'autocomplete',
      default_value: '',
      options: [
        { value: '1', label: 'Localidad 1' },
        { value: '2', label: 'Localidad 2' },
        { value: '3', label: 'Localidad 3' }
      ]
    }
  ];

  // const ViewComponent = isTableView ? MessageCenterActionViewTable : MessageCenterActionViewMailBox;

  let actionAdditionalView = null;
  if (viewType === 'view_comment') {
    actionAdditionalView = <MessageCenterActionComments actionDetails={selectedAction} />;
  } else if (viewType === 'view_finding') {
    actionAdditionalView = (
      <MessageCenterActionDetails
        isFetching={actionDetailLoading}
        formFields={formFields}
        formTabItems={formTabItems}
        formModel={actionFormModel}
        onUpdateModel={handleUpdateModel}
        onSubmit={handleSubmitActionForm}
        onCancel={closeDrawer}
      />
    );
  }

  const speedDialActions = [{ icon: <Add />, name: 'Crear Acción' }];

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

  const handleFetchActionFormFields = () => {
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

  const handleActionFormModel = () => {
    dispatch(fetchActionFormModel()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        newActionFormModel.value = data?.payload?.data;
      }
    });
  };

  const handleGetActionDetails = () => {
    const { id: dashboard_action_id, action_table, action_id } = selectedAction;
    const formData = { dashboard_action_id, action_table, action_id };
    dispatch(getActionDetails(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const rawFormModel = data?.payload?.data;
        updateCascadingDropdownFormFields(rawFormModel);
        setActionFormModel(rawFormModel);
      }
    });
  };

  useEffect(() => {
    handleFetchTaskListLevel(1);
  }, []);

  useEffect(() => {
    if (level1Selected) {
      const level2FormData = new FormData();
      level2FormData.append('id_level1', level1Selected);
      handleFetchTaskListLevel(2, level2FormData);
    }
  }, [level1Selected]);

  useEffect(() => {
    if (level2Selected) {
      const level3FormData = new FormData();
      level3FormData.append('id_level2', level2Selected);
      handleFetchTaskListLevel(3, level3FormData);
    }
  }, [level2Selected]);

  useEffect(() => {
    if (level3Selected) {
      const level4FormData = new FormData();
      level4FormData.append('id_level3', level3Selected);
      handleFetchTaskListLevel(4, level4FormData);
    }
  }, [level3Selected]);

  useEffect(() => {
    if (isValidArray(actionStatusList)) {
      handleFetchTableColumns();
      handleFetchActionFormFields();
      handleActionFormModel();
    }
  }, [actionStatusList]);

  useEffect(() => {
    const refreshData = () => {
      setActions([]);
      handleFetchActions();
    };
    refreshData();
  }, [filterData]);

  useEffect(() => {
    if (isObject(selectedAction) && !isEmpty(selectedAction)) {
      handleGetActionDetails();
    }
  }, [selectedAction]);

  useEffect(() => {
    if (shouldCreateNewAction) {
      setViewType('view_finding');
      setDrawerOpen(true);
    }
    setActionFormModel(clone(newActionFormModel.value));
  }, [shouldCreateNewAction]);

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
              <FormControl sx={{ minWidth: 100 }} size="small">
                <InputLabel id="level1">{t('Business')}</InputLabel>
                <Select
                  labelId="level1"
                  id="level1"
                  value={level1Selected}
                  onChange={(e) => setLevel1Selected(e.target.value)}
                >
                  {level1Options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 100 }} size="small">
                <InputLabel id="level2">{t('Company')}</InputLabel>
                <Select
                  labelId="level2"
                  id="level2"
                  disabled={loadingLevel2}
                  value={level2Selected}
                  onChange={(e) => setLevel2Selected(e.target.value)}
                >
                  {level2Options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 100 }} size="small">
                <InputLabel id="level3">{t('Region')}</InputLabel>
                <Select
                  labelId="level3"
                  id="level3"
                  disabled={loadingLevel3}
                  value={level3Selected}
                  onChange={(e) => setLevel3Selected(e.target.value)}
                >
                  {level3Options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 100 }} size="small">
                <InputLabel id="level4">{t('Location')}</InputLabel>
                <Select
                  labelId="level4"
                  id="level4"
                  disabled={loadingLevel4}
                  value={level4Selected}
                  onChange={(e) => setLevel4Selected(e.target.value)}
                >
                  {level4Options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="outlined" color="primary" onClick={handleLimpiarFiltrosGeo}>
                {t('clear_filters')}
              </Button>
            </Box>
            <Box display="flex" justifyContent="space-between" margin="10px" sx={{ pb: 2 }}>
              <Box display="flex" alignItems="center">
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ mr: 2 }}
                  onClick={() => dispatch(toggleShouldCreateNewAction({ status: true }))}
                >
                  + {t('CreateAction')}
                </Button>
              </Box>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            <MessageCenterActionViewTable
              actions={actions}
              actionStatus={actionStatus}
              columnConfig={tableColumnConfig}
              isFetching={isLoading || actionListLoading}
              onClickTableAction={handleClickTableActionButton}
            />
          </Box>
        </Box>

        <SpeedDialComponent
          openSpeedDial={openSpeedDial}
          handleCloseSpeedDial={handleCloseSpeedDial}
          handleOpenSpeedDial={handleOpenSpeedDial}
          speedDialActions={speedDialActions}
          handleClick={() => dispatch(toggleShouldCreateNewAction({ status: true }))}
        />
      </BaseFeaturePageLayout>
    </>
  );
}

Component.displayName = 'MessageCenterFindings';
export default Component;
