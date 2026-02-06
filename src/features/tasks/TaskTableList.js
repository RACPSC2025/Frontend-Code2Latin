import { AttachFile, Forum, Visibility } from '@mui/icons-material';
import { Avatar, AvatarGroup, Box, Tooltip, Typography } from '@mui/material';
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import TableComponent from '../../components/TableComponent';
import TheFullPageLoader from '../../components/TheFullPageLoader';
import { fetchListTaskNew, fetchGetCountries } from '../../stores/tasks/fetchListTaskNewSlice';
import { showErrorMsg, stringAvatar } from '../../utils/others';
import { useNavigate } from "react-router-dom";

import { selectAppliedFilterModel, setSelectedStatus, setIsTaskSelected, setLogTaskSelected, setSelectedTaskView } from '../../stores/filterSlice';
import {
  fetchAutocompleteOptions,
  removeAllFilters,
  removeFilter,
  selectFilterItemValue,
  selectListOptions,
  setFilter
} from '../../stores/filterSlice';

// Custom hook to get list options
const useListOptions = (module, fieldName) =>
  useSelector((state) => selectListOptions(state, module, fieldName));

const useListOptionsGlobal = (fieldName) =>
  useSelector((state) => state.globalData?.[fieldName] ?? []);

const useFilterItemValue = (module, fieldName) =>
  useSelector((state) => selectFilterItemValue(state, module, fieldName));

export default function TaskTableList() {
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(2);
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  const [countries, setCountries] = useState([]);

  let [tasksFilters, setTasksFilters] = useState([]);
  const [loadTasks, setLoadTasks] = useState(true);
  const [list_type_of_rule, setList_type_of_rule] = useState([]);
  const [level1, setLevel1] = useState("");
  const [test, setTest] = useState([]);

  const actionStatusItem = useFilterItemValue('events', 'filter_business');
  const actionKeyWords = useFilterItemValue('events', 'filter_keywords');
  const actionCategory = useFilterItemValue('events', 'filter_category');
  const actionNameDateField = useFilterItemValue('events', 'filter_nameDateField');
  const actionStartDate = useFilterItemValue('events', 'filter_start_date');
  const actionEndDate = useFilterItemValue('events', 'filter_end_date');
  const actionStatusTypeOfRule = useFilterItemValue('events', 'filter_type_rule');

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
    
  const taskListLoading = useSelector((state) => state?.fetchListTaskNew?.loading ?? false);
  const listTaskStatus = useFilterItemValue('task', 'task_list_status');


  const handleFetchListTaskNew = () => {
    const formData = new FormData();
    formData.append('page', 1);
    dispatch(fetchListTaskNew(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        setTasks(data?.payload?.data);
        setNumberOfPages(data?.payload?.total_pages);
      } else {
        showErrorMsg(data?.payload);
      }
    });
  };

  const handlefetchGetCountries = () => {
    const formData = new FormData();
    dispatch(fetchGetCountries(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        //console.log("handleCountries");
        //console.log(data?.payload?.data);
        setCountries(data?.payload?.data);
        //console.log(countries);
      } else {
        showErrorMsg(data?.payload);
      }
    });
  };

  const circleIconsMapping = {
    pending: '🟡',
    completed: '🟢',
    delayed: '🔴',
    inProgress: '🔵'
  };

  const squareIconsMapping = {
    pending: '🟨',
    completed: '🟩',
    delayed: '🟥',
    inProgress: '🟦'
  };
  
  /*
          <Box sx={{ pl: 3 }}>
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: '5px',
                bgcolor: color_code
              }}
            />
            {data.action_id}
          </Box>
  */
  const getSquareIcon = (params) => {
    const tempStatus = String(params.data.task_status); // Puede venir como string o número
    
    // ✅ VERIFICAR QUE listTaskStatus EXISTE Y ES UN ARRAY
    const matchedStatus = listTaskStatus && Array.isArray(listTaskStatus) 
      ? listTaskStatus.find(
          (status) => status.value_number === tempStatus || status.value_number === String(tempStatus)
        )
      : null;

    if (matchedStatus) {
      return (
        /*
        <span
          style={{
            display: 'inline-block',
            width: '1em',
            height: '1em',
            backgroundColor: matchedStatus.color_code,
            borderRadius: '0.1em',
            marginRight: '0.3em'
          }}
        ></span>
        */
        <Box sx={{ pl: 3 }}>
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
          {params.data.id}
        </Box>
      );
    }

    return null; 
  };

  const paginationLegendElement = listTaskStatus.length > 0 && (
    <div className="flex items-center space-x-4 text-sm text-gray-700">
      {listTaskStatus.map((status) => (
        <div key={status.value} className="flex items-center space-x-1">
          
          <span 
            className="inline-block w-3 h-3" 
            style={{ backgroundColor: status.color_code }} 
          />
          <span>{t(status.label)}</span>
        </div>
      ))}
    </div>
  );

  const getRandomSquareIcon = () => {
    const values = Object.values(squareIconsMapping);
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
  };

  const getRandomCircleIcon = () => {
    const values = Object.values(circleIconsMapping);
    const randomIndex = Math.floor(Math.random() * values.length);
    return values[randomIndex];
  };

  function formatDateToString(dateString) {
    const date = new Date(dateString);
    const options = { month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  const currentStatus = useSelector((state) => 
    selectFilterItemValue(state, 'task', 'selectedStatus')
  ) || 0; 
  
  
  const handleSetFilterItemValue = (module, id, value) => {
    if (!module) {
      console.error("El módulo es undefined o inválido");
      console.log("El módulo es undefined o inválido");
      return;
    }
    const payload = { 
      module, 
      updatedFilter: { [id]: value } 
    };
    dispatch(setFilter(payload));
  };

  const goToTaskList = (logtask) => {
    handleSetFilterItemValue('task', 'selectedLogTask', logtask);
    handleSetFilterItemValue('task', 'isSelectedTask', true);
    handleSetFilterItemValue('task', 'selectedTaskView', 'list');
    //navigate('/view/events');
  };

  const getColorStatus = (status) => {
    const matchedStatus = listTaskStatus.find(
      (item) => item.value_number === String(status) || Number(item.value_number) === Number(status)
    );

    return matchedStatus ? matchedStatus.color_code : '#cccccc'; // color por defecto si no hay coincidencia
  };

  const CircleCellRenderer = (params, month) => {
    const logTasks = params?.data?.logtask_list;
    if (!Array.isArray(logTasks)) return null;
  
    return (
      <div
        className="overflow-x-auto"
        style={{
          display: "flex",
          gap: "8px",
          maxWidth: "120px",
          overflowY: "hidden",
          height: "36px",
          alignItems: "center",
        }}
      >
        {logTasks.map((logTask, index) => {
          const colorStatus = getColorStatus(Number(logTask.logtask_status));
          const tempDate = new Date(logTask.end_date);
          const monthDate = tempDate.getMonth() + 1;
          const isCurrentYear = tempDate.getFullYear() === new Date().getFullYear();
  
          if (monthDate === month && isCurrentYear) {
            return (
              <div key={index} 
              className="cursor-pointer"
              onClick={() => goToTaskList(logTask)} // <--- aquí
              style={{
                minWidth: "24px",
                height: "24px",
                borderRadius: "50%",
                backgroundColor: colorStatus,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "11px",
                textAlign: "center"
              }}>
                {parseInt(logTask.percentage)}
              </div>
            );
          }
  
          return null;
        })}
      </div>
    );
  };

  const avatarCommonStyle = { width: 24, height: 24 };

  const renderResponsibles = (params) => {
    const responsibles = params.value;
    const usernames = Object.values(responsibles);

    return (
      <AvatarGroup
        max={4}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {usernames.map((username, index) => {
          const avatarProps = stringAvatar(username, {
            ...avatarCommonStyle,
            bgcolor: 'primary.main',
            fontSize: '0.8rem'
          });
          return (
            <Tooltip title={username} key={index}>
              <Avatar {...avatarProps} />
            </Tooltip>
          );
        })}
      </AvatarGroup>
    );
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
    browserDatePicker: true,
  };

  const dateSize = 120;
  //const tableColumns = [
  const [tableColumns, setTableColumns] = useState([
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
      field: 'task_title',
      headerName: t('name'),
      width: 150,
      type: 'string',
      filter: "agTextColumnFilter", 
    },
    {
      field: 'created_by',
      headerName: t('Created by'),
      width: 100,
      type: 'string',
      filter: "agSetColumnFilter", 
      filterParams: {
        values: null,
      },
    },
    {
      field: 'responsibles',
      headerName: t('Responsibles'),
      width: 100,
      type: 'string',
      cellRenderer: renderResponsibles,
    },
    {
      field: 'reviewers',
      headerName: t('Reviewers'),
      width: 100,
      type: 'string',
      cellRenderer: renderResponsibles,
    },
    {
      field: 'id',
      headerName: '',
      flex: 1, // Adjusts width dynamically
      minWidth: 220, // Optional: sets the minimum width
      maxWidth: 300,
      type: 'string',
      cellRenderer: (params) => {
        return (
          <Box
            display="flex"
            gap={5}
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'start' }}
          >
            {/* <Box display="flex" alignItems="center" gap={1}>
              <div>{params.data.id}</div>
            <div>{params.data.name}</div>
            </Box> */}
            <Box display="flex" alignItems="center" gap={1}>
              {/* {formatDateToString(params.data.task_start_date)} */}
              <Box display="flex" alignItems="center">
                <Forum />
                <Typography variant="body2" color="textSecondary">
                  {params.data.comment_count}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <AttachFile />
                <Typography variant="body2" color="textSecondary">
                  {params.data.num_documents}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      }
    },
    {
      field: 'jan',
      headerName: t('JAN'),
      type: 'string',
      width: dateSize,
      cellRenderer: (params) => {
        return <div>{CircleCellRenderer(params, 1)}</div>;
      }
    },
    {
      field: 'feb',
      headerName: t('FEB'),
      type: 'string',
      width: dateSize,
      cellRenderer: (params) => {
        return <div>{CircleCellRenderer(params, 2)}</div>;
      }
    },
    {
      field: 'mar',
      headerName: t('MAR'),
      type: 'string',
      width: dateSize,
      cellRenderer: (params) => {
        return <div>{CircleCellRenderer(params, 3)}</div>;
      }
    },
    {
      field: 'apr',
      headerName: t('APR'),
      type: 'string',
      width: dateSize,
      cellRenderer: (params) => {
        return <div>{CircleCellRenderer(params, 4)}</div>;
      }
    },
    {
      field: 'may',
      headerName: t('MAY'),
      type: 'string',
      width: dateSize,
      cellRenderer: (params) => {
        return <div>{CircleCellRenderer(params, 5)}</div>;
      }
    },
    {
      field: 'jun',
      headerName: t('JUN'),
      type: 'string',
      width: dateSize,
      cellRenderer: (params) => {
        return <div>{CircleCellRenderer(params, 6)}</div>;
      }
    },
    {
      field: 'jul',
      headerName: t('JUL'),
      type: 'string',
      width: dateSize,
      cellRenderer: (params) => {
        return <div>{CircleCellRenderer(params, 7)}</div>;
      }
    },
    {
      field: 'aug',
      headerName: t('AUG'),
      type: 'string',
      width: dateSize,
      cellRenderer: (params) => {
        return <div>{CircleCellRenderer(params, 8)}</div>;
      }
    },
    {
      field: 'sep',
      headerName: t('SEP'),
      type: 'string',
      width: dateSize,
      cellRenderer: (params) => {
        return <div>{CircleCellRenderer(params, 9)}</div>;
      }
    },
    {
      field: 'oct',
      headerName: t('OCT'),
      type: 'string',
      width: dateSize,
      cellRenderer: (params) => {
        return <div>{CircleCellRenderer(params, 10)}</div>;
      }
    },
    {
      field: 'nov',
      headerName: t('NOV'),
      type: 'string',
      width: dateSize,
      cellRenderer: (params) => {
        return <div>{CircleCellRenderer(params, 11)}</div>;
      }
    },
    {
      field: 'dec',
      headerName: t('DEC'),
      type: 'string',
      width: dateSize,
      cellRenderer: (params) => {
        return <div>{CircleCellRenderer(params, 12)}</div>;
      }
    }
  ]);

  const tableRows = [];

  const status = [
    'pending',
    '',
    '',
    'completed',
    '',
    '',
    '',
    '',
    '',
    'delayed',
    'inProgress',
    '',
    '',
    ''
  ];

  const squareStatus = ['pending', 'completed', 'delayed', 'inProgress'];

  const getRandomStatus = () => {
    return status[Math.floor(Math.random() * status.length)];
  };

  const getSquareRandomStatus = () => {
    return squareStatus[Math.floor(Math.random() * squareStatus.length)];
  };

  for (let i = 1; i <= 50; i++) {
    tableRows.push({
      id: i + 1,
      name: `Task ${i + 1}`,
      mainStatus: getSquareRandomStatus(),
      jan: getRandomStatus(),
      feb: getRandomStatus(),
      mar: getRandomStatus(),
      apr: getRandomStatus(),
      may: getRandomStatus(),
      jun: getRandomStatus(),
      jul: getRandomStatus(),
      aug: getRandomStatus(),
      sep: getRandomStatus(),
      oct: getRandomStatus(),
      nov: getRandomStatus(),
      dec: getRandomStatus()
    });
  }

  
  const getTypeFilterTasksByCurrentStatus = (tasksFiltersTemp, currentStatus, actionStartDate, actionEndDate, actionNameDateField, actionCategory) => {
    console.log("currentStatus F: ", currentStatus )
    if(currentStatus !== null && currentStatus !== "" && currentStatus !== 0  && currentStatus !== -1&& currentStatus !== "-1"){
      tasksFiltersTemp = (tasksFiltersTemp.filter((item) => item.task_status === currentStatus));
      //getTypeFilterTasksByDate(tasksFiltersTemp, actionStartDate, actionEndDate);
      setTasksFilters(tasksFiltersTemp);
    }
    else{
      //getTypeFilterTasksByDate(tasksFiltersTemp, actionStartDate, actionEndDate);
      setTasksFilters(tasksFiltersTemp);
    }
    setTasksFilters(tasksFiltersTemp);
  }
  
  const getTypeFilterTasksByDate = (tasksFiltersTemp, actionStartDate, actionEndDate) => {
    if(actionNameDateField !== null && actionNameDateField !== "" && actionNameDateField != undefined){      
      if(actionStartDate !== null && actionStartDate !== "" && actionStartDate != undefined){
        const selectedStartDate = new Date(actionStartDate);
        tasksFiltersTemp = (tasksFiltersTemp.filter((item) => new Date(item[actionNameDateField]) >= selectedStartDate));
        if(actionEndDate !== null && actionEndDate !== "" && actionEndDate != undefined){
          const selectedEndDate = new Date(actionEndDate);
          tasksFiltersTemp = (tasksFiltersTemp.filter((item) => new Date(item[actionNameDateField]) <= selectedEndDate));
        }
      }
    }
    setTasksFilters(tasksFiltersTemp);
  }

  /*
  useEffect(() => {
    handlefetchGetCountries();
  }, []);
  */

  useEffect(() => {
    if (loadTasks) {
      setLoadTasks(false);
      handleFetchListTaskNew();
    }
  }, [loadTasks]);
  
  useEffect(() => {
    if (tasks.length > 0) {
      setTasksFilters(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    let tasksFiltersTemp = tasks;
    //console.log("tasksFiltersTemp");
    //console.log(tasksFiltersTemp);
    if (actionKeyWords && actionKeyWords.trim() !== "" && tasks.length > 0) {
      tasksFiltersTemp = (
        tasksFiltersTemp.filter((item) =>
          item.task_title.match(new RegExp(actionKeyWords, "i"))
        )
      );
      getTypeFilterTasksByCurrentStatus(tasksFiltersTemp, currentStatus, actionStartDate, actionEndDate, actionNameDateField, actionCategory);
    }
    else{
      getTypeFilterTasksByCurrentStatus(tasksFiltersTemp, currentStatus, actionStartDate, actionEndDate);
    }    
  }, [actionKeyWords, tasksFilters, tasks, currentStatus, actionStartDate, actionEndDate, actionNameDateField, actionCategory]); // Se ejecuta cuando cambian las variables de los filtros
  
  return (
    <Box sx={{ height: 'calc(100vh - 300px)' }}>
      {taskListLoading ? (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TheFullPageLoader loaderText="" background="transparent" />
        </Box>
      ) : (
        <TableComponent rowData={tasksFilters} columnDefs={tableColumns} paginationLegendElement={paginationLegendElement} />
      )}
    </Box>
  );
}
