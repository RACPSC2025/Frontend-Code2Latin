import {
  AddToPhotos,
  AutoAwesome,
  CalendarMonth,
  ExpandLess,
  ExpandMore,
  Insights,
  LabelImportant,
  ListAlt,
  MoreVert,
  TableChart,
  Tune
} from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Select,
  Skeleton,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import LexicalInput from '../components/Input/lexicalWYSWYG/LexicalInput';
import TableComponent from '../components/TableComponent';
import { fetchRisksList } from '../stores/legal/fetchRisksListSlice';
import { fetchTaskListLevel } from '../stores/tasks/fetchtaskListLevelSlice';

export function Component() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [risks, setRisks] = useState([]);
  const [selectedView, setSelectedView] = useState('calendar'); // ['calendar', 'list', 'table', 'insights', 'settings'
  const [calendarioIconColor, setCalendarioIconColor] = useState('warning');
  const [listaIconColor, setListaIconColor] = useState('action');
  const [tablaIconColor, setTablaIconColor] = useState('action');

  const [level1Options, setLevel1Options] = useState([]);
  const [level1Selected, setLevel1Selected] = useState('');
  const [level2Options, setLevel2Options] = useState([]);
  const [level2Selected, setLevel2Selected] = useState('');
  const [loadingLevel2, setLoadingLevel2] = useState(true);
  const [level3Options, setLevel3Options] = useState([]);
  const [level3Selected, setLevel3Selected] = useState('');
  const [loadingLevel3, setLoadingLevel3] = useState(true);
  const [level4Options, setLevel4Options] = useState([]);
  const [level4Selected, setLevel4Selected] = useState('');
  const [loadingLevel4, setLoadingLevel4] = useState(true);

  const [openOptionsDrawer, setOpenOptionsDrawer] = useState(false);

  const handleFetchtaskListLevel = (level, formData) => {
    const optionSetters = {
      1: setLevel1Options,
      2: setLevel2Options,
      3: setLevel3Options,
      4: setLevel4Options
    };
    const loadingSetter = {
      2: setLoadingLevel2,
      3: setLoadingLevel3,
      4: setLoadingLevel4
    };
    loadingSetter[level]?.(true);
    const data = { level, formData };
    dispatch(fetchTaskListLevel(data)).then((data) => {
      if (data?.payload?.message === 'Success') {
        const levelOptions = data?.payload?.data.map((item) => ({
          value: item.value,
          label: item.label
        }));

        optionSetters[level]?.(levelOptions);
      }
      loadingSetter[level]?.(false);
    });
  };

  function handleLimpiarFiltrosGeo() {
    setLevel1Selected('');
    setLevel2Selected('');
    setLevel3Selected('');
    setLevel4Selected('');
  }

  const handleFetchRiskList = () => {
    dispatch(fetchRisksList()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const risksList = data?.payload?.data.map((item) => ({
          ...item,
          id: item.risk_number
        }));

        setRisks(risksList);
      }
    });
  };

  const handleOpenOptionsDrawer = (logtask) => {
    console.log("IA logtask");
    setOpenOptionsDrawer(true);
  };

  const handleCloseOptionsDrawer = () => {
    setOpenOptionsDrawer(false);
  };

  const tableColumns = [
    {
      field: 'amatia',
      headerName: 'AMAT-IA',
      width: 100,
      editable: false,
      type: 'string',
      cellRenderer: (params) => {
        return (
          <div>
            <Tooltip title={t('analyze_with_amatia')}>
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleOpenOptionsDrawer(params.row)}
              >
                <AutoAwesome />
              </IconButton>
            </Tooltip>
          </div>
        );
      }
    },
    {
      field: 'risk_number',
      headerName: t('number_risk'),
      width: 100,
      editable: false,
      type: 'string'
    },
    {
      field: 'risk',
      headerName: t('risk'),
      width: 200,
      editable: false,
      type: 'string'
    },
    {
      field: 'deficiency',
      headerName: t('deficiency'),
      width: 100,
      editable: false,
      type: 'string'
    },
    {
      field: 'exposure',
      headerName: t('exposure'),
      width: 100,
      editable: false,
      type: 'string'
    },
    {
      field: 'initial_frequency',
      headerName: t('initial_frequency'),
      width: 100,
      editable: false,
      type: 'string'
    },
    {
      field: 'initial_severity',
      headerName: t('initial_severity'),
      width: 100,
      editable: false,
      type: 'string'
    },
    {
      field: 'initial_risk',
      headerName: t('initial_risk'),
      width: 100,
      editable: false,
      type: 'string'
    },
    {
      field: 'residual_frequency',
      headerName: t('residual_frequency'),
      width: 100,
      editable: false,
      type: 'string'
    },
    {
      field: 'residual_severity',
      headerName: t('residual_severity'),
      width: 100,
      editable: false,
      type: 'string'
    },
    {
      field: 'residual_risk',
      headerName: t('residual_risk'),
      width: 100,
      editable: false,
      type: 'string'
    },
    {
      field: 'danger_materialize',
      headerName: t('danger_materialize'),
      width: 100,
      editable: false,
      type: 'string'
    },
    {
      field: 'action_plan',
      headerName: t('action_plan'),
      width: 100,
      editable: false,
      type: 'string'
    },
    {
      field: 'estado',
      headerName: t('Status'),
      width: 100,
      editable: false,
      type: 'string'
    }
  ];

  useEffect(() => {
    handleFetchtaskListLevel(1);
    handleFetchRiskList();
  }, []);
  useEffect(() => {
    if (level1Selected) {
      const level2FormData = new FormData();
      level2FormData.append('id_level1', level1Selected);
      handleFetchtaskListLevel(2, level2FormData);
    }
  }, [level1Selected]);
  useEffect(() => {
    if (level2Selected) {
      const level3FormData = new FormData();
      level3FormData.append('id_level2', level2Selected);
      handleFetchtaskListLevel(3, level3FormData);
    }
  }, [level2Selected]);
  useEffect(() => {
    if (level3Selected) {
      const level4FormData = new FormData();
      level4FormData.append('id_level3', level3Selected);
      handleFetchtaskListLevel(4, level4FormData);
    }
  }, [level3Selected]);

  return (
    <Box sx={{ m: 0, p: 0 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          // bgcolor: '#f5f5f5',
          width: '100%',
          pl: 3,
          pr: 3,
          pt: 1,
          pb: 0
        }}
      >
        <Box display="flex" justifyContent="start" gap={1} alignItems="center" flexGrow={1}>
          <FormControl sx={{ minWidth: 100 }} size="small">
            <InputLabel id="level1">{t('Business')}</InputLabel>
            <Select
              labelId="level1"
              id="level1"
              value={level1Selected}
              onChange={(e) => setLevel1Selected(e.target.value)}
            >
              {level1Options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }} size="small">
            <InputLabel id="level2">{t('Company')}</InputLabel>
            <Select
              labelId="level2"
              id="level2"
              disabled={loadingLevel2}
              value={level2Selected}
              onChange={(e) => setLevel2Selected(e.target.value)}
            >
              {level2Options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }} size="small">
            <InputLabel id="level3">{t('Region')}</InputLabel>
            <Select
              labelId="level3"
              id="level3"
              disabled={loadingLevel3}
              value={level3Selected}
              onChange={(e) => setLevel3Selected(e.target.value)}
            >
              {level3Options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }} size="small">
            <InputLabel id="level4">{t('Location')}</InputLabel>
            <Select
              labelId="level4"
              id="level4"
              disabled={loadingLevel4}
              value={level4Selected}
              onChange={(e) => setLevel4Selected(e.target.value)}
            >
              {level4Options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" color="primary" onClick={handleLimpiarFiltrosGeo}>
            {t('clear_filters')}
          </Button>
        </Box>
        <Box display="flex" gap={2}>
          {/* //TODO: add translations
              //TODO: Add hover to buttons
              //TODO: increment width to dropdowns
              //TODO: decrease icons size
              //TODO: Begin implementing fetching and filtering functionality
              //TODO: Make a new component for the dropdowns and views
          */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setSelectedView('calendar');
              setCalendarioIconColor('warning');
              setListaIconColor('action');
              setTablaIconColor('action');
            }}
          >
            <CalendarMonth color={calendarioIconColor} fontSize="medium" />
            <Typography variant="h8">{t('calendar')}</Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setSelectedView('list');
              setCalendarioIconColor('action');
              setListaIconColor('warning');
              setTablaIconColor('action');
            }}
          >
            <ListAlt color={listaIconColor} fontSize="medium" />
            <Typography variant="h8">{t('list')}</Typography>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ cursor: 'pointer' }}
            onClick={() => {
              setSelectedView('table');
              setTablaIconColor('warning');
              setCalendarioIconColor('action');
              setListaIconColor('action');
            }}
          >
            <TableChart color={tablaIconColor} fontSize="medium" />
            <Typography variant="h8">{t('table')}</Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Insights color="action" fontSize="medium" />
            <Typography variant="h8">{t('reports')}</Typography>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Tune color="action" fontSize="medium" />
            <Typography variant="h8">{t('adjustments')}</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          width: '100%',
          pl: 3,
          pr: 3,
          pt: 1,
          pb: 0,
          mt: '30px'
        }}
      >
        <TableComponent rowData={risks} columnDefs={tableColumns} />
      </Box>
      <OptionsDrawer
        openOptionsDrawer={openOptionsDrawer}
        onCloseOptionsDrawer={handleCloseOptionsDrawer}
        data={{}}
      />
    </Box>
  );
}

function OptionsDrawer({ openOptionsDrawer, onCloseOptionsDrawer, data }) {
  const [loadingAI, setLoadingAI] = useState('not clicked');
  const [list1Open, setList1Open] = useState(false);
  const [list2Open, setList2Open] = useState(false);
  const [list3Open, setList3Open] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);
  const { t } = useTranslation();

  const tableDrawerColumns = [
    {
      field: 'jerarquia',
      headerName: 'Jerarquía',
      width: 200,
      type: 'string',
      cellRenderer: (prams) => (
        <Typography variant="p" fontWeight="bold">
          {prams.row.jerarquia}
        </Typography>
      )
    },
    {
      field: 'prioridad',
      headerName: 'Prioridad',
      width: 120,
      type: 'string',
      cellRenderer: (params) => <Chip label={params.row.prioridad} color="primary" size="small" />
    },
    { field: 'proximaFecha', headerName: 'Próxima Fecha', width: 120, type: 'string' },
    {
      field: 'responsables',
      headerName: 'Responsables',
      width: 200,
      type: 'string',
      cellRenderer: (params) => (
        <>
          <Avatar>{params.row.responsables}</Avatar>
        </>
      )
    },
    { field: 'observaciones', headerName: 'Observaciones', width: 200, type: 'string' }
  ];

  const tableDrawerRows = [
    {
      id: 1,
      jerarquia: 'Artículo 2.2.4.6.7.',
      prioridad: 'High',
      proximaFecha: 'Sep 9',
      responsables: 'JV',
      observaciones: 'Observaciones sobre la tarea'
    },
    {
      id: 2,
      jerarquia: 'Artículo 1.6.7.5.2.',
      prioridad: 'Medium',
      proximaFecha: 'Sep 10',
      responsables: 'OC',
      observaciones: 'Observaciones sobre la tarea'
    },
    {
      id: 3,
      jerarquia: 'Artículo 3.4.8.7.5.',
      prioridad: 'Low',
      proximaFecha: 'Sep 11',
      responsables: 'SP',
      observaciones: 'Observaciones sobre la tarea'
    },
    {
      id: 4,
      jerarquia: 'Artículo 4.5.8.7.2.',
      prioridad: 'High',
      proximaFecha: 'Sep 12',
      responsables: 'JL',
      observaciones: 'Observaciones sobre la tarea'
    },
    {
      id: 5,
      jerarquia: 'Artículo 2.6.5.8.1.',
      prioridad: 'Medium',
      proximaFecha: 'Sep 13',
      responsables: 'JV',
      observaciones: 'Observaciones sobre la tarea'
    }
  ];

  const handleLexicalInput = (data) => {};

  const handleAIClick = () => {
    console.log('AI clicked');
    
    setTimeout(() => {
      setLoadingAI('loaded');
    }, 5000);

    setLoadingAI('clicked');
  };

  const handleList1Open = () => {
    setList1Open(!list1Open);
  };

  const handleList2Open = () => {
    setList2Open(!list2Open);
  };

  const handleList3Open = () => {
    setList3Open(!list3Open);
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setOpenMenu(false);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={openOptionsDrawer}
        onClose={() => {
          onCloseOptionsDrawer();
          setLoadingAI('not clicked');
        }}
        PaperProps={{
          sx: {
            maxWidth: '80%', // Maximum width on all screens
            width: {
              sm: '50vw', // On 1280px width, make it 35vw
              md: '40vw', // On 1366px width, make it 38vw
              lg: '80%' // On 1921px width and above, make it 40vw
            }
          }
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
              {t('options')}
            </Typography>
            <IconButton
              edge="end"
              onClick={() => {
                onCloseOptionsDrawer();
                setLoadingAI('not clicked');
              }}
              aria-label="close"
            >
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          gap={6}
          style={{ minHeight: '90vh', overflowY: 'auto', padding: '20px' }}
        >
          <Box flex={1} sx={{ minHeight: '80vh', marginTop: '20px' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<AutoAwesome />}
              onClick={handleAIClick}
            >
              {t('analyze_with_amatia')}
            </Button>
            <LexicalInput placeholder={t('legal_description')} JSONData={handleLexicalInput} />
          </Box>
          <Box flex={1} paddingTop="20px">
            {loadingAI === 'clicked' ? (
              <>
                <Box display="flex" flexDirection="row" gap={2} marginBottom="40px">
                  <Skeleton variant="circular" width="60px" height="60px" />
                  <Skeleton variant="rounded" width="80%" height="60px" />
                </Box>
                <Box display="flex" flexDirection="row" gap={2} marginBottom="40px">
                  <Skeleton variant="circular" width="60px" height="60px" />
                  <Skeleton variant="rounded" width="80%" height="60px" />
                </Box>
                <Box display="flex" flexDirection="row" gap={2} marginBottom="40px">
                  <Skeleton variant="circular" width="60px" height="60px" />
                  <Skeleton variant="rounded" width="80%" height="60px" />
                </Box>
                <Box display="flex" flexDirection="row" gap={2} marginBottom="40px">
                  <Skeleton variant="circular" width="60px" height="60px" />
                  <Skeleton variant="rounded" width="80%" height="60px" />
                </Box>
                <Typography variant="h6" align="center" color="gray">
                  {t('loading_ai')}
                </Typography>
              </>
            ) : loadingAI === 'loaded' ? (
              <>
                <List
                  component="nav"
                  sx={{
                    width: '100%',
                    border: '1px solid rgb(209, 208, 208)',
                    borderRadius: '8px'
                  }}
                >
                  <ListItemButton onClick={handleList1Open}>
                    <ListItemIcon>
                      <AddToPhotos />
                    </ListItemIcon>
                    <ListItemText primary="Establece la obligación de todas las personas y entidades de preservar y restaurar el medio ambiente en Colombia." />
                    {list1Open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={list1Open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <LabelImportant />
                        </ListItemIcon>
                        <ListItemText primary="Adoptar medidas preventivas para evitar daños ambientales" />
                        <Box display="flex" justifyContent="flex-start" alignItems="center" gap={8}>
                          <Tooltip title="Prioridad">
                            <Chip label="High" color="primary" size="small" />
                          </Tooltip>
                          <Tooltip title="Fecha de vencimiento">
                            <Typography variant="p">Sep 13</Typography>
                          </Tooltip>
                          <Tooltip title="Responsable">
                            <Avatar>SA</Avatar>
                          </Tooltip>
                          <IconButton onClick={handleOpenMenu}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <LabelImportant />
                        </ListItemIcon>
                        <ListItemText primary="Restaurar los ecosistemas degradados por acciones humanas" />
                        <Box display="flex" justifyContent="flex-start" alignItems="center" gap={8}>
                          <Tooltip title="Prioridad">
                            <Chip label="High" color="primary" size="small" />
                          </Tooltip>
                          <Tooltip title="Fecha de vencimiento">
                            <Typography variant="p">Sep 13</Typography>
                          </Tooltip>
                          <Tooltip title="Responsable">
                            <Avatar>SA</Avatar>
                          </Tooltip>
                          <IconButton onClick={handleOpenMenu}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </ListItemButton>
                    </List>
                  </Collapse>
                  <Divider />
                  <ListItemButton onClick={handleList2Open}>
                    <ListItemIcon>
                      <AddToPhotos />
                    </ListItemIcon>
                    <ListItemText primary="Define la responsabilidad del Estado y los ciudadanos en la protección de los recursos naturales" />
                    {list2Open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={list2Open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <LabelImportant />
                        </ListItemIcon>
                        <ListItemText primary="Uso sostenible de recursos como el agua, suelo, y biodiversidad" />
                        <Box display="flex" justifyContent="flex-start" alignItems="center" gap={8}>
                          <Tooltip title="Prioridad">
                            <Chip label="High" color="primary" size="small" />
                          </Tooltip>
                          <Tooltip title="Fecha de vencimiento">
                            <Typography variant="p">Sep 13</Typography>
                          </Tooltip>
                          <Tooltip title="Responsable">
                            <Avatar>SA</Avatar>
                          </Tooltip>
                          <IconButton onClick={handleOpenMenu}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <LabelImportant />
                        </ListItemIcon>
                        <ListItemText primary="Implementación de prácticas agrícolas y forestales sostenibles" />
                        <Box display="flex" justifyContent="flex-start" alignItems="center" gap={8}>
                          <Tooltip title="Prioridad">
                            <Chip label="High" color="primary" size="small" />
                          </Tooltip>
                          <Tooltip title="Fecha de vencimiento">
                            <Typography variant="p">Sep 13</Typography>
                          </Tooltip>
                          <Tooltip title="Responsable">
                            <Avatar>SA</Avatar>
                          </Tooltip>
                          <IconButton onClick={handleOpenMenu}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </ListItemButton>
                    </List>
                  </Collapse>
                  <Divider />
                  <ListItemButton onClick={handleList3Open}>
                    <ListItemIcon>
                      <AddToPhotos />
                    </ListItemIcon>
                    <ListItemText primary="Define la responsabilidad del Estado y los ciudadanos en la protección de los recursos naturales" />
                    {list3Open ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={list3Open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <LabelImportant />
                        </ListItemIcon>
                        <ListItemText primary="Uso sostenible de recursos como el agua, suelo, y biodiversidad" />
                        <Box display="flex" justifyContent="flex-start" alignItems="center" gap={8}>
                          <Tooltip title="Prioridad">
                            <Chip label="High" color="primary" size="small" />
                          </Tooltip>
                          <Tooltip title="Fecha de vencimiento">
                            <Typography variant="p">Sep 13</Typography>
                          </Tooltip>
                          <Tooltip title="Responsable">
                            <Avatar>SA</Avatar>
                          </Tooltip>
                          <IconButton onClick={handleOpenMenu}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </ListItemButton>
                    </List>
                    <List component="div" disablePadding>
                      <ListItemButton sx={{ pl: 4 }}>
                        <ListItemIcon>
                          <LabelImportant />
                        </ListItemIcon>
                        <ListItemText primary="Implementación de prácticas agrícolas y forestales sostenibles" />
                        <Box display="flex" justifyContent="flex-start" alignItems="center" gap={8}>
                          <Tooltip title="Prioridad">
                            <Chip label="High" color="primary" size="small" />
                          </Tooltip>
                          <Tooltip title="Fecha de vencimiento">
                            <Typography variant="p">Sep 13</Typography>
                          </Tooltip>
                          <Tooltip title="Responsable">
                            <Avatar>SA</Avatar>
                          </Tooltip>
                          <IconButton onClick={handleOpenMenu}>
                            <MoreVert />
                          </IconButton>
                        </Box>
                      </ListItemButton>
                    </List>
                  </Collapse>
                </List>
                <Box
                  sx={{
                    height: '10%',
                    border: '2px dashed #19aabb',
                    marginTop: '20px'
                  }}
                  align="center"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Typography variant="h4" color="primary">
                    + {t('create_new_item')}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography variant="h6"></Typography>
            )}
          </Box>
        </Box>
      </Drawer>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleCloseMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={handleCloseMenu}>{t('see_notes')}</MenuItem>
        <MenuItem onClick={handleCloseMenu}>{t('createTask')}</MenuItem>
      </Menu>
    </>
  );
}

Component.displayName = 'MessageCenterRisk';
export default Component;
