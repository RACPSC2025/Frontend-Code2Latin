import { Apps, CalendarToday, CheckCircleOutline, MailOutline, Search } from '@mui/icons-material';
import { modulesConfiguration } from './modulesConfig';

export const generalConfiguration = {
  // Put general configuration here, which will be apply for all domains/subdomains
  subdomain: 'GENERAL',
  modulePermissions: [
    {
      moduleName: 'legalMatrix',
      key: 'legalMatrix',
      label: 'legal_parent',
      icon: <Apps fontSize="small" />
    },
    {
      moduleName: 'notifications',
      key: 'notifications',
      label: 'Messages',
      icon: <MailOutline fontSize="small" />
    },
    {
      moduleName: 'events',
      key: 'events',
      label: 'tasks',
      icon: <CalendarToday fontSize="small" />
    },
    /*
    {
      moduleName: 'inspections',
      key: 'inspections',
      label: 'inspections',
      icon: <CalendarToday fontSize="small" />
    },
    {
      moduleName: 'findings',
      key: 'findings',
      label: 'findings',
      icon: <Search fontSize="small" />
    },
    */
    {
      moduleName: 'actions',
      key: 'actions',
      label: 'Actions',
      icon: <CheckCircleOutline fontSize="small" />
    }
  ]
};

// Deep merge utility function
export const deepMerge = (target, source) => {
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      target[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};

export const getGlobalConfiguration = (subdomain) => {
  // Find specific configuration for the subdomain
  const specificConfig = modulesConfiguration?.find((config) => config.subdomain === subdomain);

  // If no specific configuration is found, return the general configuration
  if (!specificConfig) {
    return generalConfiguration;
  }

  // Deep merge configurations
  const mergedConfiguration = deepMerge({ ...generalConfiguration }, specificConfig);

  // Handle deep merge for modulePermissions
  if (specificConfig?.modulePermissions) {
    mergedConfiguration.modulePermissions = generalConfiguration?.modulePermissions.map(
      (generalPermission) => {
        const specificPermission = specificConfig?.modulePermissions?.find(
          (specific) => specific?.moduleName === generalPermission?.moduleName
        );
        return specificPermission || generalPermission;
      }
    );
  }

  return mergedConfiguration ?? {};
};
