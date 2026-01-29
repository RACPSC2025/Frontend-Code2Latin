import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import ContentPasteOffIcon from '@mui/icons-material/ContentPasteOff'; // Replace with your icon path

const moduleToMessageKeyMapping = {
  messages: {
    list: {
      titleKey: 'emptyMessageTitle',
      descKey: 'emptyMessageDesc'
    },
    details: {
      titleKey: 'emptyMessageDetailsTitle',
      descKey: 'emptyMessageDetailsDesc'
    }
  },
  events: {
    event_list: {
      titleKey: 'emptyEventTitle',
      descKey: 'emptyEventDesc'
    }
  },
  actions: {
    comment_list: {
      titleKey: 'emptyActionCommentTitle',
      descKey: 'emptyActionCommentDesc'
    }
  }
};

function EmptyStateComponent({ module, section }) {
  const { titleKey, descKey } = moduleToMessageKeyMapping[module][section];
  const { t } = useTranslation();
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={2}
      m={2}
    >
      <ContentPasteOffIcon sx={{ fontSize: 100 }} />
      <Typography variant="h6" color="textSecondary">
        {t(titleKey)}
      </Typography>
      <Typography variant="body1" color="textSecondary">
        {t(descKey)}
      </Typography>
    </Box>
  );
}

export default EmptyStateComponent;
