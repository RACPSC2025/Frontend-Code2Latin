export const COLUMN_TYPES = {
  NUMBER: 'number',
  TEXT: 'text',
  DATE: 'date',
  STATUS: 'status',
  LONG_TEXT: 'long_text',
  ACTIONS: 'actions',
  ID_WITH_STATUS: 'id_with_status'
};

export const COLUMN_TYPE_TO_WIDTH_MAPPING = {
  [COLUMN_TYPES.NUMBER]: '7',
  [COLUMN_TYPES.TEXT]: '12',
  [COLUMN_TYPES.DATE]: '10',
  [COLUMN_TYPES.STATUS]: '10',
  [COLUMN_TYPES.LONG_TEXT]: '15',
  [COLUMN_TYPES.ACTIONS]: '10',
  [COLUMN_TYPES.ID_WITH_STATUS]: '7'
};
