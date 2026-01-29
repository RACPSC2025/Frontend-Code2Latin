import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FileTreeView from '../../components/FileTreeView/FileTreeView';
import { fetchListGeovisor } from '../../stores/legal/fetchListGeovisorSlice';

function GeovisorTreeView() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [geovisorTreeFileView, setGeovisorTreeFileView] = useState({
    name: '',
    children: []
  });

  const geovisorListLoading = useSelector((state) => state?.fetchListGeovisor?.loading ?? false);

  const convertGeovisorToTreeData = (geovisor) => {
    const treeData = [];
    geovisor.forEach((item) => {
      const newItem = {
        value: item.value,
        name: item.label
      };
      treeData.push(newItem);
    });
    return treeData;
  };

  const handleFetchListGeovisor = () => {
    dispatch(fetchListGeovisor()).then((data) => {
      if (data?.payload?.messages === 'Success') {
        let geovisorArray = [];
        for (let i = 0; i < data?.payload?.data.length; i += 2) {
          geovisorArray.push({ ...data?.payload?.data[i], ...data?.payload?.data[i + 1] });
        }
        setGeovisorTreeFileView({
          name: '',
          children: convertGeovisorToTreeData(geovisorArray)
        });
      }
    });
  };

  useEffect(() => {
    // fetchGeovisor();
    handleFetchListGeovisor();
  }, []);

  return (
    <Box sx={{ margin: '20px 0' }}>
      <Typography variant="p">{t('geovisor_link')}</Typography>
      {geovisorListLoading ? (
        <div>{t('loading')}</div>
      ) : (
        <FileTreeView legalTreeData={geovisorTreeFileView} type="geovisor" />
      )}
    </Box>
  );
}

export default GeovisorTreeView;
