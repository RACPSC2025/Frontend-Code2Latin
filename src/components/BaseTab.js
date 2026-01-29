import { Tab, Tabs, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './BaseTab.css';

function BaseTab({
  items = [],
  activeTab = 0,
  tabContainerProps = {},
  tabItemProps = {},
  valueKey = null,
  showBorderBottom = false
}) {
  const theme = useTheme();
  const { t } = useTranslation();

  let defaultTabContainerProps = {
    className: 'mc-tab',
    ...tabContainerProps
  };

  if (showBorderBottom) {
    defaultTabContainerProps = {
      ...defaultTabContainerProps,
      sx: {
        ...(defaultTabContainerProps?.sx ?? {}),
        '& .MuiTabs-scroller': {
          borderBottom: `solid 2px ${theme.palette.primary.main}`
        }
      }
    };
  }

  return (
    <Tabs value={activeTab} {...defaultTabContainerProps}>
      {items.map((item, index) => {
        let dynamicProps = {};

        if (item.icon) {
          const { icon, iconPosition = 'top' } = item;
          dynamicProps = {
            icon,
            iconPosition
          };
        }

        if (valueKey) {
          dynamicProps = { ...dynamicProps, value: item[valueKey] };
        }

        dynamicProps = { ...dynamicProps, ...tabItemProps };

        return <Tab key={index} label={t(item.label)} {...dynamicProps} />;
      })}
    </Tabs>
  );
}

export default BaseTab;
