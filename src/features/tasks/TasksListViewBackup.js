import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Chip,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  IconButton,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  ListItem,
  ListItemAvatar,
  Avatar,
 ListItemIcon as MuiListItemIcon,
} from '@mui/material';
import {
  Sync as SyncIcon,
  RadioButtonChecked as UniqueIcon,
  CheckCircleOutline as PermanentIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  DownloadDone,
  Loop,
  AssignmentReturned,
  MoreVert,
  DeleteOutline,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import TaskCycleRow from './TaskCycleRow';
import TaskDetailsSidebar from './TaskDetailsSidebar';
import { fetchListTaskNew } from '../../stores/tasks/fetchListTaskNewSlice';
import { fetchLogtaskList } from '../../stores/tasks/fetchLogtaskListSlice';
import { selectFilterItemValue, setFilter } from '../../stores/filterSlice';
import TaskDoubleRingChart from '../../components/TaskDoubleRingChart';

const TasksListView = ({ onCreateTask }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // States
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedLogtask, setSelectedLogtask] = useState(null);
  const [logtasks, setLogtasks] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;
  const [currentCyclePage, setCurrentCyclePage] = useState(1);
  const cyclesPerPage = 10;
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  // Redux Selectors
  const taskListLoading = useSelector((state) => state?.fetchListTaskNew?.loading ?? false);
  const logtaskListLoading = useSelector((state) => state?.fetchLogtaskList?.loading ?? false);
  const listTaskStatus = useSelector((state) => selectFilterItemValue(state, 'task', 'task_list_status')) || [];
  const selectedStatus = useSelector((state) => selectFilterItemValue(state, 'task', 'selectedStatus'));

  /* 🎭 Data Mock - Bloque preservado (Migración: 05/02/2026)
  useEffect(() => {
    dispatch(fetchListTaskNew({})).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const tasksData = data?.payload?.data || [];
        setTasks(tasksData);
        if (tasksData.length > 0 && !selectedTask) {
          handleSelectTask(tasksData[0]);
        }
      }
    });
  }, [dispatch]);
  */

  // ✅ API Real - Migración Sofactia (05/02/2026)
  useEffect(() => {
    console.log("🚀 Iniciando carga de tareas reales...");
    
    dispatch(fetchListTaskNew({})).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const tasksData = data?.payload?.data || [];
        
        console.log("📋 Procesando tareas recibidas:", tasksData.length);
        
        // ⚠️ MAPEO CRÍTICO: La API devuelve campos con nombres diferentes
        const mappedTasks = tasksData.map(task => ({
          ...task,
          // Mapear campos de fecha
          start_date: task.task_start_date || task.start_date,
          end_date: task.task_end_date || task.end_date,
          // Manejo de valores null con defaults
          task_type: task.task_type || 'CÍCLICA',
          task_title: task.task_title?.trim() || 'Sin título',
          // Convertir tags de objeto a array
          tags: task.tags ? Object.values(task.tags) : [],
          // Asegurar que progress sea número
          progress: parseFloat(task.progress) || 0
        }));
        
        setTasks(mappedTasks);
        
        // Auto-seleccionar primera tarea si existe
        if (mappedTasks.length > 0 && !selectedTask) {
          console.log("🎯 Seleccionando primera tarea:", mappedTasks[0].task_title);
          handleSelectTask(mappedTasks[0]);
        }
      } else {
        console.error("❌ Error en respuesta de API:", data?.payload?.messages);
      }
    }).catch((error) => {
      console.error("❌ Error al cargar tareas:", error);
    });
  }, [dispatch]);

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setSelectedLogtask(null);
    
    if (task?.logtask_list && task.logtask_list.length > 0) {
      setLogtasks(task.logtask_list);
      setSelectedLogtask(task.logtask_list[0]);
    } else {
      dispatch(fetchLogtaskList({ task_id: task.id })).then((data) => {
        if (data?.payload?.messages === 'Success') {
          const logtaskData = data?.payload?.data || [];
          setLogtasks(logtaskData);
          if (logtaskData.length > 0) {
            setSelectedLogtask(logtaskData[0]);
          }
        }
      });
    }
  };

  const getTaskIcon = (type, isSelected) => {
    const typeColors = {
      'ÚNICA': '#ba68c8',
      'PERMANENTE': '#ff9800',
      'CÍCLICA': '#90a4ae'
    };
    const iconColor = isSelected ? '#1a90ff' : (typeColors[type?.toUpperCase()] || '#90a4ae');
    const iconStyle = { fontSize: 24, color: iconColor, transition: 'color 0.2s ease' };
    
    switch (type?.toUpperCase()) {
      case 'ÚNICA': return <UniqueIcon sx={iconStyle} />;
      case 'PERMANENTE': return <PermanentIcon sx={iconStyle} />;
      case 'CÍCLICA':
      default: return <SyncIcon sx={iconStyle} />;
    }
  };

  // Funciones para manejar el menú desplegable
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Manejar la selección de tipo de tarea
  const handleCreateTask = (taskType) => {
    // Llama a la función pasada como prop para manejar la creación de tareas
    if (onCreateTask) {
      onCreateTask(taskType);
    }
    handleMenuClose();
  };

  // Cálculos para el Dashboard
  const stats = useMemo(() => {
    if (!logtasks || logtasks.length === 0) {
      return { completed: 0, inProgress: 0, expired: 0, open: 0, averageProgress: 0 };
    }

    const counts = { completed: 0, inProgress: 0, expired: 0, open: 0 };
    let totalProgress = 0;

    logtasks.forEach(lt => {
      const status = String(lt.logtask_status || lt.task_status);
      const progress = lt.percentage || lt.progress || 0;
      totalProgress += progress;

      if (status === '1') counts.completed++;
      else if (status === '2') counts.inProgress++;
      else if (status === '4') counts.expired++;
      else if (status === '3') counts.open++;
    });

    return {
      ...counts,
      averageProgress: Math.round(totalProgress / logtasks.length)
    };
  }, [logtasks]);

  return (
    <Box sx={{ display: 'flex', height: '100%', width: '100%', bgcolor: '#f5f7f9', overflow: 'hidden' }}>
      
      {/* Sidebar Izquierda - Tareas (Mini Sidebar) */}
      <Box
        sx={{
          width: isCollapsed ? '70px' : '280px',
          borderRight: '1px solid #e0e0e0',
          bgcolor: 'white',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          flexShrink: 0
        }}
      >
        <Box sx={{ p: '12px 0 8px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          {!isCollapsed && (
            <Box sx={{ position: 'absolute', left: 20, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ fontWeight: 800, color: '#b0bec5', fontSize: '0.75rem', letterSpacing: 1.5 }}>
                TAREAS
              </Typography>
              <Box sx={{ bgcolor: '#eceff1', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 800, color: '#455a64' }}>{tasks.length}</Typography>
              </Box>
            </Box>
          )}
          <Box sx={{ ml: isCollapsed ? 0 : 'auto', mr: isCollapsed ? 0 : 1 }}>
            <IconButton size="small" onClick={() => setIsCollapsed(!isCollapsed)} sx={{ color: '#b0bec5' }}>
              {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </Box>
        </Box>
        
        <List sx={{ p: 0, flex: 1, overflowY: 'auto' }}>
          {taskListLoading ? (
            <Box sx={{ p: 2, textAlign: 'center' }}><CircularProgress size={20} /></Box>
          ) : (
            (() => {
              const startIndex = (currentPage - 1) * tasksPerPage;
              const endIndex = startIndex + tasksPerPage;
              const paginatedTasks = tasks.slice(startIndex, endIndex);
              
              return paginatedTasks.map((task) => {
                const isSelected = selectedTask?.id === task.id;
                return (
                  <Tooltip key={task.id} title={isCollapsed ? task.task_title : ""} placement="right">
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => handleSelectTask(task)}
                      sx={{
                        py: 0.5,
                        px: 0,
                        justifyContent: 'center',
                        borderLeft: isSelected ? '4px solid #1a90ff' : '4px solid transparent',
                        bgcolor: isSelected ? '#f5f9ff !important' : 'transparent',
                        '&:hover': { bgcolor: '#f8fbfc' },
                        minHeight: '36px'
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: isCollapsed ? 0 : 40, justifyContent: 'center' }}>
                        {getTaskIcon(task.task_type, isSelected)}
                      </ListItemIcon>
                      {!isCollapsed && (
                        <ListItemText
                          primary={
                            <Typography sx={{ fontWeight: 700, color: isSelected ? '#1a90ff' : '#263238', fontSize: '0.75rem', lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {task.task_title}
                            </Typography>
                          }
                          secondary={
                            <Typography sx={{ textTransform: 'uppercase', fontSize: '0.5rem', fontWeight: 800, color: isSelected ? '#1a90ff80' : '#b0bec5', mt: 0.1 }}>
                              {task.task_type || 'CÍCLICA'}
                            </Typography>
                          }
                        />
                      )}
                    </ListItemButton>
                  </Tooltip>
                );
              });
            })()
          )}
        </List>
        
        {/* Paginación */}
        {!isCollapsed && tasks.length > tasksPerPage && (
          <Box sx={{ p: 1, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5 }}>
            <IconButton 
              size="small" 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              sx={{ width: 24, height: 24 }}
            >
              <ChevronLeftIcon sx={{ fontSize: 16 }} />
            </IconButton>
            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#455a64', minWidth: 60, textAlign: 'center' }}>
              {currentPage} / {Math.ceil(tasks.length / tasksPerPage)}
            </Typography>
            <IconButton 
              size="small" 
              onClick={() => setCurrentPage(Math.min(Math.ceil(tasks.length / tasksPerPage), currentPage + 1))}
              disabled={currentPage === Math.ceil(tasks.length / tasksPerPage)}
              sx={{ width: 24, height: 24 }}
            >
              <ChevronRightIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* Panel Central con Filtro Superior */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        {/* Barra de Filtros Contextual */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          bgcolor: 'white',
          borderBottom: '1px solid #edf2f4',
          flexShrink: 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontWeight: 800, color: '#90a4ae', fontSize: '0.75rem', letterSpacing: 1.5 }}>
              FILTRAR ESTADO
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              {listTaskStatus.map((status) => {
                const isActive = selectedStatus === status.value;
                return (
                  <Tooltip key={status.value} title={t(status.label)}>
                    <Box 
                      onClick={() => {
                        const newValue = isActive ? -1 : status.value;
                        dispatch(setFilter({ module: 'task', updatedFilter: { selectedStatus: newValue } }));
                      }}
                      sx={{ 
                        width: isActive ? 16 : 12, 
                        height: isActive ? 16 : 12, 
                        borderRadius: '50%', 
                        bgcolor: status.color_code, 
                        cursor: 'pointer',
                        border: isActive ? '2px solid #fff' : 'none',
                        outline: isActive ? `2px solid ${status.color_code}` : 'none',
                        transition: 'all 0.2s ease',
                        '&:hover': { transform: 'scale(1.3)' }
                      }} 
                    />
                  </Tooltip>
                );
              })}
              {selectedStatus && selectedStatus !== -1 && selectedStatus !== 0 && (
                <Tooltip title={t('Limpiar filtro')}>
                  <IconButton 
                    size="small" 
                    onClick={() => dispatch(setFilter({ module: 'task', updatedFilter: { selectedStatus: -1 } }))}
                    sx={{ color: '#90a4ae', ml: 1, p: 0.5 }}
                  >
                    <DeleteOutline sx={{ fontSize: '1.2rem' }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Button
            variant="contained"
            sx={{
              bgcolor: '#00F57A',
              '&:hover': { bgcolor: '#00cc76' },
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              px: 3,
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
            onClick={handleMenuOpen}
            endIcon={<MoreVert />}
            aria-controls={openMenu ? 'task-creation-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={openMenu ? 'true' : undefined}
          >
            Crear tarea
          </Button>

          <Menu
            id="task-creation-menu"
            anchorEl={anchorEl}
            open={openMenu}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                '& .MuiAvatar-root': {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => handleCreateTask('permanente')}>
              <MuiListItemIcon>
                <DownloadDone fontSize="small" />
              </MuiListItemIcon>
              <Typography>Añadir Tarea Permanente</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleCreateTask('ciclica')}>
              <MuiListItemIcon>
                <Loop fontSize="small" />
              </MuiListItemIcon>
              <Typography>Añadir Tarea Cíclica</Typography>
            </MenuItem>
            <MenuItem onClick={() => handleCreateTask('unica')}>
              <MuiListItemIcon>
                <AssignmentReturned fontSize="small" />
              </MuiListItemIcon>
              <Typography>Añadir Tarea Única</Typography>
            </MenuItem>
          </Menu>
        </Box>

        {/* Contenido Scrollable: Dashboard + Tabla */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
          {/* Card de Cabecera (Dashboard) */}
          {selectedTask && (
            <Paper
              elevation={0}
              sx={{
                p: 1.5,
                mb: 1,
                borderRadius: 3,
                border: '1px solid #edf2f4',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: 'white'
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#263238', fontSize: '1.0rem' }}>
                  {selectedTask.task_title}
                </Typography>
              </Box>

              <Box display="flex" alignItems="center" gap={3}>
                <TaskDoubleRingChart 
                  percentage={stats.averageProgress}
                  stats={stats}
                  size={80}
                  strokeWidth={8}
                />

                {/* Estados de los ciclos en formato vertical */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.3, alignItems: 'flex-start' }}>
                  {[
                    { label: 'Completado', color: '#00f57a', count: stats.completed },
                    { label: 'En Progreso', color: '#1a90ff', count: stats.inProgress },
                    { label: 'Vencido', color: '#fb3d61', count: stats.expired },
                    { label: 'Abierto', color: '#fbc02d', count: stats.open }
                  ].map((item) => (
                    <Box key={item.label} display="flex" alignItems="center" gap={0.5}>
                      <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: item.color }} />
                      <Typography sx={{ color: '#78909c', fontWeight: 600, fontSize: '0.6rem' }}>
                        {item.label}: <b>{item.count}</b>
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          )}

          {/* Tabla de Ciclos */}
          <Paper elevation={0} sx={{ border: '1px solid #edf2f4', borderRadius: 3, overflow: 'hidden', bgcolor: 'white', mt: 0.5 }}>
            <Box sx={{ display: 'flex', p: '8px 12px', bgcolor: 'white', borderBottom: '1px solid #edf2f4' }}>
              <Box flex="0 0 100px"><Typography variant="caption" sx={{ fontWeight: 800, color: '#90a4ae', fontSize: '0.65rem' }}>INICIO</Typography></Box>
              <Box flex="0 0 100px"><Typography variant="caption" sx={{ fontWeight: 800, color: '#90a4ae', fontSize: '0.65rem' }}>CIERRE PROG.</Typography></Box>
              <Box flex="0 0 100px"><Typography variant="caption" sx={{ fontWeight: 800, color: '#90a4ae', fontSize: '0.65rem' }}>CIERRE REAL</Typography></Box>
              <Box flex="0 0 110px"><Typography variant="caption" sx={{ fontWeight: 800, color: '#90a4ae', fontSize: '0.65rem' }}>OPORTUNIDAD</Typography></Box>
              <Box flex="1 1 auto" textAlign="center"><Typography variant="caption" sx={{ fontWeight: 800, color: '#90a4ae', fontSize: '0.65rem' }}>ACCIONES</Typography></Box>
              <Box flex="0 0 140px" textAlign="right" pr={1}><Typography variant="caption" sx={{ fontWeight: 800, color: '#90a4ae', fontSize: '0.65rem' }}>PROGRESO</Typography></Box>
            </Box>

            <Box>
              {logtaskListLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress size={25} /></Box>
              ) : (
                (() => {
                  const filtered = logtasks.filter(lt => {
                    if (!selectedStatus || selectedStatus === -1 || selectedStatus === 0) return true;
                    return String(lt.logtask_status) === String(selectedStatus);
                  });

                  if (filtered.length === 0 && logtasks.length > 0) {
                    return (
                      <Box sx={{ p: 2, textAlign: 'center' }}>
                        <Typography sx={{ color: '#90a4ae', fontWeight: 600, fontSize: '0.8rem' }}>
                          No hay ciclos con este estado para esta tarea.
                        </Typography>
                      </Box>
                    );
                  }

                  // Limpiar la selección si el ciclo seleccionado no está en la vista filtrada
                  if (selectedLogtask && !filtered.some(l => l.id === selectedLogtask.id)) {
                    setSelectedLogtask(null);
                  }

                  // Pagination logic
                  const startIndex = (currentCyclePage - 1) * cyclesPerPage;
                  const endIndex = startIndex + cyclesPerPage;
                  const paginatedCycles = filtered.slice(startIndex, endIndex);

                  return paginatedCycles.map((logtask, index) => (
                    <TaskCycleRow
                      key={logtask.id}
                      index={index}
                      task={{
                        ...logtask,
                        task_status: logtask.logtask_status,
                        start_date: logtask.start_date,
                        end_date: logtask.end_date || logtask.finish_date,
                        progress: logtask.percentage || logtask.progress || 0,
                        opportunity_days: logtask.opportunity_days || 0
                      }}
                      statuses={listTaskStatus}
                      onSelect={() => setSelectedLogtask(logtask)}
                      isSelected={selectedLogtask?.id === logtask.id}
                    />
                  ));
                })()
              )}
            </Box>
            
            {/* Paginación de Ciclos */}
            {!logtaskListLoading && (() => {
              const filtered = logtasks.filter(lt => {
                if (!selectedStatus || selectedStatus === -1 || selectedStatus === 0) return true;
                return String(lt.logtask_status) === String(selectedStatus);
              });
              
              const totalPages = Math.max(1, Math.ceil(filtered.length / cyclesPerPage));
              const isOnlyOnePage = filtered.length <= cyclesPerPage;
              
              return (
                <Box sx={{ p: 1, borderTop: '1px solid #edf2f4', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 0.5, bgcolor: 'white' }}>
                  <IconButton 
                    size="small" 
                    onClick={() => setCurrentCyclePage(Math.max(1, currentCyclePage - 1))}
                    disabled={currentCyclePage === 1 || isOnlyOnePage}
                    sx={{ width: 24, height: 24 }}
                  >
                    <ChevronLeftIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#455a64', minWidth: 60, textAlign: 'center' }}>
                    {currentCyclePage} / {totalPages}
                  </Typography>
                  <IconButton 
                    size="small" 
                    onClick={() => setCurrentCyclePage(Math.min(totalPages, currentCyclePage + 1))}
                    disabled={currentCyclePage === totalPages || isOnlyOnePage}
                    sx={{ width: 24, height: 24 }}
                  >
                    <ChevronRightIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              );
            })()}
          </Paper>
        </Box>
      </Box>

      {/* Sidebar Derecha - Detalles */}
      <Box sx={{
        width: isRightSidebarCollapsed ? '40px' : '280px',
        flexShrink: 0,
        bgcolor: 'white',
        borderLeft: '1px solid #e0e0e0',
        overflowX: 'hidden',
        overflowY: 'auto',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative'
      }}>
        {isRightSidebarCollapsed ? (
          <IconButton
            size="small"
            onClick={() => setIsRightSidebarCollapsed(false)}
            sx={{
              color: '#b0bec5',
              position: 'absolute',
              top: '10px',
              right: '10px',
              zIndex: 10
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        ) : (
          <TaskDetailsSidebar
            selectedTask={selectedLogtask || selectedTask}
            statuses={listTaskStatus}
            onCollapse={() => setIsRightSidebarCollapsed(true)}
          />
        )}
      </Box>
    </Box>
  );
};

export default TasksListView;
