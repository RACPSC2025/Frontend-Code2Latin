import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import storage from '../utils/storage';
import { API_URL, LOCAL_AUTH_TOKEN } from '../config/constants';

function MessageCenter() {
  let token = storage.getToken();
  if (process.env.NODE_ENV == 'production') {
    //const token = storage.getToken();
    useEffect(() => {
      if (!token) {
        //window.location.href = `${API_URL}`;
        storage.clearToken();
        storage.removeSystemToken();
        localStorage.clear();
        return;
      }
    }, []);
  }
  else{
    token = LOCAL_AUTH_TOKEN;
  }
  return <Outlet />;
}
export default MessageCenter;