import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  AppBar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Drawer,
  IconButton,
  Toolbar,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getLegalDetails } from '../../stores/legal/getLegalDetailsSlice';
import TablaDetalles from './TablaDetalles';

function DetallesDrawer({ openDetallesDrawer, onCloseDetallesDrawer, idRequisito }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openCollapseNorma, setOpenCollapseNorma] = useState(false);
  const [openCollapseArticulos, setOpenCollapseArticulos] = useState(false);

  const legalDetails = useSelector((state) => state?.getLegalDetails?.data?.data ?? {});

  const handleGetLegalDetails = () => {
    let formData = new FormData();
    //formData.append('legal_id', idRequisito);
    formData.append('id_requisito', '11');
    dispatch(getLegalDetails(formData));
  };

  useEffect(() => {
    if (idRequisito.length === 0) return;
    handleGetLegalDetails();
  }, [idRequisito]);

  return (
    <Drawer
      anchor="right"
      open={openDetallesDrawer}
      onClose={onCloseDetallesDrawer}
      PaperProps={{
        sx: {
          maxWidth: '700px', // Maximum width on all screens
          width: {
            sm: '70vw', // On 1280px width, make it 35vw
            md: '70vw', // On 1366px width, make it 38vw
            lg: '700px' // On 1920px width and above, make it 40vw
          }
        }
      }}
    >
      <AppBar position="static">
        <Toolbar>
          <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
            {t('details')}
          </Typography>
          <IconButton edge="end" onClick={onCloseDetallesDrawer} aria-label="close">
            <CloseIcon sx={{ color: 'white' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
        <Card
          sx={{
            minWidth: '90%',
            border: '1px solid rgba(211,211,211,0.6)',
            padding: '10px',
            margin: '20px'
          }}
        >
          <CardHeader
            title={t('information_on_the_standard')}
            action={
              <IconButton
                onClick={() => setOpenCollapseNorma(!openCollapseNorma)}
                aria-label="expand"
                size="small"
              >
                {openCollapseNorma ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            }
          ></CardHeader>
          <Box>
            <Collapse in={openCollapseNorma} timeout="auto" unmountOnExit>
              <CardContent>
                <Box>
                  <TablaDetalles data={legalDetails} />
                </Box>
              </CardContent>
            </Collapse>
          </Box>
        </Card>
        <Card
          sx={{
            minWidth: '90%',
            border: '1px solid rgba(211,211,211,0.6)',
            padding: '10px',
            margin: '20px'
          }}
        >
          <CardHeader
            title={t('information_on_the_articles')}
            action={
              <IconButton
                onClick={() => setOpenCollapseArticulos(!openCollapseArticulos)}
                aria-label="expand"
                size="small"
              >
                {openCollapseArticulos ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            }
          ></CardHeader>
          <Box>
            <Collapse in={openCollapseArticulos} timeout="auto" unmountOnExit>
              <CardContent>
                <Box></Box>
              </CardContent>
            </Collapse>
          </Box>
        </Card>
      </div>
    </Drawer>
  );
}

export default DetallesDrawer;
