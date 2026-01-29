import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { footerHeight } from '../config/constants';

function BaseFeaturePageLayout({ children, showFooter = true, statsConfig = null }) {
  const isStatsAvailable = statsConfig instanceof Array;

  const poweredByDynamicStyleAttrs = isStatsAvailable
    ? {
        maxWidth: {
          lg: '60%', // On 1280px width, make it 60%
          xl: '55%', // On 1366px width, make it 55%
          xxl: '50%' // On 1920px width and above, make it 50%
        }
      }
    : {};

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: grey[100],
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          height: showFooter ? `calc(100% - ${footerHeight}px)` : '100%',
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'nowrap'
        }}
      >
        {children}
      </Box>
      {showFooter && (
        <Box
          sx={{
            height: `${footerHeight}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            pr: 2
          }}
        >
          {isStatsAvailable && (
            <Box
              sx={{
                width: {
                  lg: '40%', // On 1280px width, make it 40%
                  xl: '45%', // On 1366px width, make it 45%
                  xxl: '50%' // On 1920px width and above, make it 50%
                },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                pl: 1
              }}
            >
              {statsConfig.map((config, idx) => {
                const Icon = config.icon;
                return (
                  <Tooltip key={idx} title={config.name}>
                    <IconButton>
                      <Icon />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {config.count}
                      </Typography>
                    </IconButton>
                  </Tooltip>
                );
              })}
            </Box>
          )}
          <Box
            sx={{
              flexGrow: 1,
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              ...poweredByDynamicStyleAttrs
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              Powered by AMATIA Sofactia
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default BaseFeaturePageLayout;
