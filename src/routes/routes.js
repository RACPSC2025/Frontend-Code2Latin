import Findings from '../features/findings/Findings';
import MessageCenter from '../features/MessageCenter';
import MessageCenterActions from '../features/MessageCenterActions';
import MessageCenterEvents from '../features/MessageCenterEvents';
import MessageCenterLegalMatrix from '../features/MessageCenterLegalMatrix';
import MessageCenterNotifications from '../features/MessageCenterNotifications';

// /amatia/message-center#/view/notifications/view/notifications#/view/notifications
// /view/notifications#/view/notifications
export const routes = [
  {
    path: '/view/notifications#/',
    element: <MessageCenterNotifications />
  },
  {
    path: '/view/notifications#/',
    element: <MessageCenter />,
    subRoute: [
      {
        path: 'notifications',
        element: <MessageCenterNotifications />
      },
      {
        path: 'events',
        element: <MessageCenterEvents />
      },
      {
        path: 'inspections',
        element: <MessageCenterEvents />
      },
      {
        path: 'actions',
        element: <MessageCenterActions />
      },
      {
        path: 'findings',
        element: <Findings />
      },
      {
        path: 'legalMatrix',
        element: <MessageCenterLegalMatrix />
      }
    ]
  }
];
