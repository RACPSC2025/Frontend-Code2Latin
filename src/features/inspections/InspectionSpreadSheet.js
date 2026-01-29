import { Box, Button } from '@mui/material';
import jspreadsheet from 'jspreadsheet-ce';
import 'jspreadsheet-ce/dist/jspreadsheet.css';
import 'jsuites/dist/jsuites.css';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { showSuccessMsg } from '../../utils/others';

export default function InspectionSpreadSheet({ rowData = [] }) {
  const { t } = useTranslation();
  const tableRef = useRef(null);
  const instanceRef = useRef(null);
  const [sheetData, setSheetData] = useState([]);

  const mainColumn = [
    [
      { title: t('where'), colspan: '5' },
      { title: t('when'), colspan: '3' },
      { title: t('who'), colspan: '3' }
    ]
  ];

  const headersColumn = [
    { type: 'text', title: t('country'), width: 130 },
    { type: 'text', title: t('company'), width: 130 },
    { type: 'text', title: t('department'), width: 130 },
    { type: 'text', title: t('city'), width: 130, readOnly: true },
    { type: 'text', title: t('district'), width: 130 },
    { type: 'calendar', title: t('expiration_date'), width: 130 },
    { type: 'text', title: t('every'), width: 130 },
    { type: 'calendar', title: t('final_date'), width: 130 },
    { type: 'text', title: t('resources'), width: 130 },
    { type: 'text', title: t('responsibles'), width: 130 },
    { type: 'text', title: t('Contractor'), width: 130 }
  ];

  const handleSave = () => {
    if (!instanceRef.current) return;
    localStorage.setItem('SPREADSHEET_DATA', JSON.stringify(instanceRef.current.getData()));
    showSuccessMsg('Sheet saved successfully.');
  };

  // Sync rowData with localStorage and remove invalid rows
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('SPREADSHEET_DATA')) || [];
    const cityNames = new Set(rowData.map((row) => row.name));

    let updatedData = savedData.filter((row) => cityNames.has(row[3])); // Keep only valid rows

    // Add missing rows from rowData
    rowData.forEach((row) => {
      if (!updatedData.some((savedRow) => savedRow[3] === row.name)) {
        updatedData.push(new Array(11).fill('').map((_, i) => (i === 3 ? row.name : '')));
      }
    });

    // Ensure correct order based on rowData
    updatedData = rowData.map(
      (row) => updatedData.find((savedRow) => savedRow[3] === row.name) || []
    );

    setSheetData(updatedData);
    localStorage.setItem('SPREADSHEET_DATA', JSON.stringify(updatedData));
  }, [rowData]);

  useEffect(() => {
    if (!tableRef.current) return;

    if (instanceRef.current) instanceRef.current.destroy();

    instanceRef.current = jspreadsheet(tableRef.current, {
      data: sheetData,
      nestedHeaders: mainColumn,
      columns: headersColumn,
      minDimensions: [11, sheetData.length || 5]
    });
  }, [sheetData, t]);

  return (
    <Box sx={{ width: '100%', marginTop: 2, marginBottom: 1 }}>
      <Button variant="contained" color="primary" onClick={handleSave}>
        Save Sheet
      </Button>
      <Box ref={tableRef} className="jexcel-container" sx={{ marginTop: 2 }} />
    </Box>
  );
}
