import React from 'react';
import { FormControl } from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useTranslation } from 'react-i18next';

export default function TablePaginationComponent({
  currentPage,
  totalPages,
  totalRows,
  pageSize,
  pageOption,
  onPageSizeChanged,
  goToPage,
  paginationLegendElement = null
}) {
  const { t } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
      }}
    >
      {/* A la izquierda */}
      <div style={{ display: 'flex', alignItems: 'center' }}>{paginationLegendElement}</div>

      {/* A la derecha */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <label className="flex items-center space-x-2 text-sm text-gray-700">
            <span>{t('Page Size')}:</span>
            <select
              onChange={onPageSizeChanged}
              value={pageSize}
              className="w-[70px] h-[30px] border border-gray-300 rounded-md px-2 py-1 text-sm 
                          focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                          bg-white shadow-sm hover:bg-gray-50"
            >
              {pageOption.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </FormControl>

        <span className="ag-paging-row-summary-panel">
          <span className="ag-paging-row-summary-panel-number">
            {1 + pageSize * (currentPage - 1)}{' '}
          </span>
          <span> {t('to')} </span>
          <span className="ag-paging-row-summary-panel-number">{pageSize * currentPage}</span>
          <span> {t('of')} </span>
          <span className="ag-paging-row-summary-panel-number">{totalRows} </span>
        </span>

        <button
          className="contents h-[1em] w-[1em]"
          onClick={() => goToPage(1)}
          disabled={currentPage === 1}
        >
          <FirstPageIcon
            className="h-[1em] w-[1em] MuiIcon-colorAction"
            disabled={currentPage === 1}
          />
        </button>
        <button
          className="contents h-[1em] w-[1em]"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ArrowBackIosNewIcon className="!h-[13px] !w-[13px]" />
        </button>
        <span>
          {t('Page')} {currentPage} {t('of')} {totalPages}
        </span>
        <button
          className="contents h-[1em] w-[1em]"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ArrowForwardIosIcon className="!h-[13px] !w-[13px]" />
        </button>
        <button
          className="contents h-[1em] w-[1em]"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <LastPageIcon className="h-[1em] w-[1em]" />
        </button>
      </div>
    </div>
  );
}
