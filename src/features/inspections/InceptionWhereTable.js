import { MoreVert } from '@mui/icons-material';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalStorageData } from '../../utils/others';
import InceptionTableModal from './InceptionTableModal';
import InspectionSpreadSheet from './InspectionSpreadSheet';

export default function InceptionWhereTable({ setActiveTab = () => {} }) {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(null);

  const locations = getLocalStorageData('INSPECTION_LOCATIONS') || [];

  const [rowData, setRowData] = useState(
    locations.map((location) => ({
      id: location.id,
      where: location.name,
      when: [],
      who: []
    }))
  );

  const columnDefs = [
    { field: 'where', headerName: 'Where' },
    {
      field: 'when',
      headerName: 'When',
      cellRenderer: (params) => (
        <RowCell
          values={params?.value}
          onEdit={() => {
            setSelectedRowId(params.node.data.id);
            setModalType('when');
            setIsModalOpen(true);
          }}
          valueKey="date"
        />
      )
    },
    {
      field: 'who',
      headerName: 'Who',
      cellRenderer: (params) => (
        <RowCell
          values={params?.value}
          onEdit={() => {
            setSelectedRowId(params?.node?.data?.id);
            setModalType('who');
            setIsModalOpen(true);
          }}
          valueKey="name"
        />
      )
    }
  ];

  const handleModalSubmit = (value) => {
    if (!selectedRowId) return;

    setRowData((prev) =>
      prev.map((row) =>
        row.id === selectedRowId
          ? {
              ...row,
              [modalType]: [
                ...row[modalType],
                { id: Date.now(), [modalType === 'when' ? 'date' : 'name']: value }
              ]
            }
          : row
      )
    );
  };

  return (
    <>
      <Box sx={{ mt: 3 }}>
        {/* <TableComponent rowData={rowData} columnDefs={columnDefs} autoHeight /> */}
        <InspectionSpreadSheet rowData={locations} columnDefs={columnDefs} />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', margin: '20px 0', gap: 1.5 }}>
        <Button color="primary" variant="outlined" onClick={() => setActiveTab((prev) => prev - 1)}>
          {t('Back')}
        </Button>
        <Button color="primary" variant="contained" onClick={() => {}}>
          {t('Finish')}
        </Button>
      </Box>

      <InceptionTableModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalType={modalType}
        handleSubmit={handleModalSubmit}
      />
    </>
  );
}

const RowCell = ({ values, onEdit, valueKey }) => (
  <Box sx={{ width: '30rem', display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
    <Box sx={{ flex: 1 }}>
      {values?.map((item) => (
        <Typography key={item.id} sx={{ width: '8rem', my: '1px' }}>
          {item[valueKey]}
        </Typography>
      ))}
    </Box>
    <IconButton color="primary" onClick={onEdit}>
      <MoreVert />
    </IconButton>
  </Box>
);
