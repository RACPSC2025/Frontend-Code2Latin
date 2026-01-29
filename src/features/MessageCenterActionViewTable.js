import CommentIcon from '@mui/icons-material/Comment';
import EditIcon from '@mui/icons-material/Edit';
import { Badge, Box, Chip, IconButton } from '@mui/material';
import TableComponent from '../components/TableComponent';
import { formatDayjs } from '../utils/dateTimeFunctions';
import { COLUMN_TYPES, COLUMN_TYPE_TO_WIDTH_MAPPING } from './config/table';

const MessageCenterActionViewTable = ({
  actions,
  actionStatus,
  columnConfig,
  isFetching,
  onClickTableAction
}) => {
  // Define the columns for the Data Grid
  const getFinalColumnConfig = (columnConfig, width = 1560) => {
    const finalColumms = [];
    const actionColumnWidth = getAbsoluteColumnWidth(COLUMN_TYPES.ACTIONS, width);
    let remainingWidth = width - actionColumnWidth;
    let isColumnWidthAcceptable = false;

    const skippedColumns = ['action_status', 'responsible_person', 'action_created_by', 'nb_pais'];

    for (let i = 0; i < columnConfig.length; i++) {
      if (skippedColumns.includes(columnConfig[i]['field'])) continue;

      const { column_type, ...restColumnConfig } = columnConfig[i];

      const columnWidth = getAbsoluteColumnWidth(column_type, width);
      remainingWidth = remainingWidth - columnWidth;

      isColumnWidthAcceptable =
        remainingWidth > 0 ||
        (remainingWidth < 0 && columnWidth + remainingWidth >= columnWidth * 0.75);

      if (!isColumnWidthAcceptable) break;

      restColumnConfig.width = columnWidth;

      finalColumms.push({
        column_type: i === 0 ? COLUMN_TYPES.ID_WITH_STATUS : column_type,
        ...restColumnConfig,
        cellRenderer: (params) => {
          return getTableDefaultCellRenderer(params);
        }
      });

      if (remainingWidth < 0) break;
    }

    finalColumms.push({
      field: '',
      column_type: COLUMN_TYPES.ACTIONS,
      headerName: 'Actions',
      flex: 1,
      cellRenderer: (params) => {
        return getTableDefaultCellRenderer(params);
      }
    });

    return finalColumms;
  };

  const getAbsoluteColumnWidth = (columnType, totalAbsoluteWidth) => {
    const relativeWidthPercent = COLUMN_TYPE_TO_WIDTH_MAPPING[columnType] || 10;
    return Math.floor(totalAbsoluteWidth * (relativeWidthPercent / 100));
  };

  const getTableDefaultCellRenderer = (params) => {
    const {
      colDef: { column_type },
      data,
      value
    } = params;

    switch (column_type) {
      case COLUMN_TYPES.DATE:
        return !value ? '-' : formatDayjs(value, 'DD MMMM YYYY');
      case COLUMN_TYPES.ID_WITH_STATUS: {
        const { color_code } = actionStatus[data.action_status] || {};
        return (
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
        );
      }
      case COLUMN_TYPES.STATUS: {
        const { color_code, label } = actionStatus[value] || {};
        return (
          <Chip label={label} size="small" sx={{ backgroundColor: color_code, color: 'white' }} />
        );
      }
      case COLUMN_TYPES.ACTIONS:
        return (
          <>
            <Badge
              badgeContent={data.comments_count}
              color="info"
              invisible={parseInt(data.comments_count) === 0}
              overlap="circular"
            >
              <IconButton
                aria-label="comment"
                onClick={(event) => {
                  event.stopPropagation();
                  onClickTableAction(data, 'view_comment');
                }}
              >
                <CommentIcon />
              </IconButton>
            </Badge>
            <IconButton
              aria-label="edit"
              sx={{ ml: 1 }}
              onClick={(event) => {
                event.stopPropagation();
                onClickTableAction(data, 'view_action');
              }}
            >
              <EditIcon />
            </IconButton>
          </>
        );
      default:
        return value;
    }
  };

  return (
    <Box sx={{ height: '100%', width: '100%', bgcolor: 'background.paper', p: 2 }}>
      {isFetching ? (
        <TableComponent isLoading={isFetching} />
      ) : (
        <TableComponent
          rowData={actions}
          columnDefs={getFinalColumnConfig(columnConfig)}
          pageOption={[20, 50, 100]}
          perPage={20}
        />
      )}
    </Box>
  );
};

export default MessageCenterActionViewTable;
