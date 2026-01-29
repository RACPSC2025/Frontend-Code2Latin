import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FileTreeView from '../../components/FileTreeView/FileTreeView';
import { getLegalTree } from '../../stores/legal/getLegalTreeSlice';
import { fetchListLevelExecutor } from '../../stores/tasks/fetchListLevelExecutorSlice';

function RequisitosLegalesTreeView({ onRequisitosLegalesTreeViewChange }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [legalTree, setLegalTree] = useState([]);
  const [levelEjecutor, setLevelEjecutor] = useState([]);
  const [loading, setLoading] = useState('initial');
  const [nivelEstructura, setNivelEstructura] = useState('');
  const [legalTreeFileView, setLegalTreeFileView] = useState({
    name: '',
    children: null
  });

  const getLegalTreeLoading = useSelector((state) => state?.getLegalTree?.loading ?? false);

  useEffect(() => {
    onRequisitosLegalesTreeViewChange(nivelEstructura);
  }, [nivelEstructura]);

  const handleFetchLegalTree = (id) => {
    const formData = new FormData();
    formData.append('level_id', id);
    dispatch(getLegalTree(formData)).then((data) => {
      if (data?.payload?.messages === 'Success') {
        setLegalTree(data?.payload?.data);
        setLegalTreeFileView({
          name: '',
          children: convertLegalTreeToTreeData(data?.payload?.data)
        });
      }
    });
  };

  const handleFetchLevelExecutor = () => {
    dispatch(fetchListLevelExecutor()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        setLevelEjecutor(data?.payload?.data);
      }
    });
  };


  const convertLegalTreeToTreeData = (legalTree) => {
    const treeData = [];
    legalTree.forEach((item) => {
      const newItem = {
        value: item.value,
        name: item.label
      };
      treeData.push(newItem);
    });
    return treeData;
  };

  useEffect(() => {
    // fetchLevelEjecutor();
    handleFetchLevelExecutor();
  }, []);

  const handleSelectChange = (event) => {
    setNivelEstructura(event.target.value);
    // fetchLegalTree(event.target.value);
    handleFetchLegalTree(event.target.value);
  };

  return (
    <>
      <FormControl fullWidth sx={{ marginBottom: '20px' }}>
        <InputLabel id="legalTree">{t('structure_level')}</InputLabel>
        <Select
          labelId="legalTree"
          id="legalTree"
          onChange={handleSelectChange}
          label={t('structure_level')}
        >
          {levelEjecutor.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <FileTreeView legalTreeData={legalTreeFileView} type="legal" /> */}

      {!nivelEstructura ? (
        <div>{t('select_option')}</div>
      ) : getLegalTreeLoading ? (
        <div>{t('loading')}</div>
      ) : (
        <FileTreeView legalTreeData={legalTreeFileView} type="legal" />
      )}
      {/* {getLegalTreeLoading ? (
         <div>{t('loading')}</div>
       ) : loading === 'loaded' ? (
         <FileTreeView legalTreeData={legalTreeFileView} type="legal" />
       ) : (
         nivelEstructura && <div>{t('select_option')}</div>
     )} */}
    </>
  );
}

export default RequisitosLegalesTreeView;
