import { Alert, Box, Button, Snackbar } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaseTab from '../../components/BaseTab';
import FormBuilder from '../../components/FormBuilder';

export default function ActionsDetails({
  isFetching,
  formFields,
  formTabItems: tabItems,
  formModel,
  onUpdateModel,
  onSubmit,
  onCancel,
  showBorderRadius = true
}) {
  const [activeTab, setActiveTab] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const [firstItem] = tabItems;
    if (firstItem) {
      setActiveTab(firstItem.key);
    }
  }, [tabItems]);

  const tabSpecificInputFields = useMemo(() => {
    const inputFieldsMapping = formFields[activeTab] || {};

    if (Object.keys(inputFieldsMapping).length) {
      return Object.keys(inputFieldsMapping).map((fieldKey) => {
        const field = inputFieldsMapping[fieldKey];
        const { name: id, ...rest } = field;
        return { id, ...rest };
      });
    }
    return [];
  }, [formFields, activeTab]);

  const containerProps = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    ...(showBorderRadius && { borderRadius: '0px' })
  };

  const vertical = 'bottom';
  const horizontal = 'left';

  const showAlert = () => {
    setOpenAlert(true);
  };

  const hideAlert = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  if (!activeTab) return null;

  return (
    <>
      <Box sx={containerProps}>
        <BaseTab
          items={tabItems}
          activeTab={activeTab}
          tabContainerProps={{
            sx: {
              flexShrink: 0
            },
            variant: 'fullWidth',
            onChange: (_, value) => setActiveTab(value)
          }}
          valueKey="key"
          // showBorderBottom
        />
        <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: 'auto', p: 1, mt: 2 }}>
          {isFetching ? (
            <Box>{t('loading')}</Box>
          ) : (
            <FormBuilder
              inputFields={tabSpecificInputFields}
              initialValues={formModel}
              showActionButton={false}
              controlled={true}
              onChange={onUpdateModel}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1, borderTop: 1 }}>
          <Button
            variant="contained"
            size="small"
            color="primary"
            sx={{ mx: 1 }}
            onClick={() => {
              onSubmit(showAlert);
            }}
          >
            {t('Save')}
          </Button>
          <Button
            variant="outlined"
            size="small"
            color="secondary"
            sx={{ mx: 1 }}
            onClick={onCancel}
          >
            {t('Cancel')}
          </Button>
        </Box>
      </Box>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openAlert}
        autoHideDuration={6000}
        onClose={hideAlert}
      >
        <Alert onClose={hideAlert} severity="success" sx={{ width: '100%' }}>
          {t('FormSavedMessage')}
        </Alert>
      </Snackbar>
    </>
  );
}
