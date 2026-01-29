import { Add } from '@mui/icons-material';
import { Backdrop, SpeedDial, SpeedDialAction } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function SpeedDialComponent({
  openSpeedDial = false,
  handleCloseSpeedDial = () => {},
  handleOpenSpeedDial = () => {},
  speedDialActions = [],
  handleClick = () => {},
  handleActionClick = () => {}
}) {
  const { t } = useTranslation();

  return (
    <>
      <SpeedDial
        ariaLabel="SpeedDial tooltip example"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
        FabProps={{ color: 'warning' }}
        color="secondary"
        icon={<Add />}
        onClose={handleCloseSpeedDial}
        onOpen={handleOpenSpeedDial}
        open={openSpeedDial}
        direction="up"
      >
        {speedDialActions?.map((action) => (
          <SpeedDialAction
            key={action?.name}
            icon={action?.icon}
            tooltipTitle={t(action?.name)}
            onClick={() => {
              handleClick();
              handleActionClick(action);
            }}
            FabProps={{ sx: { width: 48, height: 48, '& .MuiSvgIcon-root': { fontSize: 24 } } }}
            tooltipprops={{ sx: { width: '500px' } }}
          />
        ))}
      </SpeedDial>
      <Backdrop open={openSpeedDial} sx={{ zIndex: '999' }} />
    </>
  );
}
