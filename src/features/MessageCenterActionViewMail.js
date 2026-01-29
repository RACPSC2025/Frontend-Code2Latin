import React, { useState, useEffect, useRef } from 'react';

import { Box, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

import MessageCenterCardItem from './MessageCenterCardItem';
import MessageCenterActionDetails from './MessageCenterActionDetails';
import MessageCenterCarditemSkeleton from './MessageCenterCarditemSkeleton';
import MessageCenterCardDetailsSkeleton from './MessageCenterCarditemDetailsSkeleton';

import { useLanguage } from '../providers/languageProvider';
import { groupRecordsByDate } from '../utils/dateTimeFunctions';

const MessageCenterActionViewMailBox = ({
  actions,
  selectedAction,
  isFetching,
  onSelectAction,
  onRefresh,
  hasReachedEndOfList = false
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  const { language } = useLanguage();

  const targetRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        // Options (Optional)
        root: null, // null means it observes the viewport
        rootMargin: '0px',
        threshold: 0.5 // The observer will trigger when at least 50% of the target is visible
      }
    );
    observer.observe(targetRef.current);

    return () => observer.disconnect();
    
  }, []);

  useEffect(() => {
    if (isIntersecting) {
      ""
    }
    
  }, [isIntersecting]);

  const groupedactions = groupRecordsByDate(actions, 'date_of_reminder');

  const singleNotificationMessageKey = language === 'en' ? 'message_en' : 'message_es';
  const singleNotificationDescriptionKey = language === 'en' ? 'desc_en' : 'desc_es';

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', height: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          width: {
            lg: '35%', // On 1280px width, make it 40%
            xl: '40%', // On 1366px width, make it 45%
            xxl: '45%' // On 1920px width and above, make it 50%
          },
          height: '100%',
          backgroundColor: '#fff',
          borderRight: '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ position: 'absolute', right: '1px', top: '1px' }}>
          <IconButton>
            <RefreshIcon />
          </IconButton>
        </Box>

        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          {!isFetching &&
            actions.length > 0 &&
            Array.from(groupedactions).map(([dateKey, actions], idx) => {
              return (
                <Box key={dateKey} sx={{ my: 1 }}>
                  <Typography variant="body2" color="text.primary" sx={{ ml: 1, mb: 0.5 }}>
                    {dateKey}
                  </Typography>
                  {actions.map((msg) => (
                    <MessageCenterCardItem
                      key={msg.record_id}
                      reviewer={msg.reviewer_person}
                      message={msg[singleNotificationMessageKey]}
                      desc={msg[singleNotificationDescriptionKey]}
                      date={msg.date_of_completion}
                      isSelected={selectedAction && selectedAction.record_id === msg.record_id}
                      isUnread={msg.isUnread < 3}
                      isImportant={msg.isImportant}
                      targetDate={msg.targetDate}
                      onSelect={() => onSelectAction(msg)}
                    />
                  ))}
                </Box>
              );
            })}
          <Box ref={targetRef} sx={isFetching && !actions.length ? { mt: 2 } : null}>
            <MessageCenterCarditemSkeleton />
            <MessageCenterCarditemSkeleton />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          minWidth: 0,
          maxWidth: {
            lg: '65%', // On 1280px width, make it 60%
            xl: '60%', // On 1366px width, make it 55%
            xxl: '55%' // On 1920px width and above, make it 50%
          },
          px: 2,
          pt: 2,
          overflowY: 'auto'
        }}
      >
        {isFetching && selectedAction === null ? (
          <MessageCenterCardDetailsSkeleton />
        ) : (
          <MessageCenterActionDetails selectedAction={selectedAction} />
        )}
      </Box>
    </Box>
  );
};

export default MessageCenterActionViewMailBox;
