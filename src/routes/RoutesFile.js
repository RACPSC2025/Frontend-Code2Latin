import { Suspense, createContext, lazy, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import TheFullPageLoader from '../components/TheFullPageLoader';
import TheLayout from '../components/TheLayout';
import { APP_SUBDOMAIN } from '../config/constants';
import { getGlobalConfiguration } from '../config/generalConfig';
import MessageCenter from '../features/MessageCenter';
import MessageCenterNotifications from '../features/MessageCenterNotifications';
import {
  fetchListOfUsers,
  fetchRegions,
  fetchUserDetails,
  setActiveModule
} from '../stores/globalDataSlice';

import LoginPage from '../features/auth/LoginPage';
import ProtectedRoute from './ProtectedRoute';

const Findings = lazy(() => import('../features/findings/Findings'));
const MessageCenterLegalMatrix = lazy(() => import('../features/MessageCenterLegalMatrix'));
const Tasks = lazy(() => import('../features/tasks/Tasks'));
const Actions = lazy(() => import('../features/actions/Actions'));
const Inspections = lazy(() => import('../features/inspections/Inspections'));

export const GlobalConfig = createContext();

export default function RoutesFile() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [permitRoutes, setPermitRoutes] = useState([]);
  const [defaultRoute, setDefaultRoute] = useState();
  const subdomain = APP_SUBDOMAIN; //'Alimentos';
  const config = getGlobalConfiguration(subdomain) ?? {}; // Fetch configuration based on subdomain

  useEffect(() => {
    setPermitRoutes(config?.modulePermissions ?? []);

    const notificationsModule = config?.modulePermissions?.find(
      (module) => module.moduleName === 'notifications'
    );
    if (notificationsModule?.visibility === false) {
      // setDefaultRoute('/view/legalMatrix');
      const sortedPermissions = config?.modulePermissions.sort((a, b) => {
        // Place objects with visibility: false at the end
        return (a.visibility === false) - (b.visibility === false);
      });
      const route = `/view/${sortedPermissions[0]?.key}`;
      setDefaultRoute(route);
    } else {
      setDefaultRoute('/view/notifications');
    }
  }, [subdomain]);

  useEffect(() => {
    dispatch(fetchUserDetails('userId')); // Pass the actual userId here
    dispatch(fetchListOfUsers());
    dispatch(fetchRegions());
  }, [dispatch]);

  useEffect(() => {
    const { pathname } = location;
    if (pathname === '/login') return; // Skip for login page
    const pathnameArr = pathname.split('/');
    const pathKey = pathnameArr.pop().trim();
    if (pathKey) {
      dispatch(setActiveModule({ module: pathKey }));
    }
  }, [location, dispatch]);

  // Component mapping
  const componentMapping = {
    notifications: <MessageCenterNotifications />,
    events: <Tasks />,
    inspections: <Inspections />,
    actions: <Actions />,
    findings: <Findings />,
    legalMatrix: <MessageCenterLegalMatrix />
  };

  return (
    <Suspense fallback={<TheFullPageLoader />}>
      <GlobalConfig.Provider value={config}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <TheLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to={defaultRoute} replace />} />
                    <Route path="/view" element={<MessageCenter />}>
                      <Route index element={<Navigate to={defaultRoute} replace />} />
                      {permitRoutes
                        .filter((permission) => permission.visibility !== false)
                        .map((permission) => (
                          <Route
                            key={permission.moduleName}
                            path={permission.moduleName}
                            element={componentMapping[permission.moduleName]}
                          />
                        ))}
                    </Route>
                  </Routes>
                </TheLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </GlobalConfig.Provider>
    </Suspense>
  );
}
