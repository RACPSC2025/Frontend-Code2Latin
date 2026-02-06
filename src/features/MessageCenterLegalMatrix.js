import {
  AddBoxOutlined,
  AddCircleOutline,
  AddShoppingCart,
  Apps,
  AutoAwesome,
  CalendarMonth,
  ImportExport,
  ListAlt,
  Tune,
  MoreVertOutlined
} from '@mui/icons-material';
import {
  Box,
  FormControl,
  Button,
  IconButton,
  InputLabel,
  Select,
  Tab,
  Tabs,
  Menu,
  MenuItem,
  Checkbox,
  Tooltip,
  Typography
} from '@mui/material';
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import SpeedDialComponent from '../components/SpeedDialComponent';
import TableComponent from '../components/TableComponent';
import { fetchListLegals, fetchListLegalsComplete } from '../stores/legal/fetchListLegalsSlice';
import DetallesDrawer from './MessageCenterLegalMatrix/DetallesDrawer';
import LegalMatrixDrawer from './MessageCenterLegalMatrix/LegalMatrixDrawer';
import ListView from './MessageCenterLegalMatrix/ListView';
import OptionsDrawer from './MessageCenterLegalMatrix/OptionsDrawer';
import BaseFeaturePageLayout from '../components/BaseFeaturePageLayout';
import ReactFlagsSelect from 'react-flags-select';
import {
  fetchAutocompleteOptions,
  removeAllFilters,
  removeFilter,
  selectFilterItemValue,
  selectListOptions,
  selectAppliedFilterModel,
  setFilter
} from '../stores/filterSlice';
import { fetchTaskListLevel } from '../stores/tasks/fetchtaskListLevelSlice';

import { fetchActionList } from '../stores/actions/fetchActionSlice';
import { clone, isEmpty, isObject } from 'radash';

import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';

/*
import {
  ClientSideRowModelModule,
  ColDef,
  ColGroupDef,
  DateFilterModule,
  GridApi,
  GridOptions,
  IDateFilterParams,
  ModuleRegistry,
  NumberFilterModule,
  TextFilterModule,
  ValidationModule,
} from "ag-grid-community";
 */

// import {
//   ClientSideRowModelModule,
//   DateFilterModule,
//   GridApi,
//   IDateFilterParams,
//   ModuleRegistry,
//   NumberFilterModule,
//   TextFilterModule,
//   ValidationModule,
// } from "ag-grid-community";

const myClient = new ApolloClient({
  uri: 'https://api.spacex.land/graphql',
  cache: new InMemoryCache()
});

// Custom hook to get list options
const useListOptions = (module, fieldName) =>
  useSelector((state) => selectListOptions(state, module, fieldName));

const useListOptionsGlobal = (fieldName) =>
  useSelector((state) => state.globalData?.[fieldName] ?? []);

const useFilterItemValue = (module, fieldName) =>
  useSelector((state) => selectFilterItemValue(state, module, fieldName));

export function Component() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [idRequisito, setIdRequisito] = useState(0);
  const [optinDrawerData, setOptinDrawerData] = useState();
  const [openOptionsDrawer, setOpenOptionsDrawer] = useState(false);
  const [openDetallesDrawer, setOpenDetallesDrawer] = useState(false);
  const [openCreateTask, setOpenCreateTask] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(false);
  const [selectedView, setSelectedView] = useState('requirements');
  const [requirementIconColor, setRequirementIconColor] = useState('warning');
  const [listaIconColor, setListaIconColor] = useState('action');
  const [country, setCountry] = useState('CO');
  const [legals, setLegals] = useState([]);
  let [legalsFilters, setLegalsFilters] = useState([]);
  const [loadLegals, setLoadLegals] = useState(true);
  const [list_type_of_rule, setList_type_of_rule] = useState([]);
  const [level1, setLevel1] = useState('');
  const [test, setTest] = useState([]);

  //const actionStatusList = useListOptions('legalMatrix', 'filter_business');
  const actionStatusItem = useFilterItemValue('legalMatrix', 'filter_business');
  const actionKeyWords = useFilterItemValue('legalMatrix', 'filter_keywords');
  const actionCategory = useFilterItemValue('legalMatrix', 'filter_category');
  const actionNameDateField = useFilterItemValue('legalMatrix', 'filter_nameDateField');
  const actionStartDate = useFilterItemValue('legalMatrix', 'filter_start_date');
  const actionEndDate = useFilterItemValue('legalMatrix', 'filter_end_date');
  const actionStatusTypeOfRule = useFilterItemValue('legalMatrix', 'filter_type_rule');

  const newActionFormModel = useRef(null);
  const [actionFormModel, setActionFormModel] = useState({});
  const [selectedAction, setSelectedAction] = useState(null);
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
  const [level5ptions, setLevel5Options] = useState([]);
  const [level5Selected, setLevel5Selected] = useState('');
  const [loadingLevel5, setLoadingLevel5] = useState(true);

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

  const useAppliedFilterModel = (module) =>
    useSelector((state) => selectAppliedFilterModel(state, module));

  const filterData = useAppliedFilterModel('actions');

  const handleCountryChange = (event) => {
    setLegals([]);
    setCountry(event.target.value);
  };

  const [countrySelected, setCountrySelected] = useState('CO');

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
    setLegals([]);
  };

  const handleOpenSpeedDial = () => {
    setOpenSpeedDial(true);
  };

  const handleCloseSpeedDial = () => {
    setOpenSpeedDial(false);
  };

  const handleOpenDetallesDrawer = (logtask) => {
    setIdRequisito(logtask.id_requisito);
    setOpenDetallesDrawer(true);
  };

  const handleCloseDetallesDrawer = () => {
    setOpenSpeedDial(false);
    setOpenDetallesDrawer(false);
  };

  const handleOpenOptionsDrawer = (logtask) => {
    setOpenOptionsDrawer(true);
  };

  const handleCloseOptionsDrawer = () => {
    setOpenSpeedDial(false);
    setOpenOptionsDrawer(false);
  };

  const handleOpenLegalFormDrawer = () => {
    setOpenCreateTask(true);
  };

  const handleCloseLegalFormDrawer = () => {
    // setOpenSpeedDial(false);
    setOpenCreateTask(false);
  };

  const prepareAPIParams = () => {
    const formData = new FormData();

    if (Object.keys(filterData).length > 0) {
      Object.keys(filterData).forEach((filterKey) => {
        formData.append(filterKey, filterData[filterKey]);
      });
    }

    return formData;
  };

  function fixEncoding(str) {
    let bytes = new Uint8Array(str.split('').map((c) => c.charCodeAt(0))); // Convierte a bytes
    return new TextDecoder('utf-8').decode(bytes); // Decodifica como UTF-8
  }

  /*
  This are de avaliable color for the progress bar
  not_apply: '#929fba',
  under_progress: '#438edf',
  open: '#d8cb6e',
  completed: '#00b2aa',
  delayed: '#e85b71'
  */

  function getPercentage(legalPercentage) {
    let percentage = isFinite(Number(legalPercentage)) ? Number(legalPercentage) : 0;
    return percentage;
  }

  function getLegalState(state, legalPercentage) {
    let legalState = '';
    //let percentage = Number(legalPercentage);
    let percentage = isFinite(Number(legalPercentage)) ? Number(legalPercentage) : 0;
    if (state === 'cerrado') {
      if (percentage === 100) {
        legalState = 'completed';
      } else {
        legalState = 'not_apply';
      }
    }
    if (state === 'continuo') {
      if (percentage === 0) {
        legalState = 'open';
      } else {
        legalState = 'under_progress';
      }
    }
    if (state === '0') {
      legalState = 'not_apply';
    }
    return legalState;
  }

  function getRandomInt(min, max) {
    // Asegurarse de que min y max sean enteros
    min = Math.ceil(min);
    max = Math.floor(max);
    // Devuelve un número entero entre min y max (ambos incluidos)
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const getCorrectText = (text) => {
    const bytes = new Uint8Array([...text].map((c) => c.charCodeAt(0)));
    const correctText = new TextDecoder('utf-8').decode(bytes);
    return correctText;
  };

  const handleFetchLegals = () => {
    dispatch(fetchListLegals()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const legals = data?.payload?.data.map((item) => ({
          //...item,
          id: item.id_requisito,
          type: item.requisito_general_tipo,
          //articles: '',
          articles: getRandomInt(1, 3),
          //tasks: '',
          tasks: getRandomInt(1, 5),
          //type_of_rule: fixEncoding(item.tipo_de_norma),
          type_of_rule: item.tipo_de_norma,
          //number: item.id_requisito,id_tipo_de_norma
          number: item.id_tipo_de_norma,
          requirement_name: item.nombre,
          date_of_issue_notification: item.fecha_expedicion,
          effective_date: item.fecha_ejecutoria,
          renovation_date: item.fecha_renovation,
          modified_date: item.modified,
          requirement_description: item.descripcion,
          progress: {
            progress: getLegalState(item.estado, item.percentage),
            percentage: getPercentage(parseFloat(item.percentage).toFixed(2))
          },
          status: item.estado,
        }));
        setLegals(legals);
        setLegalsFilters(legals);
        console.log('legals', data?.payload);

        const uniqueTypeOfRules = [...new Set(legals.map((item) => item.type_of_rule))];
        setList_type_of_rule(uniqueTypeOfRules);
      }
    });

    //obtenerRequisitoData
    //dispatch(fetchListLegalsComplete(GET_REQUIREMENTS_QUERY)).then((data) => {
    // dispatch(fetchListLegalsComplete()).then((data) => {
    //   //dispatch(obtenerRequisitoData(11)).then((data) => {
    //   if (data?.payload?.messages === 'Success') {
    //     const test = data;
    //     /*
    //     const test = data?.payload?.data.map((item) => ({
    //       ...item
    //     }))
    //       */
    //     //.filter((item) => item.tipo_de_norma === "");
    //     //setTest(test);
    //     // Obtener los valores únicos de type_of_rule
    //     //const uniqueTypeOfRules = [...new Set(test.map((item) => item.tipo_de_norma))];
    //     //console.log(uniqueTypeOfRules); // Esto imprimirá los valores únicos en la consola
    //     console.log('requirements Test');
    //     console.log(test);
    //   }
    // });
  };

  const customHeaderStyle = {
    fontFamily: `'Roboto', 'Arial', sans-serif`
  };

  const dateFilterParams = {
    comparator: (filterDate, cellValue) => {
      if (!cellValue) return -1;

      const [year, month, day] = cellValue.split('-');
      const cellDate = new Date(+year, +month - 1, +day);

      if (cellDate < filterDate) return -1;
      if (cellDate > filterDate) return 1;
      return 0;
    },
    browserDatePicker: true
  };

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      //filter: true,
      filter: 'agTextColumnFilter',
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true
    };
  }, []);

  const filterParams = {
    comparator: (filterLocalDateAtMidnight, cellValue) => {
      if (!cellValue) return -1;

      // Suponiendo que cellValue es del tipo "2025-05-15"
      const cellDateParts = cellValue.split('-');

      // Convertimos a Date con formato YYYY-MM-DD
      const cellDate = new Date(
        Number(cellDateParts[0]), // año
        Number(cellDateParts[1]) - 1, // mes (0-based)
        Number(cellDateParts[2]) // día
      );

      if (cellDate < filterLocalDateAtMidnight) return -1;
      if (cellDate > filterLocalDateAtMidnight) return 1;
      return 0;
    },
    browserDatePicker: true // Usa el selector nativo de fecha
  };

  //const listTaskStatus = useFilterItemValue('task', 'task_list_status');
  const listLegalStatus = useFilterItemValue('legalMatrix', 'legal_list_status');
  
  const handleSetFilterItemValue = (module, id, value) => {
    if (!module) {
      console.error("El módulo es undefined o inválido");
      console.log("El módulo es undefined o inválido");
      return;
    }
    const payload = { 
      module, 
      updatedFilter: { [id]: value } // Debe estar dentro de `updatedFilter`
    };
    dispatch(setFilter(payload));
  };
  
  const getSquareIcon = (params) => {
    //console.log('listLegalStatus: ', listLegalStatus);
    const tempStatus = String(params.data.status).toLowerCase();

    // ✅ VERIFICAR QUE listLegalStatus EXISTE Y ES UN ARRAY
    const matchedStatus = listLegalStatus && Array.isArray(listLegalStatus)
      ? listLegalStatus.find((status) => {
          // Asegurarse de que status no sea nulo antes de acceder a sus propiedades
          if (!status) return false;
          const statusNumber = String(status.value_number).toLowerCase();
          const statusLabel = String(status.label).toLowerCase(); // convierte boolean/texto a string
          return statusNumber === tempStatus || statusLabel === tempStatus;
        })
      : null;

    return (
      <Box sx={{ pl: 3 }}>
        {matchedStatus && (
          <Box
            sx={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: '5px',
              bgcolor: matchedStatus.color_code
            }}
          />
        )}
        {params.data.id}
      </Box>
    );
  };

  const [columnDefs, setColumnDefs] = useState([
    {
      field: 'ID',
      headerName: 'ID',
      type: 'string',
      width: 100,
      cellRenderer: (params) => {
        return getSquareIcon(params);
      },
    },
    {
      field: '',
      headerName: t('AMAT-IA'),
      headerComponent: () => (
        <div
          style={customHeaderStyle}>
          {t('AMAT-IA')}

          <Tooltip title={t('Crear requisito legal')}>
            <IconButton
              size="small"
              color="primary"
              onClick={() => {
                handleOpenOptionsDrawer();
                setActiveTab(0);
                setOptinDrawerData(null);
              }}
            >
              <AutoAwesome />
            </IconButton>
          </Tooltip>
        </div>
      ),
      headerStyle: customHeaderStyle,
      cellRenderer: (params) => {
        return (
          <div>
            <Tooltip title={t('analysis_with_amatia')}>
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  handleOpenOptionsDrawer();
                  setActiveTab(1);
                  handleSetFilterItemValue('legalMatrix', 'requisito_actual', params?.data); // Guardar el valor en Redux
                  handleSetFilterItemValue('legalMatrix', 'id_requisito_actual', params?.data.id); // Guardar el valor en Redux
                  console.log('params data:', params?.data);
                  console.log('params data ID:', params?.data.id);
                  setOptinDrawerData(params?.data);
                }}
              >
                <AutoAwesome />
              </IconButton>
            </Tooltip>
          </div>
        );
      }
    },
    {
      field: 'options',
      headerName: t('options'),
      cellRenderer: (params) => {
        return (
          <div>
            <Tooltip title={t('options')}>
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  handleOpenOptionsDrawer(), setActiveTab(0);
                  setOptinDrawerData(params?.data);
                }}
              >
                <MoreVertOutlined />
              </IconButton>
            </Tooltip>
          </div>
        );
      }
    },
    {
      field: 'type',
      headerName: t('type'),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: null
      }
    },
    {
      field: 'articles',
      headerName: t('articles'),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: null
      },

      cellRenderer: (params) => {
        return (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
          >
            <Typography>{params?.value}</Typography>
            <IconButton
              size="small"
              color="primary"
              title={t('Add_articles')}
              onClick={() => {
                handleOpenOptionsDrawer();
                setActiveTab(2);
                setOptinDrawerData(params?.data);
              }}
            >
              <AddBoxOutlined />
            </IconButton>
          </Box>
        );
      }
    },
    {
    field: 'progress',
      headerName: t('progress'),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: null
      },
      cellRenderer: (params) => {
        const badgeData = params?.value?.percentage ? `${params?.value?.percentage}%` : '0%';

        // Normalizamos el valor a comparar
        const tempStatus = String(params.data.status).toLowerCase();

        // ✅ VERIFICAR QUE listLegalStatus EXISTE Y ES UN ARRAY
        const matchedStatus = listLegalStatus && Array.isArray(listLegalStatus)
          ? listLegalStatus.find((status) => {
              // Asegurarse de que status no sea nulo antes de acceder a sus propiedades
              if (!status) return false;
              const statusNumber = String(status.value_number).toLowerCase();
              const statusValue = String(status.value).toLowerCase();
              const statusLabel = String(status.label).toLowerCase(); // soporta boolean y string

              return (
                statusNumber === tempStatus ||
                statusValue === tempStatus ||
                statusLabel === tempStatus
              );
            })
          : null;

        // Si hay match usamos el color_code, sino color por defecto
        const badgeColor = matchedStatus?.color_code || '#1976d2';

        return (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography
              sx={{
                border: `4px solid ${badgeColor}`,
                px: 1,
                borderRadius: '4px',
                color: 'black !important',
                backgroundColor: '#fff'
              }}
              className="badge"
            >
              {badgeData}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'tasks',
      headerName: t('tasks'),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: null
      }
    },
    {
      field: 'type_of_rule',
      headerName: t('type_of_rule'),
      filter: 'agSetColumnFilter',
      filterParams: {
        values: null
      }
    },
    {
      field: 'number',
      headerName: t('number'),
      filter: 'agNumberColumnFilter',
      maxWidth: 10000
    },
    {
      field: 'requirement_name',
      headerName: t('requirement_name'),
      filter: 'agTextColumnFilter'
    },
    {
      field: 'requirement_description',
      headerName: t('requirement_description'),
      filter: 'agTextColumnFilter'
    },
    {
      field: 'date_of_issue_notification',
      headerName: t('date_of_issue_notification'),
      filter: 'agDateColumnFilter',
      filterParams: dateFilterParams
    },
    {
      field: 'effective_date',
      headerName: t('effective_date'),
      filter: 'agDateColumnFilter',
      filterParams: dateFilterParams
    },
    {
      field: 'renovation_date',
      headerName: t('renovation_date'),
      filter: 'agDateColumnFilter',
      filterParams: dateFilterParams
    },
    {
      field: 'modified_date',
      headerName: t('modified_date'),
      filter: 'agDateColumnFilter',
      filterParams: dateFilterParams
    }
  ]);
  //];

  const speedDialActions = [
    { icon: <AddCircleOutline />, name: t('create_legal_requirement') },
    { icon: <ImportExport />, name: t('import_legal_requirement') },
    { icon: <AddShoppingCart />, name: t('check_legal_requirement') }
  ];

  const viewTab = [
    {
      name: 'requirements',
      icon: <CalendarMonth color={requirementIconColor} fontSize="medium" />
    },
    /*
    {
      name: 'list',
      icon: <ListAlt color={listaIconColor} fontSize="medium" />
    }
    */
  ];

  const adjustmensts = {
    name: 'adjustments',
    icon: <Tune fontSize="medium" />
  };

  const getTypeFilterLegalsByTypeOfRule = (
    legalsFiltersTemp,
    actionStatusTypeOfRule,
    actionStartDate,
    actionEndDate,
    actionNameDateField,
    actionCategory
  ) => {
    if (actionStatusTypeOfRule !== null && actionStatusTypeOfRule !== '') {
      legalsFiltersTemp = legalsFiltersTemp.filter(
        (item) => item.type_of_rule === actionStatusTypeOfRule
      );
      getTypeFilterLegalsByDate(legalsFiltersTemp, actionStartDate, actionEndDate);
    } else {
      getTypeFilterLegalsByDate(legalsFiltersTemp, actionStartDate, actionEndDate);
    }
  };

  const getTypeFilterLegalsByDate = (legalsFiltersTemp, actionStartDate, actionEndDate) => {
    if (
      actionNameDateField !== null &&
      actionNameDateField !== '' &&
      actionNameDateField != undefined
    ) {
      if (actionStartDate !== null && actionStartDate !== '' && actionStartDate != undefined) {
        const selectedStartDate = new Date(actionStartDate);
        legalsFiltersTemp = legalsFiltersTemp.filter(
          (item) => new Date(item[actionNameDateField]) >= selectedStartDate
        );
        if (actionEndDate !== null && actionEndDate !== '' && actionEndDate != undefined) {
          const selectedEndDate = new Date(actionEndDate);
          legalsFiltersTemp = legalsFiltersTemp.filter(
            (item) => new Date(item[actionNameDateField]) <= selectedEndDate
          );
        }
      }
    }
    setLegalsFilters(legalsFiltersTemp);
  };

  useEffect(() => {
    if (loadLegals) {
      setLoadLegals(false);
      handleFetchLegals();
    }
  }, [loadLegals]); // Solo se ejecuta cuando cambia `loadLegals`

  useEffect(() => {
    if (legals.length > 0) {
      setLegalsFilters(legals);
    }
  }, [legals]); // Se ejecuta cuando cambia `legals`

  useEffect(() => {
    let legalsFiltersTemp = legals;
    if (actionKeyWords && actionKeyWords.trim() !== '' && legals.length > 0) {
      legalsFiltersTemp = legalsFiltersTemp.filter(
        (item) =>
          item.requirement_description.match(new RegExp(actionKeyWords, 'i')) ||
          item.requirement_name.match(new RegExp(actionKeyWords, 'i'))
      );
      getTypeFilterLegalsByTypeOfRule(
        legalsFiltersTemp,
        actionStatusTypeOfRule,
        actionStartDate,
        actionEndDate,
        actionNameDateField,
        actionCategory
      );
    } else {
      getTypeFilterLegalsByTypeOfRule(
        legalsFiltersTemp,
        actionStatusTypeOfRule,
        actionStartDate,
        actionEndDate
      );
    }
  }, [
    actionKeyWords,
    legalsFilters,
    legals,
    actionStatusTypeOfRule,
    actionStartDate,
    actionEndDate,
    actionNameDateField,
    actionCategory
  ]); // Se ejecuta cuando cambian las variables de los filtros

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

  /*
  const handleSetFilterItemValue = (module, id, value) => {
    if (!module) {
      console.error('El módulo es undefined o inválido');
      console.log('El módulo es undefined o inválido');
      return;
    }
    const payload = {
      module,
      updatedFilter: { [id]: value } // Debe estar dentro de `updatedFilter`
    };
    dispatch(setFilter(payload));
  };
  */

  const selectedColumns = useSelector((state) =>
    selectFilterItemValue(state, 'task', 'selectedColumns')
  );

  const adjustmentOptions = [{ label: 'Select columns', value: 'selectedColumnsOption' }];

  const [selectedAdjustments, setSelectedAdjustments] = useState([]);

  const [adjustmentAnchorEl, setAdjustmentAnchorEl] = useState(null);
  const [selectedAdjustmentOption, setSelectedAdjustmentOption] = useState(null);

  const handleOpenAdjustments = (e) => {
    setAdjustmentAnchorEl(e.currentTarget);
  };

  const handleCloseAdjustments = () => {
    setAdjustmentAnchorEl(null);
  };

  const handleSelectAdjustment = (option) => {
    setSelectedAdjustmentOption(option);
    handleCloseAdjustments();
  };

  const handleToggleAdjustment = () => {
    const newValue = !selectedColumns;
    handleSetFilterItemValue('task', 'selectedColumns', newValue);
    handleCloseAdjustments(); // Si querés que se cierre el menú al hacer click
  };

  return (
    <BaseFeaturePageLayout>
      <Box
        className="px-5"
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'white'
        }}
      >
        <Box className="xl:flex items-center justify-between gap-6 w-full py-2 mb-2">
          <Box className="flex items-center justify-center gap-6">
            {/* 
            <FormControl size="small" sx={{ minWidth: 200, marginBottom: -1 }}>
              <ReactFlagsSelect
                selected={countrySelected}
                onSelect={(code) => setCountrySelected(code)}
                //countries={["CO", "PA", "PE"]}
                countries={['CO']}
                placeholder={t('Country')}
                searchable
                searchPlaceholder={t('Search country')}
                disabled={false}
              />
            </FormControl>
            */}
            {
            // structure filters
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
          }
          </Box>

          <Box className="flex gap-6 mt-2 xl:mt-0">
            {viewTab.map((tab, tabIndex) => {
              return (
                <Box
                  key={tabIndex}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={(e) => {
                    setSelectedView(tab.name);
                    if (tab.name === 'requirements') {
                      setRequirementIconColor('warning');
                      setListaIconColor('action');
                    } else if (tab.name === 'list') {
                      setRequirementIconColor('action');
                      setListaIconColor('warning');
                    }
                  }}
                >
                  {tab.icon}
                  {<Typography variant="h8">{t(tab.name)}</Typography>}
                </Box>
              );
            })}
            <Box
              key={'adjustmensts'}
              sx={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={(e) => {
                handleOpenAdjustments(e);
              }}
            >
              {adjustmensts.icon}
              {<Typography variant="h8">{t(adjustmensts.name)}</Typography>}
            </Box>
          </Box>
        </Box>

        {/* Settings menu */}
        <Menu
          anchorEl={adjustmentAnchorEl}
          open={Boolean(adjustmentAnchorEl)}
          onClose={handleCloseAdjustments}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center'
          }}
        >
          <MenuItem disableRipple>
            <div className="flex items-center cursor-default">
              <Checkbox
                checked={selectedColumns}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSetFilterItemValue('task', 'selectedColumns', !selectedColumns);
                }}
                className="mr-2 cursor-pointer" // cursor sólo sobre el checkbox
              />
              <span>{t('Select_columns')}</span>
            </div>
          </MenuItem>
        </Menu>

        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          {selectedView === 'requirements' ? (
            <TableComponent rowData={legalsFilters} columnDefs={columnDefs} />
          ) : selectedView === 'list' ? (
            <ListView legals={legalsFilters} />
          ) : null}
        </Box>


        {/* SCrear requisito legal */}
        <SpeedDialComponent
          openSpeedDial={openSpeedDial}
          handleCloseSpeedDial={() => setOpenSpeedDial(false)}
          handleOpenSpeedDial={() => setOpenSpeedDial(true)}
          speedDialActions={speedDialActions}
          handleClick={() => setOpenCreateTask(true)}
        />

        {/* /* Legal Option Drawer */}
        <OptionsDrawer
          openOptionsDrawer={openOptionsDrawer}
          onCloseOptionsDrawer={handleCloseOptionsDrawer}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          optinDrawerData={optinDrawerData}
        />
        {/* Detailes Drawer */}
        <DetallesDrawer
          openDetallesDrawer={openDetallesDrawer}
          onCloseDetallesDrawer={handleCloseDetallesDrawer}
          idRequisito={idRequisito}
        />

        {/* /* Legal Matrix Form  Drawer */}
        <LegalMatrixDrawer
          openCreateTask={openCreateTask}
          setOpenCreateTask={handleCloseLegalFormDrawer}
        />
      </Box>
    </BaseFeaturePageLayout>
  );
}

Component.displayName = 'MessageCenterLegalMatrix';
export default Component;
