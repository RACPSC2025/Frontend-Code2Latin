export const modulesConfiguration = [
  // Put specific domains/subdomains configuration here, which will be apply for that domains/subdomains
  {
    subdomain: 'Chocalates',
    modulePermissions: [{ moduleName: 'notifications', visibility: true }]
  },
  {
    subdomain: 'Alimentos',
    modulePermissions: [
      { moduleName: 'events', visibility: false }
      // { moduleName: 'legalMatrix', visibility: false }
    ]
  },
  {
    subdomain: 'Café',
    modulePermissions: [{ moduleName: 'notifications', visibility: true }]
  },
  {
    subdomain: 'Cárnicos',
    modulePermissions: [{ moduleName: 'notifications', visibility: true }]
  },
  {
    subdomain: 'Galletas',
    modulePermissions: [{ moduleName: 'notifications', visibility: true }]
  },
  {
    subdomain: 'Helados',
    modulePermissions: [{ moduleName: 'notifications', visibility: true }]
  },
  {
    subdomain: 'Pastas',
    modulePermissions: [{ moduleName: 'notifications', visibility: true }]
  },
  {
    subdomain: 'Tresmontes',
    modulePermissions: [{ moduleName: 'notifications', visibility: true }]
  },
  {
    subdomain: 'Servicios',
    modulePermissions: [{ moduleName: 'notifications', visibility: true }]
  },
  {
    subdomain: 'Comercializadora',
    modulePermissions: [{ moduleName: 'notifications', visibility: true }]
  }
];
