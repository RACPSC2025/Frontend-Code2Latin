import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormBuilder from '../../components/FormBuilder';
import { daysNumbers, daysOfWeek, months } from '../../config/constants';

function PermanentFormData({ formModel, onFormModelChange, alert }) {
  const [selectedPeriodicity, setSelectedPeriodicity] = useState(null);
  const [periodicityTextLabel, setPeriodicityTextLabel] = useState(null);
  const [selectedPeriodicityValue, setSelectedPeriodicityValue] = useState(null);
  const [permanentFormModel, setPermanentFormModel] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    onFormModelChange(permanentFormModel);
  }, [permanentFormModel, onFormModelChange]);

  useEffect(() => {
    // setPermanentFormModel({
    //   plan: '',
    //   recure_every: '',
    //   sub_plan: '',
    //   cron_start_date: '',
    //   cron_end_date: '',
    //   range: '',
    //   range_value: '',
    //   id_alert: ''
    // });
    setPermanentFormModel(formModel);
  }, []);

  useEffect(() => {
    setPermanentFormModel((prevState) => ({
      ...prevState,
      plan: definePeriodicityType(selectedPeriodicity)
    }));
  }, [selectedPeriodicity]);

  const definePeriodicityType = (periodicity) => {
    switch (periodicity) {
      case 'weekly':
        return '2';
      case 'monthly':
        return '3';
      case 'yearly':
        return '4';
      default:
        return '';
    }
  };

  const handleSelectedRangeValue = (event) => {
    setPermanentFormModel((prevState) => ({
      ...prevState,
      range: event.target.value
    }));
  };

  const handleRangeValue = (event) => {
    setPermanentFormModel((prevState) => ({
      ...prevState,
      range_value: event.target.value
    }));
  };

  const weeklyLabels = daysOfWeek;
  const monthlyLabels = daysNumbers;
  const yearlyLabels = months;

  const permanentFormData = [
    {
      id: 'cron_start_date',
      label: t('StartDate'),
      type: 'datetime'
    },
    {
      id: 'cron_end_date',
      label: t('EndDate'),
      type: 'datetime'
    },
    {
      id: 'id_alert',
      label: t('apply_alert'),
      type: 'dropdown',
      options: alert
    }
  ];

  const handlePeriodicityChange = (event) => {
    setSelectedPeriodicity(event.target.value);
    setPeriodicityTextLabel(
      event.target.value === 'weekly'
        ? t('weeks_in')
        : event.target.value === 'monthly'
          ? t('months_in')
          : t('years_later')
    );
    setSelectedPeriodicityValue(
      event.target.value === 'weekly'
        ? weeklyLabels
        : event.target.value === 'monthly'
          ? monthlyLabels
          : yearlyLabels
    );
  };

  return (
    <Box>
      <FormControl>
        <FormLabel>{t('periodicity')}</FormLabel>
        <RadioGroup
          name="periodicity-radio-group"
          value={selectedPeriodicity}
          onChange={handlePeriodicityChange}
        >
          <Box display="grid" margin="0 0 1.5rem 0" gridTemplateColumns="repeat(3, 1fr)" gap="20px">
            <FormControlLabel
              value="weekly"
              label={t('weekly')}
              control={<Radio value="weekly" />}
            />
            <FormControlLabel
              value="monthly"
              label={t('monthly')}
              control={<Radio value="monthly" />}
            />
            <FormControlLabel
              value="yearly"
              label={t('annually')}
              control={<Radio value="yearly" />}
            />
          </Box>
        </RadioGroup>
        <Typography>
          {t('appeal_each') + ' '}
          <Input
            type="number"
            size="small"
            onChange={(event) =>
              setPermanentFormModel((prevState) => ({
                ...prevState,
                recure_every: event.target.value
              }))
            }
            sx={{ width: '10%', border: '1px solid #adb1b1', margin: '0 0.3rem' }}
            variant="outlined"
          ></Input>
          {periodicityTextLabel}
        </Typography>
        <RadioGroup name="periodicity-d-m-y">
          <Box display="grid" gridTemplateColumns="repeat(3, 1fr)">
            {selectedPeriodicityValue?.map((label) => (
              <FormControlLabel
                key={label.value}
                value={label.value}
                label={label.label}
                control={
                  <Radio
                    value={label.value}
                    onChange={() =>
                      setPermanentFormModel((prevState) => ({
                        ...prevState,
                        sub_plan: label.value
                      }))
                    }
                  />
                }
              />
            ))}
          </Box>
        </RadioGroup>
      </FormControl>
      <hr />
      <Typography>{t('range_of_recurrence')}</Typography>
      <FormControl>
        {/* //TODO: change date picker to have the ability to disable certain dates */}

        <FormBuilder
          inputFields={permanentFormData.slice(0, 1)}
          showActionButton={false}
          controlled={true}
          initialValues={permanentFormModel}
          onChange={(id, value) => {
            setPermanentFormModel((prevState) => ({ ...prevState, [id]: value }));
          }}
        />
        {/* </Box> */}
      </FormControl>
      <RadioGroup name="recurrence-range">
        <FormControl>
          <FormControlLabel
            value="0"
            label={t('no_end_date')}
            control={<Radio onChange={handleSelectedRangeValue} />}
          />
        </FormControl>
        <FormControl>
          <FormControlLabel
            value="1"
            label={
              <Box>
                {t('finish_after') + ' '}
                <Input type="number" variant="outlined" onChange={handleRangeValue} />{' '}
                {t('occurrence')}
              </Box>
            }
            control={<Radio onChange={handleSelectedRangeValue} />}
          />
        </FormControl>
        <FormControl>
          <FormControlLabel
            value="2"
            label={
              <Box>
                {/* Terminar por */}
                <FormBuilder
                  inputFields={permanentFormData.slice(1, 2)}
                  showActionButton={false}
                  controlled={true}
                  initialValues={permanentFormModel}
                  onChange={(id, value) => {
                    setPermanentFormModel((prevState) => ({ ...prevState, [id]: value }));
                  }}
                />
              </Box>
            }
            control={<Radio onChange={handleSelectedRangeValue} />}
          />
        </FormControl>
      </RadioGroup>
      <Box>
        <Typography>{t('apply_alert')}</Typography>
        <FormBuilder
          showActionButton={false}
          inputFields={permanentFormData.slice(2)}
          controlled={true}
          initialValues={permanentFormModel}
          onChange={(id, value) => {
            setPermanentFormModel((prevState) => ({ ...prevState, [id]: value }));
          }}
        />
      </Box>
    </Box>
  );
}

export default PermanentFormData;
