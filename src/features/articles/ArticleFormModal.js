import { Close } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Dialog,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Typography,
  OutlinedInput,
  Chip
} from '@mui/material';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import legalService from '../../services/legalService';

export default function ArticleFormModal({
  isOpen = false,
  setIsOpen = () => {},
  requisitoId,
  onSuccess = () => {}
}) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [articleTypes, setArticleTypes] = useState([]);
  const [parentArticles, setParentArticles] = useState([]);
  const [temas, setTemas] = useState([]);
  const [legalType, setLegalType] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    numeracion: '',
    nombre: '',
    descripcion: '',
    criticity: '',
    risk_level: '',
    category: '',
    estado: 'Abierto',
    estado_autoridad: '',
    gap: '',
    comments: '',
    item_type: '',
    parent_article_id: '',
    id_tema_requisito: [],
    id_requisito: requisitoId
  });

  useEffect(() => {
    if (isOpen) {
      loadDropdownData();
      resetForm();
    }
  }, [isOpen, requisitoId]);

  useEffect(() => {
    // Limpiar errores cuando cambien los valores del formulario
    if (Object.keys(validationErrors).length > 0) {
      const newErrors = { ...validationErrors };
      let hasChanges = false;
      
      Object.keys(formData).forEach(key => {
        if (formData[key] && newErrors[key]) {
          delete newErrors[key];
          hasChanges = true;
        }
      });
      
      if (hasChanges) {
        setValidationErrors(newErrors);
      }
    }
  }, [formData, validationErrors]);

  const loadDropdownData = async () => {
    try {
      const [categoriesRes, typesRes, articlesRes, temasRes] = await Promise.all([
        legalService.getLegalCategories(),
        legalService.getArticleTypes(),
        legalService.getIdArticulo(requisitoId),
        legalService.getTemas()
      ]);

      if (categoriesRes.status === 1) setCategories(categoriesRes.data);
      if (typesRes.status === 1) setArticleTypes(typesRes.data);
      if (articlesRes.status === 1) setParentArticles(articlesRes.data);
      if (temasRes.status === 1) setTemas(temasRes.data);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      numeracion: '',
      nombre: '',
      descripcion: '',
      criticity: '',
      risk_level: '',
      category: '',
      estado: 'Abierto',
      estado_autoridad: '',
      gap: '',
      comments: '',
      item_type: '',
      parent_article_id: '',
      id_tema_requisito: [],
      id_requisito: requisitoId
    });
    setValidationErrors({});
  };

  const validateRequiredFields = () => {
    const errors = {};
    
    if (!formData.numeracion?.trim()) errors.numeracion = true;
    if (!formData.nombre?.trim()) errors.nombre = true;
    if (!formData.descripcion?.trim()) errors.descripcion = true;
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateRequiredFields()) {
      toast.warning('Por favor complete todos los campos obligatorios antes de guardar.');
      return;
    }

    setLoading(true);
    try {
      // Convert empty strings to null for database compatibility
      const dataToSend = { ...formData };
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === '') {
          dataToSend[key] = null;
        }
      });
      
      const response = await legalService.createArticle(dataToSend);
      if (response.status === 1) {
        toast.success(response.messages);
        onSuccess();
        resetForm();
        // Delay closing to allow toast to show
        setTimeout(() => setIsOpen(false), 100);
      } else {
        toast.error(response.messages || 'Error al crear artículo');
      }
    } catch (error) {
      console.error('Error creating article:', error);
      toast.error('Error al crear artículo');
    } finally {
      setLoading(false);
    }
  };

  const showRiskLevel = formData.criticity === 'Alta';
  const showEstadoAutoridad = formData.estado === 'Cerrado';
  const showParentArticle =
    formData.item_type && formData.item_type !== 'Artículo' && formData.item_type !== 'Article';

  return (
    <>
      <Dialog fullWidth maxWidth="md" open={isOpen} onClose={() => {
        resetForm();
        setIsOpen(false);
      }}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ flex: 1, color: 'white' }} variant="h6">
            {t('Add_articles')}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={() => {
            resetForm();
            setIsOpen(false);
          }}>
            <Close sx={{ color: 'white' }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ p: 3 }}>
        <TextField
          fullWidth
          label={t('article_number')}
          value={formData.numeracion}
          onChange={(e) => handleChange('numeracion', e.target.value)}
          error={validationErrors.numeracion}
          helperText={validationErrors.numeracion ? 'Campo requerido' : ''}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label={t('article_name')}
          value={formData.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          error={validationErrors.nombre}
          helperText={validationErrors.nombre ? 'Campo requerido' : ''}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label={t('requirement_of_the_article')}
          value={formData.descripcion}
          onChange={(e) => handleChange('descripcion', e.target.value)}
          error={validationErrors.descripcion}
          helperText={validationErrors.descripcion ? 'Campo requerido' : ''}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t('Criticity')}</InputLabel>
          <Select
            value={formData.criticity}
            label={t('Criticity')}
            onChange={(e) => handleChange('criticity', e.target.value)}
          >
            <MenuItem value="Alta">{t('high')}</MenuItem>
            <MenuItem value="Media">{t('medium')}</MenuItem>
            <MenuItem value="Baja">{t('low')}</MenuItem>
            <MenuItem value="Ninguna">{t('none')}</MenuItem>
          </Select>
        </FormControl>

        {showRiskLevel && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('evidence_level')}</InputLabel>
            <Select
              value={formData.risk_level}
              label={t('evidence_level')}
              onChange={(e) => handleChange('risk_level', e.target.value)}
            >
              <MenuItem value="Alto">{t('high')}</MenuItem>
              <MenuItem value="Medio">{t('medium')}</MenuItem>
              <MenuItem value="Bajo">{t('low')}</MenuItem>
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t('category')}</InputLabel>
          <Select
            value={formData.category}
            label={t('category')}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.key} value={cat.key}>
                {cat.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t('status')}</InputLabel>
          <Select
            value={formData.estado}
            label={t('status')}
            onChange={(e) => handleChange('estado', e.target.value)}
          >
            <MenuItem value="Continuo">{t('Continuo')}</MenuItem>
            <MenuItem value="Abierto">{t('Abierto')}</MenuItem>
            <MenuItem value="Cerrado">{t('Cerrado')}</MenuItem>
            <MenuItem value="Vencido">{t('Vencido')}</MenuItem>
          </Select>
        </FormControl>

        {showEstadoAutoridad && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('authority_status')}</InputLabel>
            <Select
              value={formData.estado_autoridad}
              label={t('authority_status')}
              onChange={(e) => handleChange('estado_autoridad', e.target.value)}
            >
              <MenuItem value="attended">{t('attended')}</MenuItem>
              <MenuItem value="compliment">{t('compliment')}</MenuItem>
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>GAP</InputLabel>
          <Select
            value={formData.gap}
            label="GAP"
            onChange={(e) => handleChange('gap', e.target.value)}
          >
            <MenuItem value="csin">{t('csin')}</MenuItem>
            <MenuItem value="1gap">{t('1gap')}</MenuItem>
            <MenuItem value="2gap">{t('2gap')}</MenuItem>
            <MenuItem value="3gap">{t('3gap')}</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          multiline
          rows={2}
          label={t('comments')}
          value={formData.comments}
          onChange={(e) => handleChange('comments', e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t('item_type')}</InputLabel>
          <Select
            value={formData.item_type}
            label={t('item_type')}
            onChange={(e) => handleChange('item_type', e.target.value)}
          >
            {articleTypes.map((type, idx) => (
              <MenuItem key={idx} value={type.item_type}>
                {type.item_type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {showParentArticle && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('dependency_id')}</InputLabel>
            <Select
              value={formData.parent_article_id}
              label={t('dependency_id')}
              onChange={(e) => handleChange('parent_article_id', e.target.value)}
            >
              {parentArticles.map((art) => (
                <MenuItem key={art.key} value={art.key}>
                  {art.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>{t('thematic_group_multiple_option')}</InputLabel>
          <Select
            multiple
            value={formData.id_tema_requisito}
            onChange={(e) => handleChange('id_tema_requisito', e.target.value)}
            input={<OutlinedInput label={t('temático')} />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const tema = temas.find((t) => t.key === value);
                  return <Chip key={value} label={tema?.label || value} />;
                })}
              </Box>
            )}
          >
            {temas.map((tema) => (
              <MenuItem key={tema.key} value={tema.key}>
                {tema.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ color: 'white' }}
        >
          {loading ? t('saving') : t('Save')}
        </Button>
      </Box>
      </Dialog>
      
      {createPortal(<ToastContainer />, document.body)}
    </>
  );
}
