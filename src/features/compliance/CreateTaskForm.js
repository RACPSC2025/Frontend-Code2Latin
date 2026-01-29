import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepLabel,
  Stepper,
  Switch,
  TextField,
  Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import legalService from '../../services/legalService';

export default function CreateTaskForm({ articleId, legalId, levelStr, onSuccess }) {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    task_title: '',
    tags: [],
    region: '',
    country: '',
    business: '',
    plant: '',
    corrective_plan: false,
    task_description: '',
    activity_type: '1',
    start_date: '',
    end_date: '',
    selected_days: [],
    selected_months: [],
    selected_years: [],
    plan: '2',
    recure_every: '1',
    sub_plan: '',
    cron_start_date: '',
    cron_end_date: '',
    range: '0',
    range_value: '',
    id_alert: '',
    tracking_type: '1',
    questions: [''],
    location: '',
    responsible: [],
    reviewer: [],
    contractor_company: '',
    fase: '',
    subfase: '',
    pma_id: '',
    program_id: '',
    sub_program_id: ''
  });
  const [responsiblesList, setResponsiblesList] = useState([]);
  const [options, setOptions] = useState({
    regions: [],
    countries: [],
    business: [],
    plants: [],
    fases: [],
    subfases: [],
    pmas: [],
    programs: [],
    subprograms: [],
    users: [],
    tags: [],
    alerts: [],
    contractor_companies: [],
    levels: []
  });
  const [validationErrors, setValidationErrors] = useState({});

  const steps = [
    t('basic_details'),
    t('Ejecucion_dates'),
    t('followup_question'),
    t('responsible'),
    t('phases')
  ];

  useEffect(() => {
    loadFormData();
    if (levelStr && levelStr.includes('_')) {
      parseLevelStr();
    }
  }, []);

  const parseLevelStr = async () => {
    const parts = levelStr.split('_');
    
    if (parts.length >= 2) {
      await loadCountries(parts[0]);
      setFormData(prev => ({ ...prev, region: parts[0], country: parts[1] }));
    }
    if (parts.length >= 3) {
      await loadBusiness(parts[1]);
      setFormData(prev => ({ ...prev, business: parts[2] }));
    }
    if (parts.length >= 4) {
      await loadPlants(parts[2]);
      setFormData(prev => ({ ...prev, plant: parts[3] }));
    }
  };

  const loadFormData = async () => {
    try {
      const response = await legalService.getTaskFormData();
      if (response.status === 1) {
        setOptions(prev => ({
          ...prev,
          regions: response.data.regions || [],
          fases: response.data.fases || [],
          pmas: response.data.pmas || [],
          users: response.data.users || [],
          tags: response.data.tags || [],
          alerts: response.data.alerts || [],
          contractor_companies: response.data.contractor_companies || [],
          levels: response.data.levels || []
        }));
      }
    } catch (error) {
      toast.error(t('Error loading form data'));
    }
  };

  const loadCountries = async (regionId) => {
    try {
      const response = await legalService.getCountriesForTask(regionId);
      if (response.status === 1) {
        setOptions(prev => ({ ...prev, countries: response.data || [] }));
      }
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const loadBusiness = async (countryId) => {
    try {
      const response = await legalService.getBusinessForTask(countryId);
      if (response.status === 1) {
        setOptions(prev => ({ ...prev, business: response.data || [] }));
      }
    } catch (error) {
      console.error('Error loading business:', error);
    }
  };

  const loadPlants = async (businessId) => {
    try {
      const response = await legalService.getPlantsForTask(businessId);
      if (response.status === 1) {
        setOptions(prev => ({ ...prev, plants: response.data || [] }));
      }
    } catch (error) {
      console.error('Error loading plants:', error);
    }
  };

  const loadSubfases = async (faseId) => {
    try {
      const response = await legalService.getSubfases(faseId);
      if (response.status === 1) {
        setOptions(prev => ({ ...prev, subfases: response.data || [] }));
      }
    } catch (error) {
      console.error('Error loading subfases:', error);
    }
  };

  const loadPrograms = async (pmaId) => {
    try {
      const response = await legalService.getProgramsForTask(pmaId);
      if (response.status === 1) {
        setOptions(prev => ({ ...prev, programs: response.data || [] }));
      }
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const loadSubprograms = async (programId) => {
    try {
      const response = await legalService.getSubprogramsForTask(programId);
      if (response.status === 1) {
        setOptions(prev => ({ ...prev, subprograms: response.data || [] }));
      }
    } catch (error) {
      console.error('Error loading subprograms:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'region') {
      setFormData(prev => ({ ...prev, country: '', business: '', plant: '' }));
      setOptions(prev => ({ ...prev, countries: [], business: [], plants: [] }));
      if (value) loadCountries(value);
    } else if (field === 'country') {
      setFormData(prev => ({ ...prev, business: '', plant: '' }));
      setOptions(prev => ({ ...prev, business: [], plants: [] }));
      if (value) loadBusiness(value);
    } else if (field === 'business') {
      setFormData(prev => ({ ...prev, plant: '' }));
      setOptions(prev => ({ ...prev, plants: [] }));
      if (value) loadPlants(value);
    } else if (field === 'fase') {
      setFormData(prev => ({ ...prev, subfase: '' }));
      setOptions(prev => ({ ...prev, subfases: [] }));
      if (value) loadSubfases(value);
    } else if (field === 'pma_id') {
      setFormData(prev => ({ ...prev, program_id: '', sub_program_id: '' }));
      setOptions(prev => ({ ...prev, programs: [], subprograms: [] }));
      if (value) loadPrograms(value);
    } else if (field === 'program_id') {
      setFormData(prev => ({ ...prev, sub_program_id: '' }));
      setOptions(prev => ({ ...prev, subprograms: [] }));
      if (value) loadSubprograms(value);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    const errors = {};
    
    if (!formData.task_title?.trim()) errors.task_title = true;
    if (!formData.region) errors.region = true;
    if (!formData.task_description?.trim()) errors.task_description = true;
    
    if (formData.activity_type === '1') {
      if (!formData.start_date) errors.start_date = true;
      if (!formData.end_date) errors.end_date = true;
      if (formData.end_date && formData.start_date && formData.end_date < formData.start_date) {
        toast.error('Fecha final inferior a la fecha de inicio.');
        return;
      }
    }
    
    if (formData.activity_type === '5') {
      if (!formData.cron_start_date) errors.cron_start_date = true;
      if (!formData.recure_every) errors.recure_every = true;
    }
    
    if (formData.activity_type === '3') {
      if (formData.selected_days.length === 0) {
        toast.warning('Por favor ingrese un día');
        return;
      }
      if (formData.selected_months.length === 0) {
        toast.warning('Por favor ingrese un mes');
        return;
      }
      if (formData.selected_years.length === 0) {
        toast.warning('Por favor ingrese un año');
        return;
      }
    }
    
    if (responsiblesList.length === 0) {
      toast.warning('Por favor ingrese un responsable y revisor.');
      return;
    }
    
    if (formData.pma_id && !formData.program_id) {
      toast.warning('Por favor seleccione Programa');
      return;
    }
    
    if (!formData.fase) errors.fase = true;
    
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast.warning(t('please_complete_all_required_fields'));
      return;
    }

    setLoading(true);
    try {
      let location = null;
      let responsible = [];
      let reviewer = [];

      if (responsiblesList.length > 0) {
        location = responsiblesList[0].location;
        responsible = responsiblesList.flatMap(item => item.responsible);
        reviewer = responsiblesList.flatMap(item => item.reviewer);
      }

      const taskData = {
        ...formData,
        location,
        responsible,
        reviewer,
        article_id: articleId,
        legal_id: legalId,
        level_str: levelStr
      };

      const response = await legalService.createTask(taskData);
      if (response.status === 1) {
        if (onSuccess) onSuccess();
      } else {
        toast.error(t('Error creating task'));
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error(t('Error creating task'));
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <Box>
      <TextField
        fullWidth
        required
        label={t('activity_title')}
        value={formData.task_title}
        onChange={(e) => {
          handleChange('task_title', e.target.value);
          if (validationErrors.task_title) {
            setValidationErrors(prev => ({ ...prev, task_title: false }));
          }
        }}
        error={validationErrors.task_title}
        helperText={validationErrors.task_title ? t('field_is_required') : ''}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t('labels')} (selección múltiple)</InputLabel>
        <Select
          multiple
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          label={t('labels') + ' (selección múltiple)'}
        >
          {options.tags.map((tag) => (
            <MenuItem key={tag.id} value={tag.id}>{tag.tag_name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl fullWidth required error={validationErrors.region}>
          <InputLabel>{t('Region')}</InputLabel>
          <Select
            value={formData.region || ''}
            onChange={(e) => {
              handleChange('region', e.target.value);
              if (validationErrors.region) {
                setValidationErrors(prev => ({ ...prev, region: false }));
              }
            }}
            label={t('Region')}
          >
            <MenuItem value="">{t('select')}</MenuItem>
            {options.regions.map((r) => (
              <MenuItem key={r.id} value={r.id}>{r.regional_es}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>{t('Country')}</InputLabel>
          <Select
            value={formData.country || ''}
            onChange={(e) => handleChange('country', e.target.value)}
            label={t('Country')}
          >
            <MenuItem value="">{t('select')}</MenuItem>
            {options.countries.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.pais}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>{t('Business')}</InputLabel>
          <Select
            value={formData.business || ''}
            onChange={(e) => handleChange('business', e.target.value)}
            label={t('Business')}
          >
            <MenuItem value="">{t('select')}</MenuItem>
            {options.business.map((b) => (
              <MenuItem key={b.negocio_id} value={b.negocio_id}>{b.negocio_es}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>{t('Plant')}</InputLabel>
          <Select
            value={formData.plant || ''}
            onChange={(e) => handleChange('plant', e.target.value)}
            label={t('Plant')}
          >
            <MenuItem value="">{t('select')}</MenuItem>
            {options.plants.map((p) => (
              <MenuItem key={p.id} value={p.id}>{p.planta}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={formData.corrective_plan}
            onChange={(e) => handleChange('corrective_plan', e.target.checked)}
          />
        }
        label={t('active_corrective_plan')}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        required
        multiline
        rows={4}
        label={t('description_activity')}
        value={formData.task_description}
        onChange={(e) => {
          handleChange('task_description', e.target.value);
          if (validationErrors.task_description) {
            setValidationErrors(prev => ({ ...prev, task_description: false }));
          }
        }}
        error={validationErrors.task_description}
        helperText={validationErrors.task_description ? t('field_is_required') : ''}
        sx={{ mb: 2 }}
      />
    </Box>
  );

  const renderStep2 = () => (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>{t('type_of_activity')}</Typography>
      <RadioGroup
        value={formData.activity_type}
        onChange={(e) => handleChange('activity_type', e.target.value)}
        sx={{ mb: 2 }}
      >
        <FormControlLabel value="1" control={<Radio />} label={t('only')} />
        <FormControlLabel value="3" control={<Radio />} label={t('cyclical')} />
        <FormControlLabel value="5" control={<Radio />} label={t('task_permanent')} />
      </RadioGroup>

      {formData.activity_type === '1' && (
        <Box>
          <TextField
            fullWidth
            required
            type="date"
            label={t('initial_date')}
            value={formData.start_date}
            onChange={(e) => {
              handleChange('start_date', e.target.value);
              if (validationErrors.start_date) {
                setValidationErrors(prev => ({ ...prev, start_date: false }));
              }
            }}
            error={validationErrors.start_date}
            helperText={validationErrors.start_date ? t('field_is_required') : ''}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            required
            type="date"
            label={t('final_date')}
            value={formData.end_date}
            onChange={(e) => {
              handleChange('end_date', e.target.value);
              if (validationErrors.end_date) {
                setValidationErrors(prev => ({ ...prev, end_date: false }));
              }
            }}
            error={validationErrors.end_date}
            helperText={validationErrors.end_date ? t('field_is_required') : ''}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        </Box>
      )}

      {formData.activity_type === '3' && (
        <Box>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('days')}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {[...Array(30)].map((_, i) => (
              <Button
                key={i + 1}
                variant={formData.selected_days.includes(i + 1) ? 'contained' : 'outlined'}
                size="small"
                onClick={() => {
                  const days = formData.selected_days.includes(i + 1)
                    ? formData.selected_days.filter(d => d !== i + 1)
                    : [...formData.selected_days, i + 1];
                  handleChange('selected_days', days);
                }}
                sx={{ minWidth: 40 }}
              >
                {i + 1}
              </Button>
            ))}
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('months')}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'].map((month, i) => (
              <Button
                key={i + 1}
                variant={formData.selected_months.includes(i + 1) ? 'contained' : 'outlined'}
                size="small"
                onClick={() => {
                  const months = formData.selected_months.includes(i + 1)
                    ? formData.selected_months.filter(m => m !== i + 1)
                    : [...formData.selected_months, i + 1];
                  handleChange('selected_months', months);
                }}
              >
                {month}
              </Button>
            ))}
          </Box>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>{t('years')}</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {[...Array(9)].map((_, i) => {
              const year = new Date().getFullYear() - 2 + i;
              return (
                <Button
                  key={year}
                  variant={formData.selected_years.includes(year) ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => {
                    const years = formData.selected_years.includes(year)
                      ? formData.selected_years.filter(y => y !== year)
                      : [...formData.selected_years, year];
                    handleChange('selected_years', years);
                  }}
                >
                  {year}
                </Button>
              );
            })}
          </Box>
        </Box>
      )}

      {formData.activity_type === '5' && (
        <Box>
          <RadioGroup
            value={formData.plan}
            onChange={(e) => handleChange('plan', e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="2" control={<Radio />} label={t('weekly')} />
            <FormControlLabel value="3" control={<Radio />} label={t('monthly')} />
            <FormControlLabel value="4" control={<Radio />} label={t('annually')} />
          </RadioGroup>

          <TextField
            fullWidth
            required
            type="number"
            label={t('run_every')}
            value={formData.recure_every}
            onChange={(e) => {
              handleChange('recure_every', e.target.value);
              if (validationErrors.recure_every) {
                setValidationErrors(prev => ({ ...prev, recure_every: false }));
              }
            }}
            error={validationErrors.recure_every}
            helperText={validationErrors.recure_every ? t('field_is_required') : ''}
            inputProps={{ min: 1, max: 12 }}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            required
            type="date"
            label={t('initial_day')}
            value={formData.cron_start_date}
            onChange={(e) => {
              handleChange('cron_start_date', e.target.value);
              if (validationErrors.cron_start_date) {
                setValidationErrors(prev => ({ ...prev, cron_start_date: false }));
              }
            }}
            error={validationErrors.cron_start_date}
            helperText={validationErrors.cron_start_date ? t('field_is_required') : ''}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />

          <RadioGroup
            value={formData.range}
            onChange={(e) => handleChange('range', e.target.value)}
            sx={{ mb: 2 }}
          >
            <FormControlLabel value="0" control={<Radio />} label={t('no_end_date')} />
            <FormControlLabel value="1" control={<Radio />} label={t('finish_later')} />
            <FormControlLabel value="2" control={<Radio />} label={t('finish_by')} />
          </RadioGroup>

          {formData.range === '1' && (
            <TextField
              fullWidth
              type="number"
              label={t('idea')}
              value={formData.range_value}
              onChange={(e) => handleChange('range_value', e.target.value)}
              sx={{ mb: 2 }}
            />
          )}

          {formData.range === '2' && (
            <TextField
              fullWidth
              type="date"
              label={t('finish_by')}
              value={formData.cron_end_date}
              onChange={(e) => handleChange('cron_end_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
          )}
        </Box>
      )}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t('apply_alert')}</InputLabel>
        <Select
          value={formData.id_alert}
          onChange={(e) => handleChange('id_alert', e.target.value)}
          label={t('apply_alert')}
        >
          <MenuItem value="">{t('none')}</MenuItem>
          {options.alerts.map((alert) => (
            <MenuItem key={alert.id_alerta} value={alert.id_alerta}>{alert.nombre}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  const renderStep3 = () => (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>{t('tracking_type')}</Typography>
      <RadioGroup
        value={formData.tracking_type}
        onChange={(e) => handleChange('tracking_type', e.target.value)}
        sx={{ mb: 2 }}
      >
        <FormControlLabel value="1" control={<Radio />} label={t('type_default')} />
        <FormControlLabel value="2" control={<Radio />} label={t('checklist')} />
      </RadioGroup>

      {formData.tracking_type === '1' && (
        <Alert severity="info">{t('default_tracking_text')}</Alert>
      )}

      {formData.tracking_type === '2' && (
        <Box>
          {formData.questions.map((q, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <TextField
                fullWidth
                label={`${t('question')} ${index + 1}`}
                value={q}
                onChange={(e) => {
                  const newQuestions = [...formData.questions];
                  newQuestions[index] = e.target.value;
                  handleChange('questions', newQuestions);
                }}
              />
              {index > 0 && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    const newQuestions = formData.questions.filter((_, i) => i !== index);
                    handleChange('questions', newQuestions);
                  }}
                >
                  X
                </Button>
              )}
            </Box>
          ))}
          <Button
            variant="contained"
            onClick={() => handleChange('questions', [...formData.questions, ''])}
          >
            {t('add_new_question')}
          </Button>
        </Box>
      )}
    </Box>
  );

  const handleAddResponsible = () => {
    if (!formData.location) {
      toast.warning(t('Seleccione la ubicación.'));
      return;
    }
    if (!formData.responsible || formData.responsible.length === 0) {
      toast.warning(t('Seleccione responsable.'));
      return;
    }
    if (!formData.reviewer || formData.reviewer.length === 0) {
      toast.warning(t('Seleccione el revisor.'));
      return;
    }

    const locationName = options.levels.find(l => l.id === formData.location)?.name || '';
    const responsibleNames = formData.responsible.map(id => {
      const user = options.users.find(u => u.id === id);
      return user ? `${user.position_name} (${user.apellidos})` : '';
    }).join(', ');
    const reviewerNames = formData.reviewer.map(id => {
      const user = options.users.find(u => u.id === id);
      return user ? `${user.position_name} (${user.apellidos})` : '';
    }).join(', ');

    setResponsiblesList([...responsiblesList, {
      location: formData.location,
      locationName,
      responsible: formData.responsible,
      responsibleNames,
      reviewer: formData.reviewer,
      reviewerNames
    }]);

    setFormData(prev => ({ ...prev, location: '', responsible: [], reviewer: [] }));
  };

  const handleDeleteResponsible = (index) => {
    setResponsiblesList(responsiblesList.filter((_, i) => i !== index));
  };

  const renderStep4 = () => (
    <Box>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t('level_lable')}</InputLabel>
        <Select
          value={formData.location || ''}
          onChange={(e) => handleChange('location', e.target.value)}
          label={t('level_lable')}
        >
          <MenuItem value="">{t('select_level')}</MenuItem>
          {options.levels.map((level) => (
            <MenuItem key={level.id} value={level.id}>{level.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t('head_of_execution')} (selección múltiple)</InputLabel>
        <Select
          multiple
          value={formData.responsible}
          onChange={(e) => handleChange('responsible', e.target.value)}
          label={t('head_of_execution') + ' (selección múltiple)'}
        >
          {options.users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.position_name} ({user.apellidos})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t('responsible_for_revision')} (selección múltiple)</InputLabel>
        <Select
          multiple
          value={formData.reviewer}
          onChange={(e) => handleChange('reviewer', e.target.value)}
          label={t('responsible_for_revision') + ' (selección múltiple)'}
        >
          {options.users.map((user) => (
            <MenuItem key={user.id} value={user.id}>
              {user.position_name} ({user.apellidos})
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t('contractor_company')}</InputLabel>
        <Select
          value={formData.contractor_company || ''}
          onChange={(e) => handleChange('contractor_company', e.target.value)}
          label={t('contractor_company')}
        >
          <MenuItem value="">{t('select')}</MenuItem>
          {options.contractor_companies.map((company) => (
            <MenuItem key={company.contractor_id} value={company.contractor_id}>
              {company.contractor_fullname}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Button variant="contained" color="success" onClick={handleAddResponsible}>
          {t('add_responsible')}
        </Button>
      </Box>

      {responsiblesList.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #ddd' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>{t('level_lable')}</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>{t('head_of_execution')}</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>{t('responsible_for_revision')}</th>
                <th style={{ padding: '8px', textAlign: 'center' }}>{t('Actions')}</th>
              </tr>
            </thead>
            <tbody>
              {responsiblesList.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '8px' }}>{item.locationName}</td>
                  <td style={{ padding: '8px' }}>{item.responsibleNames}</td>
                  <td style={{ padding: '8px' }}>{item.reviewerNames}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => handleDeleteResponsible(index)}
                    >
                      X
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      )}
    </Box>
  );

  const renderStep5 = () => (
    <Box>
      <FormControl fullWidth required error={validationErrors.fase} sx={{ mb: 2 }}>
        <InputLabel>{t('phase')}</InputLabel>
        <Select
          value={formData.fase}
          onChange={(e) => {
            handleChange('fase', e.target.value);
            if (validationErrors.fase) {
              setValidationErrors(prev => ({ ...prev, fase: false }));
            }
          }}
          label={t('phase')}
        >
          <MenuItem value="">{t('select_phase')}</MenuItem>
          {options.fases.map((fase) => (
            <MenuItem key={fase.id} value={fase.id}>{fase.name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t('pma')}</InputLabel>
        <Select
          value={formData.pma_id}
          onChange={(e) => handleChange('pma_id', e.target.value)}
          label={t('pma')}
        >
          <MenuItem value="">{t('select_pma')}</MenuItem>
          {options.pmas.map((pma) => (
            <MenuItem key={pma.id} value={pma.id}>{pma.pma_name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t('programs')}</InputLabel>
        <Select
          value={formData.program_id}
          onChange={(e) => handleChange('program_id', e.target.value)}
          label={t('programs')}
        >
          <MenuItem value="">{t('select_programe')}</MenuItem>
          {options.programs.map((program) => (
            <MenuItem key={program.id} value={program.id}>{program.program_name}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>{t('subprograms')}</InputLabel>
        <Select
          value={formData.sub_program_id}
          onChange={(e) => handleChange('sub_program_id', e.target.value)}
          label={t('subprograms')}
        >
          <MenuItem value="">{t('select_sub_programe')}</MenuItem>
          {options.subprograms.map((subprogram) => (
            <MenuItem key={subprogram.id} value={subprogram.id}>{subprogram.sub_program_name}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ minHeight: 400 }}>
        {activeStep === 0 && renderStep1()}
        {activeStep === 1 && renderStep2()}
        {activeStep === 2 && renderStep3()}
        {activeStep === 3 && renderStep4()}
        {activeStep === 4 && renderStep5()}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          {t('previous')}
        </Button>
        <Box>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? t('wait_message') : t('add_task')}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              {t('next')}
            </Button>
          )}
        </Box>
      </Box>
      </Box>
      
      {createPortal(<ToastContainer />, document.body)}
    </>
  );
}
