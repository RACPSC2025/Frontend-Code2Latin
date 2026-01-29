const storagePrefix = 'amatia_auth_';

const storage = {
  getToken: () => {
    // return window.localStorage.getItem(`${storagePrefix}token`);
    return window.localStorage.getItem('Auth-Token');
  },
  clearToken: () => {
    window.localStorage.removeItem(`${storagePrefix}token`);
  },
  getSystemToken: () => {
    return window.localStorage.getItem('selectedGroup');
  },
  removeSystemToken: () => {
    window.localStorage.removeItem('selectedGroup');
  },
  clearCookies: () => {
    window.localStorage.clear();
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
  }
};

export default storage;
