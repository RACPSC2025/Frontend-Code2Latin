import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FormBuilder from '../../components/FormBuilder';
import TagsSelector from '../../components/Input/TagsSelector';
import { fetchAdministratorsList } from '../../stores/tasks/fetchAdministratorsListSlice';
import { fetchContractorList } from '../../stores/tasks/fetchContractorListSlice';
import { getPositionUserList } from '../../stores/tasks/getPositionUserListSlice';
import { getSettings } from '../../stores/tasks/getSettingsSlice';

function TaskWhoStep({ onTaskWhoStepChange, taskWhoFormModel }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [executor, setExecutor] = useState([]);
  const [reviewer, setReviewer] = useState([]);
  const [contractor, setContractor] = useState([]);
  const [whoFormModel, setWhoFormModel] = useState({});
  const [setting, setSettings] = useState({});

  const settings = useSelector((state) => state?.getSettings?.data?.data ?? {});

  const handleGetSettings = () => {
    dispatch(getSettings());
  };

  const handleFetchAdministrators = () => {
    dispatch(fetchAdministratorsList()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        setUser(data?.payload?.data);
      }
    });
  };

  const handleGetPositionUserList = () => {
    dispatch(getPositionUserList()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        const dropdownData = data?.payload?.data?.map((item) => {
          return { value: item.id, label: `${item.position_name} - (${item.person_name})` };
        });
        setExecutor(dropdownData);
        setReviewer(dropdownData);
      }
    });
  };

  const handleFetchContractorList = () => {
    dispatch(fetchContractorList()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        setContractor(data?.payload?.data);
      }
    });
  };

  const handleExecutorSelection = (tags) => {
    const tagValues = tags.map((tag) => tag.value);
    const joinedTagValues = tagValues.join(',');
    setWhoFormModel((prevState) => ({ ...prevState, responsible: joinedTagValues }));
  };

  const handleReviewerSelection = (tags) => {
    const tagValues = tags.map((tag) => tag.value);
    const joinedTagValues = tagValues.join(',');
    setWhoFormModel((prevState) => ({ ...prevState, reviewer: joinedTagValues }));
  };

  const FormDataWho = [
    {
      id: 'responsible',
      label: `${t('execution_responsible')}`,
      type: 'autocomplete',
      defaultValue: '',
      options: executor
    },
    {
      id: 'reviewer',
      label: `${t('reviewer_responsible')}`,
      type: 'autocomplete',
      defaultValue: '',
      options: reviewer
    },
    {
      id: 'contractor_company',
      label: `${t('choose_contractor')}`,
      type: 'autocomplete',
      defaultValue: '',
      options: contractor
    },
    {
      id: 'contract',
      label: `${t('choose_contract')}`,
      type: 'dropdown',
      defaultValue: '',
      options: [
        { value: 'value1', label: 'value1' },
        { value: 'value2', label: 'value2' }
      ]
    }
  ];

  useEffect(() => {
    handleGetSettings();
    // fetchPositionUserList();
    handleGetPositionUserList();
    // fetchContractor();
    handleFetchContractorList();

    setWhoFormModel(taskWhoFormModel);
  }, []);

  useEffect(() => {
    onTaskWhoStepChange(whoFormModel);
  }, [whoFormModel, onTaskWhoStepChange]);

  useEffect(() => {}, [whoFormModel]);

  return (
    <>
      <Typography variant="body1" margin="20px 0">
        {t('who_step_description')}
      </Typography>
      {settings[0]?.setting_value === 'TRUE' && executor.length > 0 ? (
        <>
          <TagsSelector
            onTagsChange={handleExecutorSelection}
            listOfTags={executor}
            placeholder="Select Responsibles"
          />
        </>
      ) : (
        <Box sx={{ mb: 2 }}>
          <FormBuilder
            showActionButton={false}
            inputFields={FormDataWho.slice(0, 1)}
            controlled={true}
            initialValues={whoFormModel}
            onChange={(id, value) => {
              setWhoFormModel((prevState) => ({ ...prevState, [id]: value }));
            }}
          />
        </Box>
      )}
      {settings[1]?.setting_value === 'TRUE' && reviewer.length > 0 ? (
        <TagsSelector
          onTagsChange={handleReviewerSelection}
          listOfTags={reviewer}
          placeholder="Select Reviewers"
        />
      ) : (
        <FormBuilder
          showActionButton={false}
          inputFields={FormDataWho.slice(1, 2)}
          controlled={true}
          initialValues={whoFormModel}
          onChange={(id, value) => {
            setWhoFormModel((prevState) => ({ ...prevState, [id]: value }));
          }}
        />
      )}
      <Box sx={{ margin: '20px 0' }}>
        <FormBuilder
          showActionButton={false}
          inputFields={FormDataWho.slice(2)}
          controlled={true}
          initialValues={whoFormModel}
          onChange={(id, value) => {
            setWhoFormModel((prevState) => ({ ...prevState, [id]: value }));
          }}
        />
      </Box>
    </>
  );
}

export default TaskWhoStep;
