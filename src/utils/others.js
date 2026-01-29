import { toast } from 'react-toastify';

export async function sleep(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

export function getHumanReadableFileSize(fileSizeInBytes) {
  /**
   * 1 Byte
   * 1 KB = 1024 Bytes (10 ^ 3 Bytes)
   * 1 MB = 1024 KB (10 ^ 6 Bytes)
   * 1 GB = 1024 MB (10 ^ 9 Bytes)
   */

  const fileSizeUnits = ['Bytes', 'Kb', 'Mb', 'Gb'];
  const e = Math.pow(10, 3);
  const f = parseInt(Math.log10(fileSizeInBytes) / Math.log10(e));
  const fileSize = (fileSizeInBytes / Math.pow(e, f)).toFixed(2);
  return `${fileSize} ${fileSizeUnits[f]}`;
}

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

export const getInitials = (name) => {
  const [firstName, lastName] = name.split(' ');
  const fullNameInitials = [firstName, lastName]
    .filter((name) => name)
    .map((name) => name[0])
    .join('');
  return fullNameInitials;
};

export function stringAvatar(name, customStyle = {}) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      ...customStyle
    },
    children: getInitials(name)
  };
}

export function isBase64ImageData(str) {
  const imageDataRegex = /^data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+\/]+=*$/;
  return imageDataRegex.test(str);
}

export function not(fn) {
  return function (...args) {
    return !fn(...args);
  };
}

export function convertString(inputString, joinCharacter = '_') {
  return inputString.toLowerCase().split(' ').join(joinCharacter);
}

export function convertObjectToArray(obj, nestedProperty = null) {
  const finalObj = nestedProperty ? obj[nestedProperty] : obj;
  return Object.keys(finalObj).map((objKey) => finalObj[objKey]);
}

export const isValidArray = (data) => {
  return data && Array.isArray(data) && data.length > 0;
};

export const isValidObject = (data) => {
  return typeof data === 'object' && data !== null && Object.keys(data).length !== 0;
};

export const showSuccessMsg = (msg = '') => {
  toast.success(msg);
};

export const showErrorMsg = (msg = 'Something went wrong.') => {
  toast.error(msg);
};

export const handleServerValidation = (data) => {
  if (data?.payload?.code === 422) {
    showErrorMsg(data?.payload?.message ?? data?.payload?.exception?.message ?? 'Invalid data!');
  } else if (data?.payload?.code === 400) {
    showErrorMsg(data?.payload?.message ?? 'Bad request!');
  } else if (data?.payload?.code === 404) {
    showErrorMsg(data?.payload?.dataObj?.message ?? 'Service not found!');
  } else if (data?.payload?.code === 503) {
    showErrorMsg(data?.payload?.dataObj?.error ?? 'Service is not available!');
  } else if (data?.payload?.code === 500 || data?.code === 500) {
    showErrorMsg(data?.payload?.exception ?? data?.exception ?? 'Server error!');
  } else {
    showErrorMsg(data?.payload?.message ?? 'Something went wrong!');
  }
};

export const setLocalStorageData = (key, data) => {
  const finalData = isValidArray(data) || isValidObject(data) ? JSON.stringify(data) : '';
  return localStorage.setItem(key, finalData);
};

export const getLocalStorageData = (key) => {
  const data = localStorage.getItem(key) ?? '';
  const finalData = !!data ? JSON.parse(data) : '';
  return finalData;
};

export const removeLocalStorageData = (key) => {
  return localStorage.removeItem(key);
};
