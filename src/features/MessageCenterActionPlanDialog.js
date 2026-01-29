import { Box, Button, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import TableComponent from '../components/TableComponent';
import { fetchActionFormFields } from '../stores/actions/fetchActionFormFieldsSlice';
import { getActionLogtask } from '../stores/actions/getActionLogtaskSlice';
import { convertString } from '../utils/others';

const MessageCenterActionPlanDialog = ({ task = 0 }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [actionPlanData, setActionPlanData] = useState([]);
  const [formTabItems, setFormTabItems] = useState([]);
  const [formFields, setFormFields] = useState([]);

  const actionPlanTableColumns = [
    {
      field: 'action_id',
      headerName: 'ID de la acción',
      width: 100,
      type: 'string'
    },
    {
      field: 'module_id',
      headerName: 'ID del módulo',
      width: 100,
      type: 'string'
    },
    {
      field: 'action_category',
      headerName: 'Categoría de la acción',
      width: 100,
      type: 'string'
    },
    {
      field: 'action_start_date',
      headerName: 'Fecha de inicio',
      width: 100,
      type: 'string'
    },
    {
      field: 'action_closing_date',
      headerName: 'Fecha propuesta de cierre',
      width: 100,
      type: 'string'
    },
    {
      field: 'action_status',
      headerName: 'Estado de la acción',
      width: 200,
      type: 'string'
    },
    {
      field: 'responsible_person',
      headerName: 'Responsable',
      width: 200,
      type: 'string'
    },
    {
      field: 'reviewer_person',
      headerName: 'Revisor',
      width: 200,
      type: 'string'
    },
    {
      field: 'real_closing_date',
      headerName: 'Fecha de cierre real',
      width: 200,
      type: 'string'
    },
    {
      field: 'why_description',
      headerName: 'Descripción de por qué',
      width: 200,
      type: 'string'
    },
    {
      field: 'what_description',
      headerName: 'Descripción de qué',
      width: 200,
      type: 'string'
    },
    {
      field: 'how_description',
      headerName: 'Descripción de cómo',
      width: 200,
      type: 'string'
    },
    {
      field: 'comment_count',
      headerName: 'Comentarios',
      width: 200,
      type: 'string'
    },
    {
      field: 'action_status',
      headerName: 'Estado',
      width: 200,
      type: 'string'
    }
  ];

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

  const handleGetActionLogtask = () => {
    const formData = { logtask_id: task.id };
    let actionPlanIdCounter = 0;
    dispatch(getActionLogtask(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const actionPlanData = data?.payload?.data.map((item) => ({
          ...item,
          id: actionPlanIdCounter++
        }));
        setActionPlanData(actionPlanData);
      }
    });
  };

  useEffect(() => {
    handleFetchFormFields();
    handleGetActionLogtask();
  }, []);

  return (
    <>
      <Box marginBottom="20px">
        <Typography variant="h4" align="center" sx={{ my: '10px' }}>
          Plan de Acción
        </Typography>
        <TableComponent
          rowData={actionPlanData}
          columnDefs={actionPlanTableColumns}
          pagination={false}
        />

        {/* <DataGrid
          rows={actionPlanData}
          columns={actionPlanTableColumns}
          // pageSize={5}
          hideFooter={true}
          autoHeight={true}
        /> */}
      </Box>
      <Button
        variant="contained"
        color="warning"
        size="large"
        marginTop="40px"
        // onClick={() => dispatch(toggleShouldCreateNewAction({ status: true }))}
      >
        + {t('CreateAction')}
      </Button>
    </>
  );
};

export default MessageCenterActionPlanDialog;
