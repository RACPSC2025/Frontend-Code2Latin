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
            justifyContent: 'space-between',
            px: 3,
            background: 'linear-gradient(135deg, #f8fbfc 0%, #ffffff 100%)',
            borderTop: '1px solid #edf2f4',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.02)'
          }}
        >
          {isStatsAvailable && (
            <Box
              sx={{
                width: {
                  lg: '40%',
                  xl: '45%',
                  xxl: '50%'
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
              gap: 1,
              ...poweredByDynamicStyleAttrs
            }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                bgcolor: '#00f57a',
                boxShadow: '0 0 8px rgba(0, 245, 122, 0.4)'
              }}
            />
            <Typography 
              sx={{ 
                fontSize: '0.75rem', 
                fontWeight: 600, 
                color: '#90a4ae',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
            >
              Powered by
            </Typography>
            <Typography 
              sx={{ 
                fontSize: '0.85rem', 
                fontWeight: 800, 
                background: 'linear-gradient(135deg, #1a90ff 0%, #00bcd4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.3px'
              }}
            >
              AMATIA Sofactia
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default BaseFeaturePageLayout;
