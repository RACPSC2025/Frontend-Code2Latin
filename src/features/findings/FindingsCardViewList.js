import { Delete, Lock, LockOpen, Logout, Search, Settings } from '@mui/icons-material';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  IconButton,
  SvgIcon,
  Tooltip,
  Typography
} from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { ReactComponent as EditSquare } from '../../assets/icons/edit-square.svg';
import { ReactComponent as HTML } from '../../assets/icons/html-icon.svg';

export default function FindingsCardViewList() {
  const { t } = useTranslation();

  // Date formatting to avoid repeated calls
  const currentDay = dayjs().format('DD');
  const currentMonth = dayjs().format('MMM');
  const currentYear = dayjs().format('YYYY');

  const renderCardContent = (index) => (
    <Card
      sx={{
        maxWidth: 345,
        border: 'rgb(229 231 235 / var(--tw-border-opacity, 1))',
        width: '300px'
      }}
      key={index}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgb(229 231 235 / var(--tw-bg-opacity, 1))',
          color: 'rgb(75 85 99 / var(--tw-text-opacity, 1))',
          p: 0.5
        }}
      >
        <Typography>{`${index + 1} | ${t('regulatory_update')}`}</Typography>
        <IconButton>
          {index % 2 ? (
            <Tooltip title={'Locked'}>
              <Lock />
            </Tooltip>
          ) : (
            <Tooltip title={'Open'}>
              <LockOpen />
            </Tooltip>
          )}
        </IconButton>
      </Box>
      <CardMedia
        component="img"
        height="194"
        image="https://picsum.photos/536/354"
        alt="Paella dish"
      />
      <Divider
        sx={{
          backgroundColor:
            index % 2
              ? 'rgb(101 163 13 / var(--tw-bg-opacity, 1))'
              : 'rgb(251 146 60 / var(--tw-bg-opacity, 1))',
          height: '5px'
        }}
      />
      <CardContent
        sx={{
          display: 'flex',
          width: '100%',
          gap: 1,
          minHeight: '15rem'
        }}
      >
        <Box sx={{ width: '30%', textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 'bold' }}>{currentDay}</Typography>
          <Typography sx={{ fontWeight: 'bold' }}>{currentMonth}</Typography>
          <Typography sx={{ fontWeight: 'bold' }}>{currentYear}</Typography>
        </Box>
        <Box sx={{ width: '70%', textAlign: 'start' }}>
          <Typography sx={{ fontWeight: '600px' }}>
            {t('actualization')} {t('technological')}
          </Typography>
          <Typography>{`${t('record')} :`}</Typography>
          <Typography>{`${t('Company')} :`}</Typography>
          <Typography>{`${t('reports')} :`}</Typography>
        </Box>
        <Box sx={{ width: '20%', textAlign: 'center' }}>
          <IconButton>
            <Search />
          </IconButton>
          <IconButton>
            <SvgIcon component={EditSquare} inheritViewBox />
          </IconButton>
          <IconButton>
            <SvgIcon component={HTML} inheritViewBox />
          </IconButton>
          <IconButton>
            <Settings />
          </IconButton>
          <IconButton>
            <Delete />
          </IconButton>
        </Box>
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          backgroundColor: 'rgb(229 231 235 / var(--tw-bg-opacity, 1))',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography>{`(${index + 1}) ${t('Actions')} |`}</Typography>
        <IconButton sx={{ display: 'flex', transform: 'rotate(-0.25turn)' }}>
          <Logout />
        </IconButton>
      </CardActions>
    </Card>
  );

  return (
    <Box className="flex w-full gap-4 flex-wrap">
      {[...Array(10)].map((_, index) => renderCardContent(index))}
    </Box>
  );
}
