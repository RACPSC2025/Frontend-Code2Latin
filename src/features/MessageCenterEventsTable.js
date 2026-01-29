import { AttachFile, Forum, Visibility } from '@mui/icons-material';
import { Avatar, AvatarGroup, Box, Tooltip, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import TableComponent from '../components/TableComponent';
import TheFullPageLoader from '../components/TheFullPageLoader';
import { fetchListTaskNew } from '../stores/tasks/fetchListTaskNewSlice';
import { showErrorMsg, stringAvatar } from '../utils/others';

function MessageCenterEventsTable() {
  const dispatch = useDispatch();
  const [tasks, setTasks] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(2);
  const { t } = useTranslation();

  const taskListLoading = useSelector((state) => state?.fetchListTaskNew?.loading ?? false);

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

  useEffect(() => {
    handleFetchListTaskNew();
  }, []);

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

  const avatarCommonStyle = { width: 24, height: 24 };
  // const whoSentAvatarProps = stringAvatar(messageDetails.who_sent_name, {
  //   ...avatarCommonStyle,
  //   bgcolor: 'primary.main'
  // });

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

  const tableColumns = [
    {
      field: 'status',
      headerName: '',
      type: 'string',
      cellRenderer: (params) => {
        return getRandomSquareIcon();
      }
    },
    {
      field: 'task_title',
      headerName: t('task_name'),
      width: 150,
      type: 'string'
    },
    {
      field: 'created_by',
      headerName: 'Created By',
      width: 100,
      type: 'string'
    },
    {
      field: 'responsibles',
      headerName: 'Responsibles',
      width: 100,
      type: 'string',
      cellRenderer: renderResponsibles
    },
    {
      field: 'reviewers',
      headerName: 'Reviewers',
      width: 100,
      type: 'string',
      cellRenderer: renderResponsibles
    },
    {
      field: 'id',
      headerName: '',
      flex: 1, // Adjusts width dynamically
      minWidth: 180, // Optional: sets the minimum width
      maxWidth: 250,
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
              Feb 16
              <Box display="flex" alignItems="center">
                <Visibility />
                <Typography variant="body2" color="textSecondary">
                  {Math.floor(Math.random() * 90) + 1}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Forum />
                <Typography variant="body2" color="textSecondary">
                  {Math.floor(Math.random() * 90) + 1}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <AttachFile />
                <Typography variant="body2" color="textSecondary">
                  {Math.floor(Math.random() * 90) + 1}
                </Typography>
              </Box>
            </Box>
          </Box>
        );
      }
    },
    {
      field: 'jan',
      headerName: 'JAN',
      type: 'string',
      cellRenderer: (params) => {
        return <div>4 {getRandomCircleIcon()}</div>;
      }
    },
    {
      field: 'feb',
      headerName: 'FEB',
      type: 'string',
      cellRenderer: (params) => {
        return <div>6 {getRandomCircleIcon()}</div>;
      }
    },
    {
      field: 'mar',
      headerName: 'MAR',
      type: 'string',
      cellRenderer: (params) => {
        return <div>6 {getRandomCircleIcon()}</div>;
      }
    },
    {
      field: 'apr',
      headerName: 'APR',
      type: 'string',
      cellRenderer: (params) => {
        return <div>7 {getRandomCircleIcon()}</div>;
      }
    },
    {
      field: 'may',
      headerName: 'MAY',
      type: 'string',
      cellRenderer: (params) => {
        return <div>7 {getRandomCircleIcon()}</div>;
      }
    },
    {
      field: 'jun',
      headerName: 'JUN',
      type: 'string',
      cellRenderer: (params) => {
        return <div>1 {getRandomCircleIcon()}</div>;
      }
    },
    {
      field: 'jul',
      headerName: 'JUL',
      type: 'string',
      cellRenderer: (params) => {
        return <div>9 {getRandomCircleIcon()}</div>;
      }
    },
    {
      field: 'aug',
      headerName: 'AUG',
      type: 'string',
      cellRenderer: (params) => {
        return <div>3 {getRandomCircleIcon()}</div>;
      }
    },
    {
      field: 'sep',
      headerName: 'SEP',
      type: 'string',
      cellRenderer: (params) => {
        return <div>8 {getRandomCircleIcon()}</div>;
      }
    },
    {
      field: 'oct',
      headerName: 'OCT',
      type: 'string',
      cellRenderer: (params) => {
        return <div>4 {getRandomCircleIcon()}</div>;
      }
    },
    {
      field: 'nov',
      headerName: 'NOV',
      type: 'string',
      cellRenderer: (params) => {
        return <div>1 {getRandomCircleIcon()}</div>;
      }
    },
    {
      field: 'dec',
      headerName: 'DEC',
      type: 'string',
      cellRenderer: (params) => {
        return <div>1 {getRandomCircleIcon()}</div>;
      }
    }
  ];

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
        <TableComponent rowData={tasks} columnDefs={tableColumns} />
      )}
    </Box>
  );
}

export default MessageCenterEventsTable;
