import React from 'react';
import { Box, Typography, Divider, Avatar } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PersonIcon from '@mui/icons-material/Person';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import SouthAmericaIcon from '@mui/icons-material/SouthAmerica';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FlagIcon from '@mui/icons-material/Flag';
import MapsHomeWorkIcon from '@mui/icons-material/MapsHomeWork';
import BusinessIcon from '@mui/icons-material/Business';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckIcon from '@mui/icons-material/Check';
import dayjs from 'dayjs';

import { useTranslation } from 'react-i18next';
import { TaskAlt } from '@mui/icons-material';

export default function MessageCenterEventInfo({ event }) {
  // Make sure to return the JSX

  const { t } = useTranslation();

  let color;
  switch (event.en_status) {
    case 'delayed':
      color = 'red';
      break;
    case 'completed':
      color = 'green';
      break;
    case 'pending':
      color = 'orange';
      break;
    default:
      color = 'blue';
  }
  return (
    <Box>
      <Box display="flex" alignItems="center" my={2}>
        {/*
        <TaskAltIcon sx={{ mr: 1 }} />
        <Typography variant="h5">{t('taskTitle')}</Typography>
        */}
      </Box>

      <Typography variant="body1" component="span">
        {event.title}
      </Typography>
      <Box display="flex" alignItems="center" my={2}>
        <ArticleOutlinedIcon sx={{ mr: 1 }} />
        <Typography variant="h5" margin="10px 0">
          {t('taskDescription')}
        </Typography>
      </Box>
      <Typography variant="h7">{event.description}</Typography>
      <Divider sx={{ my: 1 }} />

      {/* Status */}
      <Box display="flex" alignItems="center" flexGrow={1}>
        <TaskAltIcon sx={{ mr: 1, color: { color } }} fontSize="medium" />
        <Typography variant="body1" component="span" fontWeight="medium">
          {t('Status')}: {event.status}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />

      {/* Date and Time with Clock Icon */}
      <Box display="flex" alignItems="center">
        <AccessTimeIcon sx={{ mr: 1 }} />
        <Typography variant="h7" component="span">
          {dayjs(event.date).format('DD MMMM YYYY')} {t('At')} {event.time_of_event}
        </Typography>
      </Box>

      {/* Description with Info Icon */}
      <Divider sx={{ my: 1 }} />

      {/* Microsoft Teams Meeting with Location Icon */}
      <Box display="flex" my={2}>
        <PlaceOutlinedIcon sx={{ mr: 1 }} />
        <Typography variant="body1" component="span">
          {t('microsoft_teams_meeting')}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />

      {/* Invited by with Avatar Icon */}
      <Box display="flex" alignItems="center" my={2}>
        <Avatar sx={{ width: 24, height: 24, mr: 1 }}>
          <PersonIcon />
        </Avatar>
        <Typography variant="body1" component="span">
          {event.invited_by.name} {t('invited_you')}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />

      {/* Executioner Name */}
      <Box display="flex" alignItems="center" flexGrow={1}>
        <ManageAccountsIcon sx={{ mr: 1 }} />
        <Typography variant="body1" component="span">
          {t('Executioner')}: {event.executioner}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />

      {/* Reviewer Name */}
      <Box display="flex" alignItems="center" flexGrow={1}>
        <RateReviewIcon sx={{ mr: 1 }} />
        <Typography variant="body1" component="span">
          {t('Reviewer')}: {event.reviewer}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />

      {/* Region */}
      <Box display="flex" alignItems="center" flexGrow={1}>
        <SouthAmericaIcon sx={{ mr: 1 }} />
        <Typography variant="body1" component="span">
          {t('Region')}: {event.region}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />

      {/* Business */}
      <Box display="flex" alignItems="center" flexGrow={1}>
        <BusinessIcon sx={{ mr: 1 }} />
        <Typography variant="body1" component="span">
          {t('Business')}: {event.business}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />

      {/* Country */}
      <Box display="flex" alignItems="center" flexGrow={1}>
        <FlagIcon sx={{ mr: 1 }} />
        <Typography variant="body1" component="span">
          {t('Country')}: {event.country}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />

      {/* Plant */}
      <Box display="flex" alignItems="center" flexGrow={1}>
        <MapsHomeWorkIcon sx={{ mr: 1 }} />
        <Typography variant="body1" component="span">
          {t('Plant')}: {event.plant}
        </Typography>
      </Box>
      <Divider sx={{ my: 1 }} />
    </Box>
  );
}
