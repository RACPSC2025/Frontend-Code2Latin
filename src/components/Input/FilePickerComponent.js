import { Box } from '@mui/material';
import { createRef, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { maxFileSizeAllowedInBytes } from '../../config/constants';
import { getHumanReadableFileSize } from '../../utils/others';
import BaseFormControl from '../BaseFormControl';
import FilePreviewSingle from './FilePreviewSingle';

const FilePickerComponent = ({ field, value, onChange, returnType = 'binary' }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationError, setValidationError] = useState('');
  const fileInputRef = createRef();
  let filePreview = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (selectedFile) {
      filePreview.current = URL.createObjectURL(selectedFile);
    }

    return () => {
      if (filePreview.current) {
        URL.revokeObjectURL(filePreview.current);
        filePreview.current = null;
      }
    };
  }, [selectedFile]);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      setValidationError(t('NoFileSelected'));
      return;
    }
    if (!file.type.match('image.*')) {
      setValidationError(t('OnlyImageFilesAllowed'));
      return;
    }
    if (file.size > maxFileSizeAllowedInBytes) {
      // 10KB
      setValidationError(t('FileSizeLimitExceeded') + ' ' + getMaxFileSize());
      return;
    }

    setSelectedFile(file);
    setValidationError('');

    let fileData = file;
    if (returnType === 'base64') {
      fileData = await convertToBase64(file);
    } else if (returnType === 'binary') {
      // For binary, use the File object directly
      fileData = file;
    }

    if (onChange) {
      onChange(field.id, fileData);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset the file input
    }
    // Optionally invoke onChange with null or empty value
    if (onChange) {
      onChange(field.id, null);
    }
  };

  const filePickerStyle = {
    border: '2px dashed #ccc',
    borderRadius: '5px',
    padding: '50px',
    textAlign: 'center',
    cursor: 'pointer',
    position: 'relative',
    background: '#f9f9f9',
    marginBottom: '10px'
  };

  const primaryButtonStyle = {
    display: 'inline-block',
    padding: '8px 15px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    marginTop: '10px',
    fontSize: '16px'
  };

  const getMaxFileSize = () => getHumanReadableFileSize(maxFileSizeAllowedInBytes);

  return (
    <BaseFormControl field={field} value={value}>
      {/* {filePreview.current && selectedFile && (
        <div>
          <img
            src={filePreview.current}
            alt="Preview"
            style={{ maxWidth: '100px', maxHeight: '100px' }}
          />
        </div>
      )} */}
      {validationError && <p style={{ color: 'red' }}>{validationError}</p>}
      <Box sx={filePickerStyle}>
        <input
          type="file"
          id={field.id}
          name="mc-file-picker"
          onChange={handleFileChange}
          accept=".jpeg,.png,.jpg"
          style={{ display: 'none' }}
          ref={fileInputRef}
        />
        <label htmlFor={field.id} style={primaryButtonStyle}>
          {t('Choose files')}
        </label>
        <Box sx={{ my: 1 }}>{t('Maximum file size')}: {getMaxFileSize()}</Box>
        <Box>{t('Allowed file types')}: .jpeg,.png,.jpg</Box>
      </Box>
      {selectedFile && (
        <Box sx={{ mt: 2 }}>
          <FilePreviewSingle file={selectedFile} removeFile={handleRemoveFile} />
        </Box>
      )}
    </BaseFormControl>
  );
};
export default FilePickerComponent;
