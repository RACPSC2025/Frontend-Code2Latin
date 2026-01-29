import { Box, Tooltip, SvgIcon } from '@mui/material';

import StatusDoughnutChartNavbar from './StatusDoughnutChartNavbar';

function TheLayoutNavbarActionItem({ icon, label, isActive, ...rest }) {
  let base = '1.5rem';
  let defaultStyle = { width: '100%', position: 'relative', color: 'icon.main', cursor: 'pointer' };
  const { sx, ...others } = rest;

  if (isActive) {
    defaultStyle = {
      ...defaultStyle,
      color: '#fff'
      // '&:after': {
      //   content: '""',
      //   position: 'absolute',
      //   display: 'inline-block',
      //   width: `calc(${base} * 0.7)`,
      //   height: `calc(${base} * 0.7)`,
      //   top: '30%',
      //   right: `calc(${base} * 0.7 * -0.5)`,
      //   bgcolor: 'black.main',
      //   transform: 'rotate(45deg)',
      //   zIndex: 1
      // }
    };
  }

  return (
    <Tooltip
        title={label}
        placement='top'
        PopperProps={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, -20],
              },
            },
          ],
        }}
      >
      <Box sx={{ ...defaultStyle, ...sx }}>
        <StatusDoughnutChartNavbar {...others} />
        <SvgIcon
          component={icon}
          inheritViewBox
          sx={{
            position: 'absolute',
            color: 'gray',
            width: base,
            height: base,
            top: `calc((100% - ${base}) * 0.6)`,
            left: `calc((100% - ${base}) * 0.5)`
          }}
        />
      </Box>
    </Tooltip>
  );
}

export default TheLayoutNavbarActionItem;
