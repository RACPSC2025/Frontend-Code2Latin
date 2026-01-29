import { useEffect, useRef, useState } from 'react';
import {
  Box,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  OutlinedInput,
  Chip,
  ListItemText,
  Checkbox,
  Button,
  GlobalStyles
} from '@mui/material';

import TablePaginationComponent from './TablePaginationComponent';
import { AllCommunityModule, ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
//import "ag-grid-community/styles/ag-grid.css";
//import "ag-grid-community/styles/ag-theme-alpine.css";
import { useTranslation } from 'react-i18next';
import { isValidArray } from '../utils/others';

import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAutocompleteOptions,
  removeAllFilters,
  removeFilter,
  selectFilterItemValue,
  selectListOptions,
  setFilter
} from '../stores/filterSlice';

import { agGridLocaleEs } from '../lib/agGridLocaleEs';
//import { useLanguage } from './LanguageProvider';
import { useLanguage } from '../providers/languageProvider';


//import "ag-grid-community/styles/ag-grid.css";
//import "ag-grid-community/styles/ag-theme-alpine.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule, ClientSideRowModelModule]);

export default function TableComponent({
  rowData = [],
  columnDefs = [],
  totalRecord = 0,
  editable = false,
  resizable = true,
  movable = false,
  sortable = true,
  filterable = false,
  selectionColumn = false,
  singleSelection = false,
  pagination = true,
  perPage = 10,
  pageOption = [10, 20, 50, 100],
  pinnedColumn = [],
  isLoading = false,
  autoHeight = false,
  paginationLegendElement = null,
  onCellValueChanged = () => {},
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();

  const getLocale = (lang) => {
    switch (lang) {
      case 'es':
        return agGridLocaleEs;
      case 'en':
        return {};
      default:
        return {};
    }
  };

  const [gridApi, setGridApi] = useState(null);
  const gridRef = useRef();

  // Status for visible columns
  const [visibleColumns, setVisibleColumns] = useState(columnDefs.map((col) => col.field));
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(perPage);
  const [pageSize, setPageSize] = useState(pageOption[0]);

  const updatePaginationInfo = () => {
    if (gridRef.current) {
      const pageCount = gridRef.current.api.paginationGetTotalPages();
      setTotalPages(pageCount);
      setCurrentPage(gridRef.current.api.paginationGetCurrentPage() + 1);
    }
  };

  const goToPage = (page) => {
    if (gridRef.current) {
      gridRef.current.api.paginationGoToPage(page - 1);
      setCurrentPage(page);
    }
  };

  // Large text configuration (for columns with 'largeText' property)
  const largeTextConfig = {
    cellEditor: 'agLargeTextCellEditor',
    cellEditorPopup: true,
    cellEditorParams: {}
  };

  // Filter visible columns
  const filteredColumnDefs = columnDefs
    .filter((col) => visibleColumns.includes(col.field))
    .map((col) => ({
      ...col,
      headerName: t(col.field, { defaultValue: col?.headerName }),
      ...(col?.largeText ? largeTextConfig : {}),
      children: col?.children?.map((child) => ({
        ...child,
        headerName: t(child?.field, { defaultValue: child?.headerName })
      }))
    }));

  // Handling column selection
  const handleChange = (event) => {
    setVisibleColumns(event.target.value);
  };

  const gridOptions = {
    loading: isLoading,
    loadingOverlayComponent: CircularProgress,
    loadingOverlayComponentParams: {},
    defaultColGroupDef: { headerClass: 'group-ag-header' },
    getRowClass: () => 'default-ag-header',
    defaultColDef: {
      ...(isValidArray(pinnedColumn) && { minWidth: 80 }),
      //flex: 1,
      headerClass: 'row-ag-class',
      cellStyle: {
        textAlign: 'left',
        padding: 0,
        color: 'rgb(55 65 81 / var(--tw-bg-opacity, 1))',
        justifyContent: 'left',
        paddingLeft: '8px',
        paddingRight: '8px',
        //minWidth: '50px',
        userSelect: 'text'
      },
      wrapText: autoHeight,
      autoHeight: autoHeight,
      //autoHeight: '60px',
      editable: editable,
      //resizable: resizable,
      resizable: true,
      suppressMovable: !movable,
      sortable: sortable,
      filter: filterable,
      headerStyle: {
        fontFamily: `'Roboto', 'Arial', sans-serif`
        //fontSize: '14px'
      }
    },
    //domLayout: 'autoHeight',
    //domLayout: 'normal',
    stopEditingWhenCellsLoseFocus: true,
    singleClickEdit: true,
    pagination: pagination,
    //paginationPageSize: perPage,
    paginationPageSize: pageSize,
    paginationPageSizeSelector: pageOption,
    headerHeight: pinnedColumn.length > 0 ? 40 : 50,
    rowHeight: 50,
    ...(selectionColumn ? { rowSelection: singleSelection ? 'singleRow' : 'multiRow' } : {})
  };

  useEffect(() => {
    const newVisibleColumns = columnDefs.map((col) => col.field);
    // Only update if the arrays are different
    if (JSON.stringify(newVisibleColumns) !== JSON.stringify(visibleColumns)) {
      setVisibleColumns(newVisibleColumns);
    }
  }, [columnDefs]);

  useEffect(() => {
    // Skip validation if columnDefs is empty or changing
    if (columnDefs.length === 0) return;

    // Filter out any fields that don't exist in columnDefs
    const validFields = visibleColumns.filter((field) =>
      columnDefs.some((col) => col.field === field)
    );

    // If there are invalid fields, update the state
    if (validFields.length !== visibleColumns.length) {
      setVisibleColumns(validFields);
    }
  }, [visibleColumns, columnDefs]);

  const handleRowsPerPageChange = (event) => {
    const newPerPage = event.target.value;
    setRowsPerPage(newPerPage);
    setCurrentPage(1); // Reiniciar a la primera página

    if (gridRef.current?.api) {
      //gridRef.current.api.paginationSetPageSize(newPerPage);
    }
  };

  const handlePageChange = (newPage) => {
    if (gridRef.current) {
      //gridRef.current.paginationGoToPage(newPage - 1); // ag-Grid usa índice base 0
      gridRef.current.api.paginationGoToPage(newPage - 1); // ag-Grid usa índice base 0
      setCurrentPage(newPage);
    }
  };

  const defaultColDef = {
    flex: 1,
    minWidth: 150,
    filter: true, // ✅ Aplica filtros en todas las columnas con 'field'
    suppressHeaderMenuButton: true,
    suppressHeaderContextMenu: true,
    autoSizeStrategy: {
      type: 'fitGridWidth' // Ajusta el ancho de las columnas automáticamente
    }
  };

  /*
  const onCellValueChanged = (params) => {
    // Evita modificar directamente el objeto original si es inmutable
    const updatedRow = { ...params.data, [params.colDef.field]: params.newValue };

    // Si manejas el rowData con useState fuera de este componente:
    // - deberías recibir `setRowData` como prop
    // - y hacer algo como esto:
    // setRowData(prevData => prevData.map(row => row.id === updatedRow.id ? updatedRow : row));

    console.log('Fila actualizada:', updatedRow);
  };
  */

  const onPageSizeChanged = (event) => {
    setPageSize(Number(event.target.value));
  };

  const getCurrentPage = () => {
    if (gridApi) {
      return gridApi.paginationGetCurrentPage() + 1;
    }
    return 1;
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
    gridRef.current.api = params.api;
    updatePaginationInfo();
    params.api.autoSizeAllColumns();
    setTotalPages(params.api.paginationGetTotalPages());
    setTotalRows(params.api.getDisplayedRowCount());

    /*
    if (gridRef.current?.api) {
      //gridRef.current.api.paginationSetPageSize(rowsPerPage);
      setTotalPages(gridRef.current.api.paginationGetTotalPages());
    }
    */
  };

  /*
  const onGridReady = (params) => {
    gridRef.current.api = params.api;
    updatePaginationInfo();

    // Autoajustar el tamaño de las columnas después de renderizar
    const allColumnIds = params.columnApi.getAllColumns().map(col => col.getId());
    params.columnApi.autoSizeColumns(allColumnIds);
  };
  */

  /*
  const onGridReady = (params) => {
    gridRef.current = params.api; // Guardamos la API de la tabla
    //params.api.sizeColumnsToFit();
    params.api.autoSizeAllColumns(); // Ajustamos las columnas al contenido
  };
  */

  /*
  useEffect(() => {
    if (gridRef.current) {
      const totalRows = rowData.length;
      setTotalPages(Math.ceil(totalRows / perPage));
    }
  }, [rowData, perPage]);
  */

  // const updatedColumnDefs = columnDefs.map((col) => {
  //   const isPinned = pinnedColumn.includes(col.field);
  //   return {
  //     ...col,
  //     //headerName: t(col?.headerName),
  //     //pinned: isPinned ? 'left' : undefined,
  //     children: col?.children?.map((child) => ({
  //       ...child,
  //       headerName: t(child?.headerName)
  //     }))
  //     //...(col?.largeText ? largeTextConfig : {}),
  //     //resizable: true
  //   };
  // });

  // Handling changes to checkboxes
  // const toggleColumnVisibility = (field) => {
  //   setVisibleColumns((prevColumns) =>
  //     prevColumns.includes(field)
  //       ? prevColumns.filter((col) => col !== field)
  //       : [...prevColumns, field]
  //   );
  // };

  const selectedColumns =
    useSelector((state) => selectFilterItemValue(state, 'task', 'selectedColumns')) || false;

    
  // 🔹 Exportar CSV directamente (función de AG Grid)
  const exportCSV = () => {
    gridRef.current.api.exportDataAsCsv({ fileName: "datos.csv" });
  };

  // 🔹 Exportar a Excel generando desde el CSV
  const exportExcel = () => {
    // 1. Obtener CSV en memoria
    const csv = gridRef.current.api.getDataAsCsv();

    // 2. Leer CSV como workbook
    const workbook = XLSX.read(csv, { type: "string" });

    // 3. Obtener la primera hoja
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];

    // 4. Crear un nuevo libro y agregar la hoja
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, worksheet, "Datos");

    // 5. Guardar como Excel
    XLSX.writeFile(newWorkbook, "datos.xlsx");
  };

  //const exportExcelWithTemplatePrevious = async (gridRef) => {
  const exportExcelWithTemplatePrevious = async () => {
    
    const csv = gridRef.current.api.getDataAsCsv({
      columnSeparator: ",",
      suppressQuotes: false,
    });
    /*
    const selectedColumns = ["name", "status", "reviewer_person_name"];
    const csv = gridRef.current.api.getDataAsCsv({
      columnKeys: selectedColumns,
    });
    */

    // 2. Leer CSV en workbook temporal
    const tempWorkbook = XLSX.read(csv, { type: "string" });
    const tempSheet = tempWorkbook.Sheets[tempWorkbook.SheetNames[0]];
    let jsonData = XLSX.utils.sheet_to_json(tempSheet, { header: 1 });

    // 3. Separar encabezados y filas de datos
    const headers = jsonData[0]; // encabezados de AG Grid
    const rows = jsonData.slice(1); // datos

    // 4. Cargar plantilla
    //const response = await fetch("/template.xlsx");
    //const response = await fetch("/assets/templates/template.xlsx");
    const response = await fetch(process.env.PUBLIC_URL + "/assets/templates/template.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const templateWorkbook = XLSX.read(arrayBuffer, { type: "array" });

    const sheetName = templateWorkbook.SheetNames[0];
    const sheet = templateWorkbook.Sheets[sheetName];

    // 5. Sobrescribir encabezados en fila 6 (sin perder estilo de celdas)
    XLSX.utils.sheet_add_aoa(sheet, [headers], { origin: "A6" });

    // 6. Agregar datos desde fila 7
    XLSX.utils.sheet_add_aoa(sheet, rows, { origin: "A7" });

    // 7. Descargar Excel final
    XLSX.writeFile(templateWorkbook, "reporte.xlsx");
  };

  const exportExcelWithTemplate = async () => {
    // 1. Generar CSV desde AG Grid
    const csv = gridRef.current.api.getDataAsCsv({
      columnSeparator: ",",
      suppressQuotes: false,
    });

    // Parsear CSV manualmente
    const rows = csv.split("\n").map((row) => row.split(","));
    const headers = rows[0]; // primera fila => encabezados de AG Grid
    const data = rows.slice(1); // resto => datos

    // 2. Cargar plantilla
    const response = await fetch(process.env.PUBLIC_URL + "/assets/templates/template.xlsx");
    const arrayBuffer = await response.arrayBuffer();

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);

    // 3. Usar la primera hoja de la plantilla
    const worksheet = workbook.worksheets[0];

    // 4. Escribir encabezados en la fila 6 (sin tocar estilos previos)
    const headerRowNumber = 6;
    const headerRow = worksheet.getRow(headerRowNumber);

    headers.forEach((header, i) => {
      const cell = headerRow.getCell(i + 1);
      cell.value = header; // Sobrescribe texto, pero conserva estilos del template
    });
    headerRow.commit();

    // 5. Escribir los datos a partir de fila 7
    const startRow = headerRowNumber + 1;
    data.forEach((row, rowIndex) => {
      const excelRow = worksheet.getRow(startRow + rowIndex);
      row.forEach((value, colIndex) => {
        excelRow.getCell(colIndex + 1).value = value;
      });
      excelRow.commit();
    });

    // 6. Descargar el archivo Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "reporte.xlsx";
    link.click();
  };

  return (
    <Box
      sx={{
        //height: '100%',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Column selector with checkboxes */}
      {selectedColumns && (
        <Box sx={{ flexShrink: 0, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <FormControl sx={{ width: 300 }}>
            <InputLabel>{t('Select_columns')}</InputLabel>
            <Select
              multiple
              value={visibleColumns}
              onChange={handleChange}
              input={<OutlinedInput label={t('Select_columns')} />}
              renderValue={() => t('Selected_columns')} // Texto fijo en vez de mostrar los valores
            >
              {columnDefs.map((col) => (
                <MenuItem key={col.field} value={col.field}>
                  <Checkbox checked={visibleColumns.includes(col.field)} />
                  <ListItemText primary={col.headerName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <div className="flex items-center gap-2 mb-2 flex-row-reverse">
        {/*
        <Button variant="outlined" color="primary" onClick={exportCSV}>
          {t("csv_export")}
        </Button>
        */}

        <Button variant="outlined" color="primary" onClick={exportExcelWithTemplate}>
          {t("excel_export")}
        </Button>
      </div>

      {/* Paginador arriba */}
      <Box sx={{ flexShrink: 0, mb: 2 }}>
        <TablePaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows={totalRows}
          pageSize={pageSize}
          pageOption={pageOption}
          onPageSizeChanged={onPageSizeChanged}
          goToPage={goToPage}
          paginationLegendElement={paginationLegendElement}
        />
      </Box>

      {/* Modify the filter padding in AG Grid */}
      <GlobalStyles
        styles={{
          'input[data-ref="eInput"]': {
            paddingLeft: '2rem'
          }
        }}
      />

      {/* Table wrapper - takes remaining space */}
      <Box
        sx={{
          flexGrow: 1,
          minHeight: 0, // Important for flex child to shrink properly
          overflow: 'hidden' // Let AgGrid handle its own scrolling
        }}
      >
        <AgGridReact
          ref={gridRef}
          localeText={getLocale(language)}
          rowData={rowData}
          columnDefs={filteredColumnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={onCellValueChanged}
          //domLayout="autoHeight" // Hace que la tabla crezca según el contenido
          domLayout="normal" // Hace que la tabla crezca según el contenido
          onGridReady={onGridReady}
          pagination={pagination}
          suppressPaginationPanel={true}
          paginationPageSize={pageSize} // Se actualiza dinámicamente
          paginationPageSizeSelector={pageOption}
          onPaginationChanged={updatePaginationInfo}
          {...gridOptions}
        />
      </Box>
    </Box>
  );
}
