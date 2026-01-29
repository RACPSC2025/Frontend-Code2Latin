import { Box, Container } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  backgroundColor,
  headerHeight,
  navbarCollapsedWidth,
  navbarWidth
} from '../config/constants';
import { usePageVisibility } from '../hooks/usePageVisibility';
import { fetchNewMessageCount } from '../stores/globalDataSlice';
import { getPastTimestamp } from '../utils/dateTimeFunctions';
import TheFullPageLoader from './TheFullPageLoader';
import TheLayoutHeader from './TheLayoutHeader';
import TheLayoutNavbar from './TheLayoutNavbar';

function Layout({ children }) {
  const isPageVisible = usePageVisibility();
  const timerIdRef = useRef(null);
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);
  const dispatch = useDispatch();
  const [navbarExpanded, setNavbarExpanded] = useState(true);

  // Use useSelector to access the loading from the global data in the Redux store
  const isVisibleFullPageLoader = useSelector((state) => state.globalData.loading);

  const toggleNavbar = () => {
    setNavbarExpanded(!navbarExpanded);
  };

  useEffect(() => {
    const INTERVAL = 5 * 60 * 1000;

    const pollNewMessages = () => {
      try {
        const INTERVAL_IN_SECONDS = INTERVAL / 1000;
        const ts = getPastTimestamp(INTERVAL_IN_SECONDS, 'second');
        dispatch(fetchNewMessageCount(ts));
      } catch (error) {
        console.error('[Error] Polling new message count failed. Stopped polling.', error);
        setIsPollingEnabled(false);
      }
    };

    const startPolling = () => {
      // Polling every 5 minutes
      timerIdRef.current = setInterval(pollNewMessages, INTERVAL);
    };

    const stopPolling = () => {
      clearInterval(timerIdRef.current);
    };

    if (isPageVisible && isPollingEnabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isPageVisible, isPollingEnabled, dispatch]);

  return (
    <Container maxWidth="100vw" disableGutters={true}>
      {isVisibleFullPageLoader ? (
        <TheFullPageLoader />
      ) : (
        <Box
          sx={{
            height: '100%',
            width: '100%',
            background: backgroundColor,
            overflow: 'hidden'
          }}
        >
          <TheLayoutNavbar expanded={navbarExpanded} onToggle={toggleNavbar} />
          <Box
            sx={{
              width: `calc(100% - ${!navbarExpanded ? navbarCollapsedWidth : navbarWidth}px)`,
              height: '100%',
              ml: `${!navbarExpanded ? navbarCollapsedWidth : navbarWidth}px`
            }}
          >
            <TheLayoutHeader />
            <Box
              component="main"
              sx={{ height: `calc(100vh - ${headerHeight}px)`, overflowY: 'auto' }}
            >
              {children}
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default Layout;
