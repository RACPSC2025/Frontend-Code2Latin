import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import { useTranslation } from 'react-i18next';

const MiTabla = ({ data }) => {
  const { t } = useTranslation();

  const rows = [
    { label: 'ID', value: data.id_requisito },
    { label: t('type'), value: data.requisito_general_tipo },
    { label: t('concept'), value: data.concept },
    { label: t('number'), value: data.numero },
    { label: t('document_name'), value: data.nombre },
    { label: t('date_of_issue'), value: data.fecha_expedicion },
    { label: t('date_of_entry_into_force'), value: data.fecha_ejecutoria },
    { label: t('descriptor'), value: data.descripcion },
    { label: t('document_type'), value: '' },
    { label: t('related_standard_or_aa'), value: '' },
    { label: t('authority_issuing_the_certificate'), value: data.emitidopor },
    { label: t('environmental_component'), value: data.id_tema_requisito }
  ];

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
            <TableCell><strong>{t('field')}</strong></TableCell>
            <TableCell><strong>{t('value')}</strong></TableCell>
          {rows.map((row, index) => (
            <TableRow
              key={row.label}
              sx={{
                backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white' , // Alterna los colores (blanco y gris claro)
              }}
            >
              <TableCell>{row.label}</TableCell>
              <TableCell>{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MiTabla;
