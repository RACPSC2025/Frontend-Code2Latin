import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import {
  createHashRouter,
  HashRouter,
  Navigate,
  RouterProvider
} from 'react-router-dom';
import App from './App';
import MessageCenter from './features/MessageCenter';
import MessageCenterNotifications from './features/MessageCenterNotifications';
import './lib/i18n';
import store from './store';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';


// import TheWorkInProgress from './components/TheWorkInProgress';

// const router = createBrowserRouter(
// const router = createHashRouter(
//   [
//     {
//       path: '/',
//       element: <App />,
//       children: [
//         {
//           path: '',
//           element: <Navigate to="view/notifications" replace />
//         },
//         {
//           path: 'view/',
//           element: <MessageCenter />,
//           children: [
//             {
//               path: '',
//               element: <Navigate to="notifications" replace />
//             },
//             {
//               path: 'notifications',
//               element: <MessageCenterNotifications />
//             },
//             {
//               path: 'events',
//               lazy: () => import('./features/MessageCenterEvents')
//             },
//             {
//               path: 'inspections',
//               lazy: () => import('./features/MessageCenterEvents')
//             },
//             {
//               path: 'actions',
//               lazy: () => import('./features/MessageCenterActions')
//             },
//             {
//               path: 'findings',
//               lazy: () => import('./features/findings/Findings')
//             },
//             {
//               path: 'legalMatrix',
//               lazy: () => import('./features/MessageCenterLegalMatrix')
//             }
//           ]
//         }
//       ]
//     }
//   ]
//   // { basename: process.env.REACT_APP_BASE_NAME }
// );

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      {/* <RouterProvider router={router} /> */}
      <HashRouter>
        <App />
      </HashRouter>
    </Provider>
  </ApolloProvider>
);


