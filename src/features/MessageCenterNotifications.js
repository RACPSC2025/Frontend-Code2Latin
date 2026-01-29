import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ArchiveIcon from '@mui/icons-material/Archive';
import EmailIcon from '@mui/icons-material/Email';
import FlagIcon from '@mui/icons-material/Flag';
import MarkEmailUnreadIcon from '@mui/icons-material/MarkEmailUnread';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import BaseEmptyState from '../components/BaseEmptyState';
import BaseFeaturePageLayout from '../components/BaseFeaturePageLayout';
import BaseSortPopper from '../components/BaseSortPopper';
import { BULK_ACTION } from '../config/constants';
import { useIntersectionObserver } from '../hooks/useInterSectionObserver';
import { useLanguage } from '../providers/languageProvider';
import { selectAppliedFilterModel } from '../stores/filterSlice';
import { dashboardMessage } from '../stores/messages/dashboardMessageSlice';
import { fetchDashboardMessageDetails } from '../stores/messages/fetchDashboardMessageDetailsSlice';
import { fetchDashboardMessageStatistics } from '../stores/messages/fetchDashboardMessageStatisticsSlice';
import { updateMessage } from '../stores/messages/updateMessageSlice';
import { groupRecordsByDate } from '../utils/dateTimeFunctions';
import MessageCenterCardDetails from './MessageCenterCardDetails';
import MessageCenterCardItem from './MessageCenterCardItem';
import MessageCenterCardDetailsSkeleton from './MessageCenterCarditemDetailsSkeleton';
import MessageCenterCarditemSkeleton from './MessageCenterCarditemSkeleton';

const defaultStatistics = {
  total_message_count: 0,
  unread_message_count: 0,
  important_message_count: 0
};

const useAppliedFilterModel = (module) =>
  useSelector((state) => selectAppliedFilterModel(state, module));

function MessageCenterNotifications() {
  const dispatch = useDispatch();
  const [messages, setMessages] = useState([]);
  const [messageDetails, setMessageDetails] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isFetchingDetails, setIsFetchingDetails] = useState(true);
  const [pageNum, setPageNum] = useState(0);
  const [hasReachedEndOfList, setHasReachedEndOfList] = useState(false);
  const [stats, setStats] = useState(defaultStatistics);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [selectedSortBy, setSelectedSortBy] = useState('Date'); // default sort by
  const [selectedSortOrder, setSelectedSortOrder] = useState('Newest on top'); // default sort order
  const [open, setOpen] = useState(false);

  const sortByOptions = ['Date', 'Category', 'From', 'Size', 'Importance', 'Subject'];
  const sortOrderOptions = ['Newest on top', 'Oldest on top'];

  const { language } = useLanguage();
  const { t } = useTranslation();

  const activeBulkAction = useRef(null);
  const targetRef = useRef(null);
  const isIntersecting = useIntersectionObserver(targetRef);
  const filterData = useAppliedFilterModel('notifications');

  const dashboardMessageLoading = useSelector(
    (state) => state?.fetchDashboardMessageDetails?.loading ?? false
  );

  useEffect(() => {
    if (isIntersecting) {
      setPageNum((no) => no + 1);
    }
  }, [isIntersecting]);

  useEffect(() => {
    refreshData();
  }, [filterData]);

  const prepareAPIParams = () => {
    const formData = new FormData();

    if (Object.keys(filterData).length > 0) {
      Object.keys(filterData).forEach((filterKey) => {
        formData.append(filterKey, filterData[filterKey]);
      });
    }

    return formData;
  };

  const handleFetchMessagesDetails = (messageID) => {
    const formData = new FormData();
    formData.append('id_message', messageID);
    dispatch(fetchDashboardMessageDetails(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const msgDetails = data?.payload?.data ?? null;
        setMessageDetails(msgDetails);
        if (msgDetails.is_read === '0') markMessageAsRead(msgDetails.id_message);
      }
    });
  };

  const handleFetchMessageStatistics = () => {
    const formData = prepareAPIParams();
    dispatch(fetchDashboardMessageStatistics(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const stats = data?.payload?.data;
        setStats(stats);
      }
    });
  };

  const handleFetchDashboardMessages = () => {
    const formData = prepareAPIParams();
    formData.append('page', pageNum);
    dispatch(dashboardMessage(formData)).then((res) => {
      const dataObj = res?.payload;
      if (dataObj?.messages === 'Success') {
        const data = dataObj?.data;
        const next = dataObj?.next;
        const allMessages = [...new Set([...messages, ...data])];
        setMessages(allMessages);
        if (messageDetails === null && allMessages.length > 0) {
          const [firstMessage] = allMessages;
          handleFetchMessagesDetails(firstMessage.id_message);
          handleFetchMessageStatistics();
          // fetchMessageDetails(firstMessage.id_message);
          // fetchStats();
        } else if (allMessages.length === 0 && dashboardMessageLoading) {
          setIsFetchingDetails(false);
        }
        setHasReachedEndOfList(!next);
      }
    });
  };

  const handleUpdateMessageInfo = (messageID, updatedInfo) => {
    const formData = new FormData();
    formData.append('id_message', messageID);

    if (updatedInfo.hasOwnProperty('is_read')) formData.append('is_read', updatedInfo.is_read);
    if (updatedInfo.hasOwnProperty('is_important'))
      formData.append('is_important', updatedInfo.is_important);
    if (updatedInfo.hasOwnProperty('is_archived'))
      formData.append('is_archived', updatedInfo.is_archived);

    dispatch(updateMessage(formData)).then((data) => {
      if (data.payload.messages === 'Success') {
        const { is_read, is_important, is_archived } = data.payload.data;
        return { is_read, is_important, is_archived };
      }
      return null;
    });
  };

  const updateMessageInListOfMessages = (messageID, updatedInfo = {}) => {
    const targetMessageIdx = messages.findIndex((msg) => msg.id_message === messageID);
    if (targetMessageIdx !== -1) {
      const message = { ...messages[targetMessageIdx] };
      const updatedMessage = { ...message, ...updatedInfo };
      setMessages(messages.map((msg, idx) => (idx === targetMessageIdx ? updatedMessage : msg)));
      if (messageID === messageDetails?.id_message) {
        setMessageDetails((prevState) => ({
          ...prevState,
          ...updatedInfo
        }));
      }
      return true;
    }

    return false;
  };

  const markMessageAsRead = async (messageID) => {
    try {
      const response = await handleUpdateMessageInfo(messageID, { is_read: 1 });
      // updateMessageInfo(messageID, { is_read: 1 });
      if (response) {
        updateMessageInListOfMessages(messageID, response);
        // fetchStats();
        handleFetchMessageStatistics();
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const toggleMessageAsImportant = async (messageID, isImportant = true) => {
    try {
      const response = await handleUpdateMessageInfo(messageID, {
        is_important: Number(isImportant)
      });
      //  updateMessageInfo(messageID, { is_important: Number(isImportant) });
      if (response) {
        updateMessageInListOfMessages(messageID, response);
        // fetchStats();
        handleFetchMessageStatistics();
      }
    } catch (error) {
      console.error('Error marking message as important:', error);
    }
  };

  const createFooterStatsConfig = (stats) => {
    return [
      {
        name: 'Total', // Localize this string if necessary
        count: stats.total_message_count,
        icon: EmailIcon
      },
      {
        name: t('Unread'),
        count: stats.unread_message_count,
        icon: MarkEmailUnreadIcon
      },
      {
        name: t('Important'),
        count: stats.important_message_count,
        icon: FlagIcon
      },
      {
        name: 'Archive',
        count: stats.archived_message_count,
        icon: ArchiveIcon
      }
    ];
  };

  // Handlers for SortPopper
  const handleSortByOptionClick = (option) => {
    setSelectedSortBy(option);
    // Implement sort by logic here...
  };

  const handleSortOrderOptionClick = (option) => {
    setSelectedSortOrder(option);
    // Implement sort order logic here...
  };

  const refreshData = () => {
    setHasReachedEndOfList(false);
    setMessages([]);
    setMessageDetails(null);
    setIsFetching(true);
    setIsFetchingDetails(true);
    setPageNum(0);
    setStats(defaultStatistics);
  };

  const handleOpenBulkActionConfirmationDialog = (action) => {
    setOpen(true);
    activeBulkAction.current = action;
  };

  const handleClose = () => {
    setOpen(false);
    activeBulkAction.current = null;
  };

  const handleChangeMessageSelection = (isChecked, messageID) => {
    if (isChecked) {
      setSelectedMessages([...selectedMessages, messageID]);
    } else {
      setSelectedMessages(selectedMessages.filter((id) => id !== messageID));
    }
  };

  const handleBulkAction = async () => {
    if (activeBulkAction.current) {
      try {
        let payload = {};

        if (activeBulkAction.current === BULK_ACTION.archive) {
          payload['is_archived'] = 1;
        }

        const updatedMessagePromises = selectedMessages.map(
          (msgID) => handleUpdateMessageInfo(msgID, payload)
          // updateMessageInfo(msgID, payload)
        );

        await Promise.all(updatedMessagePromises);

        setOpen(false);
        setSelectedMessages([]);
        refreshData();
      } catch (error) {
        console.error('Error doing bulk action', error);
      }
    }
  };

  const statsConfig = useMemo(() => createFooterStatsConfig(stats), [stats]);
  const groupedMessages = useMemo(() => groupRecordsByDate(messages, 'date_message'), [messages]);
  const showLoaderForMessageDetails = useMemo(
    () => (isFetching && messageDetails === null) || dashboardMessageLoading,
    [isFetching, dashboardMessageLoading, messageDetails]
  );

  const singleNotificationMessageKey =
    language === 'en' ? 'subject_message_en' : 'subject_message_es';
  const singleNotificationDescriptionKey =
    language === 'en' ? 'text_message_en' : 'text_message_es';
  const singleNotificationEmployeeKey =
    language === 'en' ? 'employee_message_en' : 'employee_message_es';

  const isNoDataAvailable = !isFetching && messages.length === 0;

  // Use useMemo to compute the isIndeterminate value based on messages and selectedMessages
  const isIndeterminate = useMemo(
    () => selectedMessages.length > 0 && selectedMessages.length < messages.length,
    [messages, selectedMessages]
  );

  // Use useMemo to compute isAllSelected based on the length of messages and selectedMessages
  const isAllSelected = useMemo(
    () => messages.length > 0 && selectedMessages.length === messages.length,
    [messages, selectedMessages]
  );

  useEffect(() => {
    if (pageNum >= 1 && !hasReachedEndOfList) {
      handleFetchDashboardMessages();
      // fetchData().then(() => {
      //   if (pageNum === 1) {
      //     fetchStats();
      //   }
      // });
    }
  }, [pageNum, hasReachedEndOfList]);


  // cambios

  return (
    <>
      <BaseFeaturePageLayout statsConfig={statsConfig}>
        <Box
          sx={{
            width: {
              lg: '40%', // On 1280px width, make it 40%
              xl: '45%', // On 1366px width, make it 45%
              xxl: '50%' // On 1920px width and above, make it 50%
            },
            height: '100%',
            backgroundColor: '#fff',
            borderRight: '1px solid #ccc',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box
            sx={{
              boxShadow: 1,
              zIndex: 10,
              bgcolor: 'background.paper',
              px: 1,
              display: 'flex'
            }}
          >
            <Checkbox
              sx={{
                p: 0,
                mr: 1
              }}
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={(event) => {
                if (event.target.checked) {
                  setSelectedMessages(messages.map((msg) => msg.id_message));
                } else {
                  setSelectedMessages([]);
                }
              }}
              inputProps={{ 'aria-label': 'select all messages' }}
            />
            <Button
              sx={{ mr: 'auto' }}
              disabled={selectedMessages.length === 0}
              onClick={() => handleOpenBulkActionConfirmationDialog(BULK_ACTION.archive)}
            >
              <ArchiveIcon />
              {t('archive')}
            </Button>
            <BaseSortPopper
              sortByOptions={sortByOptions}
              sortOrderOptions={sortOrderOptions}
              selectedSortBy={selectedSortBy}
              selectedSortOrder={selectedSortOrder}
              handleSortByOptionClick={handleSortByOptionClick}
              handleSortOrderOptionClick={handleSortOrderOptionClick}
            />
            <Tooltip title="Refresh">
              <IconButton onClick={refreshData}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
            {isNoDataAvailable && <BaseEmptyState module="messages" section="list" />}
            {messages.length > 0 &&
              Array.from(groupedMessages).map(([dateKey, messages], idx) => {
                return (
                  <Box key={dateKey} sx={{ my: 0.5 }}>
                    <Typography variant="body2" color="text.primary" sx={{ ml: 1, mb: 0.5 }}>
                      {dateKey}
                    </Typography>
                    {messages.map((msg) => (
                      <MessageCenterCardItem
                        key={msg.id_message}
                        reviewer={msg[singleNotificationEmployeeKey]}
                        message={msg[singleNotificationMessageKey]}
                        desc={msg[singleNotificationDescriptionKey]}
                        date={msg.date_message}
                        isSelected={selectedMessages.includes(msg.id_message)}
                        isActive={messageDetails?.id_message === msg.id_message}
                        isUnread={msg.is_read === '0'}
                        isImportant={msg.is_important !== '0'}
                        targetDate={msg.due_date}
                        status={msg.status}
                        onClick={() => {
                          handleFetchMessagesDetails(msg?.id_message);
                          // fetchMessageDetails(msg.id_message);
                        }}
                        onCheckChanged={(isChecked) =>
                          handleChangeMessageSelection(isChecked, msg.id_message)
                        }
                        onToggleImportant={() =>
                          toggleMessageAsImportant(msg.id_message, msg.is_important === '0')
                        }
                      />
                    ))}
                  </Box>
                );
              })}
            <Box
              ref={targetRef}
              sx={{
                mt: isFetching && !messages.length ? 2 : 0,
                display: hasReachedEndOfList ? 'none' : 'block'
              }}
            >
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
              lg: '60%', // On 1280px width, make it 60%
              xl: '55%', // On 1366px width, make it 55%
              xxl: '50%' // On 1920px width and above, make it 50%
            },
            px: 2,
            pt: 2,
            overflowY: 'auto'
          }}
        >
          {showLoaderForMessageDetails ? (
            <MessageCenterCardDetailsSkeleton />
          ) : isNoDataAvailable || messageDetails === null ? (
            <BaseEmptyState module="messages" section="details" />
          ) : (
            <MessageCenterCardDetails
              messageDetails={messageDetails}
              toggleImportant={toggleMessageAsImportant}
            />
          )}
        </Box>
      </BaseFeaturePageLayout>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{t('confirm_archive')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('are_you_sure_you_want_to_archive_this_item')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t('disagree')}</Button>
          <Button onClick={handleBulkAction} autoFocus>
            {t('agree')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default MessageCenterNotifications;
