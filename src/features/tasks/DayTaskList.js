import { Box, List, ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import BaseEmptyState from '../../components/BaseEmptyState';

export default function DayTaskList({ eventList = [], eventClick = () => {} }) {
  const { t } = useTranslation();
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
      <Box sx={{ height: '50px', p: 1, borderBottom: 1, borderColor: 'grey.300' }}>
        <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
          {t('tasks_for_the_day')}
        </Typography>
      </Box>
      {eventList.length > 0 && (
      <List sx={{ width: '100%' }}>
        {eventList.map((singleEvent) => (
          <ListItem key={singleEvent.id} disablePadding>
            <ListItemButton sx={{ display: 'flex' }} onClick={() => eventClick(singleEvent)}>
              <Typography variant="subtitle2" sx={{ mr: 2 }}>
                {singleEvent.time_of_event}
              </Typography>
              <ListItemText primary={singleEvent.description} secondary={singleEvent.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      )}
      {eventList.length === 0 && (
        <BaseEmptyState module="events" section="event_list" />
      )}
    </Box>
  );
}
