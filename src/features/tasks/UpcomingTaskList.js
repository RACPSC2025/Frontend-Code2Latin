import { Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import BaseTab from '../../components/BaseTab';
import TableComponent from '../../components/TableComponent';
import { STATUS } from '../../config/constants';
import { useLanguage } from '../../providers/languageProvider';
import { fetchEventsList } from '../../stores/events/fetchEventsListSlice';
import { selectAppliedFilterModel } from '../../stores/filterSlice';
import { showErrorMsg } from '../../utils/others';

const { in_progress, completed, delayed, pending } = STATUS;

const useAppliedFilterModel = (module) => {
  return useSelector((state) => selectAppliedFilterModel(state, module));
};

export default function UpcomingTaskList() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [taskList, setTaskList] = useState([]);

  const filterData = useAppliedFilterModel('events');
  const tabItems = [
    { key: '0', label: t('upcomingTasks') },
    { key: '1', label: t('overdueTasks') }
  ];

  const tableColumns = [
    {
      field: 'title',
      headerName: t('taskTitle'),
      width: 100,
      type: 'string'
    },
    {
      field: 'date_of_reminder',
      headerName: t('date'),
      width: 100,
      type: 'string'
    },
    {
      field: 'executioner_user_names',
      headerName: t('Sender'),
      width: 100,
      type: 'string'
    },
    {
      field: 'status_convert',
      headerName: t('State'),
      width: 100,
      type: 'string'
    }
  ];

  const prepareAPIParams = (tasks) => {
    const formData = new FormData();

    if (Object.keys(filterData).length > 0) {
      Object.keys(filterData).forEach((filterKey) => {
        formData.append(filterKey, filterData[filterKey]);
      });
    }

    if (tasks === 'upcoming') {
      formData.append('filter_start_date', getDate());
      formData.append('filter_end_date', getDate(5));
    } else {
      formData.append('filter_start_date', getDate(-10));
      formData.append('filter_end_date', getDate());
      formData.append('status', 'pending');
    }

    return formData;
  };

  const getStatus = (status) => {
    let taskStatus = status.toLowerCase();
    if (taskStatus === in_progress || status === '') {
      return t('In progress');
    } else if (taskStatus === completed) {
      return t('Completed');
    } else if (taskStatus === delayed) {
      return t('Delayed');
    } else if (taskStatus === pending) {
      return t('Pending');
    } else {
      return '';
    }
  };

  const getTitle = (item) => {
    if (language === 'en') {
      return item.desc_en;
    } else {
      return item.desc_es;
    }
  };

  const handleFetchEventList = () => {
    const formData = activeTab === 0 ? prepareAPIParams('upcoming') : prepareAPIParams('overdue');
    dispatch(fetchEventsList(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const tasks = data?.payload?.data?.map((item) => ({
          ...item,
          title: getTitle(item),
          id: item.id_event,
          status_convert: getStatus(item.status)
        }));
        setTaskList(tasks);
      } else {
        showErrorMsg(data?.payload?.messages);
      }
    });
  };

  const getDate = (days = 0) => {
    var date = new Date();
    date.setDate(date.getDate() + days);

    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  };

  useEffect(() => {
    handleFetchEventList();
  }, [filterData, activeTab]);

  return (
    <Box
      sx={{
        width: '100%',
        height: '50%',
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: 1,
        borderColor: 'grey.300',
        overflowY: 'auto',
        mb: 1
      }}
    >
      <BaseTab
        items={tabItems}
        activeTab={activeTab}
        tabContainerProps={{
          sx: {
            mb: 2
          },
          onChange: (event, newValue) => setActiveTab(newValue)
        }}
      />
      {/* <DataGrid rows={taskList} columns={tableColumns} /> */}
      <TableComponent rowData={taskList} columnDefs={tableColumns} pagination={false} />
    </Box>
  );
}
