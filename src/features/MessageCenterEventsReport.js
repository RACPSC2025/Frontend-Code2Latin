import { AddToPhotos, Circle, FilterAlt, MoreVert } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography
} from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CircularGaugePercentage from '../components/CircularGaugePercentage';
import FormBuilder from '../components/FormBuilder';
import TheFullPageLoader from '../components/TheFullPageLoader';
import { fetchTaskCounts } from '../stores/tasks/fetchTaskCountsSlice';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export function MessageCenterEventsReport() {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterPressed, setFilterPressed] = useState(false);
  const [tabValue, setTabValue] = useState('tareas');
  const taskCounts = useSelector((state) => state?.fetchTaskCounts?.data?.data ?? {});
  const taskCountLoading = useSelector((state) => state?.fetchTaskCounts?.loading ?? false);

  const handleFilterButton = () => {
    setFilterPressed(!filterPressed);
  };

  const handleFetchCounts = () => {
    dispatch(fetchTaskCounts()).then((data) => {});
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const boxStyles = {
    border: '1px solid rgba(224, 224, 224, 0.7)',
    borderRadius: '8px',
    // height: '200px',
    padding: '30px'
  };

  const graphicBoxStyles = {
    border: '1px solid rgba(224, 224, 224, 0.7)',
    borderRadius: '8px',
    width: '100%'
  };

  const barChartOptions = {
    title: {
      text: 'Índice de Cumplimiento',
      left: 'center'
    },
    tooltip: {},
    xAxis: {
      data: ['% Índice de Cumplimiento']
    },
    yAxis: {
      min: 0,
      max: 100
    },
    series: [
      {
        // name: '% Índice de Cumplimiento',
        type: 'bar',
        data: [25],
        label: {
          show: true,
          position: 'top',
          fontSize: 16,
          fontWeight: 'bold',
          color: '#000'
        }
      }
    ]
  };

  const pieChart1 = {
    title: {
      text: 'Estado de Tareas',
      left: 'center'
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      top: 40,
      // top: 'center',
      data: ['Abierto', 'Vencido', 'En Progreso', 'Cerrado'],
      formatter: function (name) {
        const data = pieChart1.series[0].data;
        const item = data.find((item) => item.name === name);
        return `${name} ${item.value}`;
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },

    series: [
      {
        type: 'pie',
        radius: '60%',
        data: [
          {
            value: taskCounts?.tasks[3],
            name: 'Abierto'
          },
          {
            value: taskCounts?.tasks[4],
            name: 'Vencido'
          },
          {
            value: taskCounts?.tasks[1],
            name: 'En Progreso'
          },
          {
            value: taskCounts?.tasks[2],
            name: 'Cerrado'
          }
        ]
      }
    ]
  };

  const pieChart2 = {
    title: {
      text: 'Estado de Ciclos',
      left: 'center'
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      top: 40,
      // top: 'center',
      data: ['Abierto', 'Vencido', 'En Progreso', 'Cerrado'],
      formatter: function (name) {
        const data = pieChart1.series[0].data;
        const item = data.find((item) => item.name === name);
        return `${name} ${item.value}`;
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },

    series: [
      {
        type: 'pie',
        radius: '60%',
        data: [
          {
            value: taskCounts?.logtasks[3],
            name: 'Abierto'
          },
          {
            value: taskCounts?.logtasks[4],
            name: 'Vencido'
          },
          {
            value: taskCounts?.logtasks[1],
            name: 'En Progreso'
          },
          {
            value: taskCounts?.logtasks[2],
            name: 'Cerrado'
          }
        ]
      }
    ]
  };

  const stackedBarChart = {
    title: {
      text: 'Actividades por Etiqueta',
      left: 'center'
      // top: '10px'
    },
    // option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow' // 'shadow' as default; can also be 'line' or 'shadow'
      }
    },
    legend: {
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      data: ['Gestión Ambiental', 'Gestión Social', 'Gestión de Permisos', 'Gestión de PMA']
    },
    series: [
      {
        name: 'Abierto',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        // data: [320, 302, 301, 334, 390, 330, 320]
        data: [20, 12, 11, 34]
      },
      {
        name: 'Cerrado',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        // data: [120, 132, 101, 134, 90, 230, 210]
        data: [20, 32, 11, 34]
      },
      {
        name: 'Vencido',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        // data: [220, 182, 191, 234, 290, 330, 310]
        data: [20, 82, 91, 34]
      },
      {
        name: 'Permanente',
        type: 'bar',
        stack: 'total',
        label: {
          show: true
        },
        emphasis: {
          focus: 'series'
        },
        // data: [150, 212, 201, 154]
        data: [50, 12, 11, 54]
      }
    ]
    // }
  };

  const users = [
    { name: 'Jonathan Morina', status: 'green' },
    { name: 'Mason Yarnell', status: 'green' },
    { name: 'Mike Mcalidek', status: 'red' },
    { name: 'Cris Labiso', status: 'red' }
  ];

  const filtersFormData = [
    {
      id: 'tareas',
      label: 'Tareas',
      type: 'dropdown',
      options: [
        { value: '1', label: 'Tareas' },
        { value: '2', label: 'Ciclos' }
      ]
    },
    {
      id: 'fecha_inicio',
      label: 'Fecha de Inicio',
      type: 'date'
    },
    {
      id: 'fecha_fin',
      label: 'Fecha de Fin',
      type: 'date'
    },
    {
      id: 'Portafolio',
      label: 'Portafolio',
      type: 'dropdown',
      options: [
        { value: '1', label: 'Opción 1' },
        { value: '2', label: 'Opción 2' }
      ]
    },
    {
      id: 'repsonsable_revision',
      label: 'Responsable de Revisión',
      type: 'dropdown',
      options: [
        { value: '1', label: 'Opción 1' },
        { value: '2', label: 'Opción 2' }
      ]
    },
    {
      id: 'repsonsable_ejecucion',
      label: 'Responsable de Ejecución',
      type: 'dropdown',
      options: [
        { value: '1', label: 'Opción 1' },
        { value: '2', label: 'Opción 2' }
      ]
    },
    {
      id: 'Estructura Organizacional',
      label: 'Estructura Organizacional (poner estructura completa)',
      type: 'textarea'
    }
  ];

  const statusColors = {
    green: '#4caf50', // Color verde para "completado" o "en progreso"
    red: '#f44336' // Color rojo para "pendiente"
  };

  const calculatePercentage = (total, value) => {
    const result = (value / total) * 100;
    return parseInt(result);
  };

  useEffect(() => {
    handleFetchCounts();
  }, []);

  return (
    <Box>
      {taskCountLoading ? (
        <TheFullPageLoader />
      ) : (
        <>
          <Box
            display="flex"
            paddingRight="50px"
            paddingTop="30px"
            marginBottom="20px"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<FilterAlt />}
              onClick={handleFilterButton}
            >
              FILTRAR
            </Button>
          </Box>
          {filterPressed && (
            <Card sx={{ padding: '20px', margin: '0 50px' }}>
              <Typography variant="h5" margin="15px 0">
                Filtros
              </Typography>
              <FormBuilder
                showActionButton={false}
                inputFields={filtersFormData.slice(3, 4)}
                controlled={false}
                initialValues={{}}
                onChange={(id, value) => {}}
              />
              <div style={{ height: '30px' }}></div>
              <Box display="flex" gap={5}>
                <Box>
                  <FormBuilder
                    showActionButton={false}
                    inputFields={filtersFormData.slice(0, 1)}
                    controlled={false}
                    initialValues={{}}
                    onChange={(id, value) => {}}
                  />
                  <div style={{ height: '30px' }}></div>
                  <FormBuilder
                    formDisplay="flex"
                    showActionButton={false}
                    inputFields={filtersFormData.slice(1, 3)}
                    controlled={false}
                    initialValues={{}}
                    onChange={(id, value) => {}}
                  />
                </Box>
                <Box flexGrow={1}>
                  <FormBuilder
                    showActionButton={false}
                    inputFields={filtersFormData.slice(4, 6)}
                    controlled={false}
                    initialValues={{}}
                    onChange={(id, value) => {}}
                  />
                </Box>
              </Box>
              <Box>
                {/* <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="dropdown1-label">Dropdown 1</InputLabel>
              <Select
                labelId="dropdown1-label"
                // value={dropdown1}
                // onChange={(e) => setDropdown1(e.target.value)}
                label="Dropdown 1"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Option 1</MenuItem>
                <MenuItem value={20}>Option 2</MenuItem>
                <MenuItem value={30}>Option 3</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel id="dropdown2-label">Dropdown 2</InputLabel>
              <Select
                labelId="dropdown2-label"
                // value={dropdown2}
                // onChange={(e) => setDropdown2(e.target.value)}
                label="Dropdown 2"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Option 1</MenuItem>
                <MenuItem value={20}>Option 2</MenuItem>
                <MenuItem value={30}>Option 3</MenuItem>
              </Select>
            </FormControl> */}

                {/* <DatePicker
            label="Date 1"
            // value={date1}
            // onChange={(newValue) => setDate1(newValue)}
            // renderInput={(params) => <TextField {...params} />}
          /> */}

                {/* <DatePicker
            label="Date 2"
            // value={date2}
            // onChange={(newValue) => setDate2(newValue)}
            // renderInput={(params) => <TextField {...params} />}
          /> */}

                {/* <TextField
              label="Text Input 1"
              // value={textInput1}
              // onChange={(e) => setTextInput1(e.target.value)}
            /> */}

                {/* <TextField
              label="Text Input 2"
              // value={textInput2}
              // onChange={(e) => setTextInput2(e.target.value)}
            /> */}

                <div style={{ height: '30px' }}></div>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<FilterAlt />}
                  // onClick={handleFilter}
                >
                  APLICAR FILTRO
                </Button>
              </Box>
            </Card>
          )}
          {taskCounts !== null && (
            <>
              <Typography variant="h5" paddingLeft="50px" marginTop="30px">
                Mostrando información de:
              </Typography>
              <Typography variant="h6" paddingLeft="50px">
                Tareas
              </Typography>
              <Typography variant="h6" paddingLeft="50px">
                Desde el 01/01/2024 hasta el 31/12/2024
              </Typography>
              <Box display="flex" gap={4} marginBottom="30px">
                <Typography variant="h6" color="disabled" paddingLeft="50px">
                  Portafolio ####
                </Typography>
                <Typography variant="h6" color="" paddingLeft="50px">
                  Responsable de Revisión: ####
                </Typography>
                <Typography variant="h6" color="" paddingLeft="50px">
                  Responsable de Ejecución: ####
                </Typography>
              </Box>

              <Box display="flex" justifyContent="space-between" padding="0 50px">
                <Box
                  sx={boxStyles}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                >
                  <Box display="flex" gap={1} flexDirection="row" alignItems="center">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        background: '#01baab',
                        padding: '10px',
                        borderRadius: '50%',
                        // width: '50px',
                        // height: '50px',
                        color: 'white'
                      }}
                    >
                      <AddToPhotos />
                    </Box>
                    <Box>
                      <Typography variant="h5">{taskCounts.tasks[3]} Abiertas</Typography>
                      <Typography variant="p">6 en las próximas 4 semanas</Typography>
                    </Box>
                  </Box>
                  <CircularGaugePercentage
                    color="#01baab"
                    percentage={calculatePercentage(taskCounts.total_tasks, taskCounts.tasks[3])}
                  />
                </Box>
                <Box
                  sx={boxStyles}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                >
                  <Box display="flex" gap={1} flexDirection="row" alignItems="center">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        background: '#ead93e',
                        padding: '10px',
                        borderRadius: '50%',
                        // width: '40px',
                        // height: '40px',
                        color: 'white'
                      }}
                    >
                      <AddToPhotos />
                    </Box>
                    <Box>
                      <Typography variant="h5">{taskCounts.tasks[2]} En Progreso</Typography>
                      <Typography variant="p">6 en las próximas 4 semanas</Typography>
                    </Box>
                  </Box>
                  <CircularGaugePercentage
                    color="#ead93e"
                    percentage={calculatePercentage(taskCounts.total_tasks, taskCounts.tasks[2])}
                  />
                </Box>
                <Box
                  sx={boxStyles}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                >
                  <Box display="flex" gap={1} flexDirection="row" alignItems="center">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        background: '#00f57a',
                        padding: '10px',
                        borderRadius: '50%',
                        // width: '40px',
                        // height: '40px',
                        color: 'white'
                      }}
                    >
                      <AddToPhotos />
                    </Box>
                    <Box>
                      <Typography variant="h5">{taskCounts.tasks[1]} Cerradas</Typography>
                      <Typography variant="p">6 en las próximas 4 semanas</Typography>
                    </Box>
                  </Box>
                  <CircularGaugePercentage
                    color="#00f57a"
                    percentage={calculatePercentage(taskCounts.total_tasks, taskCounts.tasks[1])}
                  />
                </Box>
                <Box
                  sx={boxStyles}
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                >
                  <Box display="flex" gap={1} flexDirection="row" alignItems="center">
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      sx={{
                        background: '#fb3d61',
                        padding: '10px',
                        borderRadius: '50%',
                        // width: '40px',
                        // height: '40px',
                        color: 'white'
                      }}
                    >
                      <AddToPhotos />
                    </Box>
                    <Box>
                      <Typography variant="h5">{taskCounts.tasks[4]} Vencidas</Typography>
                      <Typography variant="p">6 en las próximas 4 semanas</Typography>
                    </Box>
                  </Box>
                  <CircularGaugePercentage
                    color="#fb3d61"
                    percentage={calculatePercentage(taskCounts.total_tasks, taskCounts.tasks[4])}
                  />
                </Box>
              </Box>
              <Typography variant="h4" paddingLeft="50px" marginTop="50px">
                Estado de Ciclos
              </Typography>
              {/* <Box display="flex" justifyContent="space-between" padding="0 50px">
            <Box
              sx={boxStyles}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={2}
            > */}
              {/* <Box display="flex" gap={1} flexDirection="row" alignItems="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    background: '#01baab',
                    padding: '10px',
                    borderRadius: '50%',
                    // width: '50px',
                    // height: '50px',
                    color: 'white'
                  }}
                >
                  <AddToPhotos />
                </Box>
                <Box>
                  <Typography variant="h5">{taskCounts.logtasks[3]} Abiertos</Typography>
                  <Typography variant="p">6 en las próximas 4 semanas</Typography>
                </Box>
              </Box>
              <CircularGaugePercentage
                color="#01baab"
                percentage={calculatePercentage(taskCounts.total_logtasks, taskCounts.logtasks[3])}
              />
            </Box>
            <Box
              sx={boxStyles}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={2}
            >
              <Box display="flex" gap={1} flexDirection="row" alignItems="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    background: '#ead93e',
                    padding: '10px',
                    borderRadius: '50%',
                    // width: '40px',
                    // height: '40px',
                    color: 'white'
                  }}
                >
                  <AddToPhotos />
                </Box>
                <Box>
                  <Typography variant="h5">{taskCounts.logtasks[2]} En Progreso</Typography>
                  <Typography variant="p">6 en las próximas 4 semanas</Typography>
                </Box>
              </Box>
              <CircularGaugePercentage
                color="#ead93e"
                percentage={calculatePercentage(taskCounts.total_logtasks, taskCounts.logtasks[2])}
              />
            </Box>
            <Box
              sx={boxStyles}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={2}
            >
              <Box display="flex" gap={1} flexDirection="row" alignItems="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    background: '#00f57a',
                    padding: '10px',
                    borderRadius: '50%',
                    // width: '40px',
                    // height: '40px',
                    color: 'white'
                  }}
                >
                  <AddToPhotos />
                </Box>
                <Box>
                  <Typography variant="h5">{taskCounts.logtasks[1]} Cerrados</Typography>
                  <Typography variant="p">6 en las próximas 4 semanas</Typography>
                </Box>
              </Box>
              <CircularGaugePercentage
                color="#00f57a"
                percentage={calculatePercentage(taskCounts.total_logtasks, taskCounts.logtasks[1])}
              />
            </Box>
            <Box
              sx={boxStyles}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap={2}
            >
              <Box display="flex" gap={1} flexDirection="row" alignItems="center">
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    background: '#fb3d61',
                    padding: '10px',
                    borderRadius: '50%',
                    // width: '40px',
                    // height: '40px',
                    color: 'white'
                  }}
                >
                  <AddToPhotos />
                </Box>
                <Box>
                  <Typography variant="h5">{taskCounts.logtasks[4]} Vencidos</Typography>
                  <Typography variant="p">6 en las próximas 4 semanas</Typography>
                </Box>
              </Box>
              <CircularGaugePercentage
                color="#fb3d61"
                percentage={calculatePercentage(taskCounts.total_logtasks, taskCounts.logtasks[4])}
              />
            </Box> */}
              {/* </Box> */}
              {/* </Box> */}
            </>
          )}
          <Box
            display="flex"
            justifyContent="space-between"
            padding="50px"
            gap={2}
            flexWrap={{ md: 'wrap', lg: 'nowrap' }}
          >
            {/* <Box  padding="50px" gap={2}> */}
            <Box sx={graphicBoxStyles} padding="30px">
              {/* <ReactECharts option={barChartOptions} style={{ height: '300px', width: '100%' }} /> */}
              {taskCounts !== null && (
                <ReactECharts option={pieChart1} style={{ height: '300px', width: '100%' }} />
              )}
            </Box>
            <Box sx={graphicBoxStyles} padding="30px">
              {taskCounts !== null && (
                <ReactECharts option={pieChart2} style={{ height: '300px', width: '100%' }} />
              )}
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            padding="50px"
            gap={2}
            flexWrap={{ md: 'wrap', lg: 'nowrap' }}
          >
            <Box sx={graphicBoxStyles} padding="30px">
              <ReactECharts option={stackedBarChart} style={{ height: '300px', width: '100%' }} />
            </Box>
            <Box
              // margin="50px"
              sx={{
                // maxWidth: ,
                width: '600px',
                bgcolor: 'background.paper',
                boxShadow: 1,
                borderRadius: 1,
                p: 2
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Desempeño usuarios:
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    En los cuales ha sido nombrado revisor de la tarea
                  </Typography>
                </Box>
                <IconButton edge="end" onClick={(event) => handleMenuOpen(event)}>
                  <MoreVert />
                </IconButton>
              </Box>
              <List>
                {users.map((user) => (
                  <ListItem
                    key={user.name}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)' // Color más oscuro en hover
                      }
                    }}
                    // secondaryAction={
                    // }
                  >
                    <ListItemIcon>
                      <Circle sx={{ color: statusColors[user.status] }} />
                    </ListItemIcon>
                    <ListItemText primary={user.name} />
                  </ListItem>
                ))}
              </List>

              {/* Menu desplegable */}
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleMenuClose}>Opción 1</MenuItem>
                <MenuItem onClick={handleMenuClose}>Opción 2</MenuItem>
                <MenuItem onClick={handleMenuClose}>Opción 3</MenuItem>
              </Menu>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}

export default MessageCenterEventsReport;
