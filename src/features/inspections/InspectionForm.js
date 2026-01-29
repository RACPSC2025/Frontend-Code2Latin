import { Box, Button } from '@mui/material';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import FormBuilder from '../../components/FormBuilder';
import { getLocalStorageData, setLocalStorageData } from '../../utils/others';
import InceptionTreeView from './InceptionTreeView';

export default function InspectionForm({
  drawerTitle = '',
  inceptionFields = {},
  setActiveTab = () => {},
  activeTab = 0,
  tabListLength = 0
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({});
  const [formData, setFormData] = useState({});
  const [selectedLocation, setSelectedLocation] = useState([]);

  const handleSubmitForm = () => {
    setLocalStorageData('INSPECTION_LOCATIONS', selectedLocation);
  };

  const handleNext = () => {
    handleSubmitForm();
    setActiveTab((prev) => prev + 1);
  };

  useEffect(() => {
    setFormValues({
      activity_type: t(drawerTitle),
      name: '',
      description: '',
      creation_date: '',
      status: '',
      estimated_duration: '',
      required_resources: '',
      created_by: ''
    });
  }, [drawerTitle, t]);

  useEffect(() => {
    const locations = getLocalStorageData('INSPECTION_LOCATIONS');
    setSelectedLocation(locations);
  }, []);

  const legalFormFields = [
    { id: 'activity_type', label: t('activity_type'), type: 'text' },
    ...(inceptionFields[drawerTitle] || []).map((field) => ({
      ...field,
      label: t(field.label)
    })),
    { id: 'name', label: t('name'), type: 'text' },
    { id: 'description', label: t('description'), type: 'textarea' },
    { id: 'creation_date', label: t('creation_date'), type: 'datetime' },
    {
      id: 'status',
      label: t('status'),
      type: 'dropdown',
      options: [
        { value: 'active', label: t('active') },
        { value: 'inactive', label: t('inactive') }
      ]
    },
    { id: 'estimated_duration', label: t('estimated_duration'), type: 'text' }
  ];

  return (
    <Box className="pb-2 w-full">
      <Box className="gap-2">
        <Suspense fallback={<p>{t('loading')}</p>}>
          <Box className="lg:flex gap-10 my-5">
            <Box className="w-full mb-8 lg:mb-0">
              <FormBuilder
                showActionButton={false}
                inputFields={legalFormFields}
                initialValues={formValues}
                controlled
                onChange={(id, value) => {
                  if (id !== 'activity_type') {
                    setFormValues((prev) => ({ ...prev, [id]: value }));
                  }
                }}
              />
            </Box>
            <InceptionTreeView
              selectedNode={selectedLocation}
              setSelectedNode={setSelectedLocation}
            />
          </Box>
          <Box className="flex justify-end mt-5 mb-5 gap-1.5">
            <Button color="primary" variant="contained" onClick={handleNext}>
              {t('next')}
            </Button>
          </Box>
        </Suspense>
      </Box>
    </Box>
  );
}
