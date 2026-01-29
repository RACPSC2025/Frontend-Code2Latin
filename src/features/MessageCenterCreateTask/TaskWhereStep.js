import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import FormBuilder from '../../components/FormBuilder';
import { fetchTaskListLevel } from '../../stores/tasks/fetchtaskListLevelSlice';
import GeovisorTreeView from './GeovisorTreeView';

function TaskWhereStep({ onTaskWhereStepChange, taskWhereFormModel }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [business, setBusiness] = useState([]);
  const [country, setCountry] = useState([]);
  const [regional, setRegional] = useState([]);
  const [plant, setPlant] = useState([]);
  const [whereFormModel, setWhereFormModel] = useState({});

  const handleFetchTaskListLevel = (level, formData) => {
    const data = { level, formData };
    return dispatch(fetchTaskListLevel(data)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        return data?.payload?.data ?? [];
      }
    });
  };

  const handleFetchRegion = () => {
    handleFetchTaskListLevel(1).then((data) => {
      setRegional(data);
    });
  };

  const handleFetchCountry = (countryId) => {
    if (!countryId) return;
    let formData = new FormData();
    formData.append('id_level1', countryId);
    handleFetchTaskListLevel(2, formData).then((data) => {
      setCountry(data);
    });
  };

  const handleFetchBusiness = (businessId) => {
    if (!businessId) return;
    let formData = new FormData();
    formData.append('id_level2', businessId);
    handleFetchTaskListLevel(3, formData).then((data) => {
      setBusiness(data);
    });
  };

  const handleFetchPlant = (plantId) => {
    if (!plantId) return;
    let formData = new FormData();
    formData.append('id_level3', plantId);
    handleFetchTaskListLevel(4, formData).then((data) => {
      setPlant(data);
    });
  };

  const FormDataWhere = [
    {
      id: 'geovisor_link',
      label: `${t('geovisor_link')}`,
      type: 'dropdown',
      defaultValue: '',
      options: []
    },
    {
      id: 'region',
      label: `${t('Region')}`,
      type: 'dropdown',
      defaultValue: '',
      options: regional
    },
    {
      id: 'country',
      label: `${t('Country')}`,
      type: 'dropdown',
      defaultValue: '',
      options: country
    },
    {
      id: 'business',
      label: `${t('Business')}`,
      type: 'dropdown',
      defaultValue: '',
      options: business
    },
    {
      id: 'plant',
      label: `${t('Plant')}`,
      type: 'dropdown',
      defaultValue: '',
      options: plant
    }
  ];

  useEffect(() => {
    handleFetchRegion();
    setWhereFormModel(taskWhereFormModel);
  }, []);

  useEffect(() => {
    onTaskWhereStepChange(whereFormModel);
  }, [whereFormModel, onTaskWhereStepChange]);

  useEffect(() => {
    // TODO: Add function to clear dependent fields
    handleFetchCountry(whereFormModel.region);
    handleFetchBusiness(whereFormModel.country);
    handleFetchPlant(whereFormModel.business);
  }, [whereFormModel]);

  return (
    <>
      <Typography variant="body1" margin="20px 0">
        {t('where_step_description')}
      </Typography>
      <GeovisorTreeView />
      <Box sx={{ margin: '20px 0' }}>
        <FormBuilder
          showActionButton={false}
          inputFields={FormDataWhere.slice(1, FormDataWhere.length)}
          initialValues={whereFormModel}
          controlled={true}
          onChange={(id, value) => {
            setWhereFormModel((prevState) => ({ ...prevState, [id]: value }));
          }}
        />
      </Box>
    </>
  );
}

export default TaskWhereStep;
