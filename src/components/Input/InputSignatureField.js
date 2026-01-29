import React, { useEffect, useState, useRef } from 'react';
import { InputLabel, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

import BaseFormControl from '../BaseFormControl';
import SignatureCanvas from 'react-signature-canvas';

const InputSignatureField = ({ field, value, onChange, error, ...rest }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(100);
  const { t } = useTranslation();

  useEffect(() => {
    if (containerRef.current && canvasRef.current) {
      const { clientWidth } = containerRef.current;
      setContainerWidth(clientWidth);
    }
  }, [containerRef, canvasRef]);

  const clearSignature = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  return (
    <BaseFormControl field={field} value={value} error={error} {...rest}>
      <InputLabel sx={{ mb: 1 }} htmlFor="signature-canvas">
        {field.label}
      </InputLabel>
      <Box
        ref={containerRef}
        sx={{
          border: '1px solid #ccc',
          borderRadius: 1,
          maxHeight: 300,
          width: '100%',
          overflow: 'hidden',
          position: 'relative' // Set to relative so the Button can be positioned absolutely inside
        }}
      >
        <Button
          variant="outlined"
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            zIndex: 1
          }}
          onClick={clearSignature}
        >
          {t('Reset')}
        </Button>
        <SignatureCanvas
          ref={canvasRef}
          penColor="green"
          canvasProps={{
            width: containerWidth,
            height: 200,
            className: 'sigCanvas',
            id: 'signature-canvas'
          }}
        />
      </Box>
    </BaseFormControl>
  );
};

export default InputSignatureField;
