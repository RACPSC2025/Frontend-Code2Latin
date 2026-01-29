import { Close } from '@mui/icons-material';
import { AppBar, Box, Dialog, IconButton, Toolbar, Typography } from '@mui/material';

import { Suspense, Fragment, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import FormBuilder from '../../components/FormBuilder';
import { useDispatch, useSelector } from 'react-redux';

import {
  fetchAutocompleteOptions,
  removeAllFilters,
  removeFilter,
  selectFilterItemValue,
  selectListOptions,
  selectAppliedFilterModel,
  setFilter
} from '../../stores/filterSlice';

// Custom hook to get list options
const useListOptions = (module, fieldName) =>
  useSelector((state) => selectListOptions(state, module, fieldName));

const useListOptionsGlobal = (fieldName) =>
  useSelector((state) => state.globalData?.[fieldName] ?? []);

const useFilterItemValue = (module, fieldName) =>
  useSelector((state) => selectFilterItemValue(state, module, fieldName));


export default function ArticlesModal({ setIsDrawerOpen = () => {}, isDrawerOpen = false }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const dataArticleCategoriesList = useSelector((state) => 
    selectFilterItemValue(state, 'legalMatrix', 'article_categories_list')
  ) || [];  

  const [arrayArticleCategoriesList, setArrayArticleCategoriesList] = useState([]);

  useEffect(() => {
    console.log('cambio: ', dataArticleCategoriesList);
    if (Array.isArray(dataArticleCategoriesList) && dataArticleCategoriesList.length > 0) {
      console.log("dataArticleCategoriesList: ", dataArticleCategoriesList);

      setArrayArticleCategoriesList(
        dataArticleCategoriesList.map((item) => ({
          label: item.label,
          value: item.value
        }))
      );
    }
  }, [dataArticleCategoriesList]);

  const formFields = [
    {
      id: 'article_number',
      label: t('article_number'),
      type: 'text',
      required: true,
      defaultValue: '',
      options: []
    },
    {
      id: 'article_name',
      label: t('article_name'),
      type: 'text',
      required: true,
      defaultValue: '',
      options: []
    },
    {
      id: 'article_requirement',
      label: t('article_requirement'),
      type: 'textarea',
      required: true,
      defaultValue: '',
      options: []
    },
    {
      id: 'criticality',
      label: t('criticality'),
      type: 'dropdown',
      required: true,
      defaultValue: '',
      options: []
    },
    {
      id: 'category',
      label: t('category'),
      type: 'dropdown',
      required: true,
      defaultValue: '',
      options: arrayArticleCategoriesList,
    },
    {
      id: 'Status',
      label: t('Status'),
      type: 'dropdown',
      required: true,
      defaultValue: '',
      options: []
    },
    {
      id: 'GAP',
      label: t('GAP'),
      type: 'dropdown',
      required: true,
      defaultValue: '',
      options: []
    },
    {
      id: 'comments',
      label: t('comments'),
      type: 'textarea',
      required: true,
      defaultValue: '',
      options: []
    },
    {
      id: 'item_type',
      label: t('item_type'),
      type: 'dropdown',
      required: true,
      defaultValue: '',
      options: []
    },
    {
      id: 'dependency_id',
      label: t('dependency_id'),
      type: 'dropdown',
      required: true,
      defaultValue: '',
      options: []
    }
  ];

  return (
    <Dialog
      sx={{ minHeight: '80vh' }}
      fullWidth={true}
      maxWidth={'xl'}
      open={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography color="white" variant="h5" sx={{ flexGrow: 1 }}>
            {t('Add_articles')}
          </Typography>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="close"
          >
            <Close sx={{ color: 'white' }} />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, padding: 1 }}>
        <style>
          {` .mc-tab .MuiTabs-flexContainer {
        padding: 0;
        }`}
        </style>
        <Box sx={{ p: 2 }}>
          <Suspense fallback={<p>{t('loading')}</p>}>
            <FormBuilder
              showActionButton={true}
              inputFields={formFields}
              initialValues={[]}
              controlled={true}
              onChange={(id, value) => {}}
            />
          </Suspense>
        </Box>
      </Box>
    </Dialog>
  );
}
