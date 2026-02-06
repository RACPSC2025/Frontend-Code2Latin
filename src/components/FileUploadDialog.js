import React, { useState, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Alert,
  Chip,
  Divider
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  PictureAsPdf as PdfIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const FileUploadDialog = ({ 
  open, 
  onClose, 
  onUpload, 
  title = "Subir Archivos",
  acceptedTypes = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png",
  maxFileSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 10,
  taskId = null,
  logtaskId = null
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);
  
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);

  // ✅ FUNCIÓN PARA ABRIR SELECTOR DE ARCHIVOS
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // ✅ FUNCIÓN PARA MANEJAR ARCHIVOS SELECCIONADOS
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = [];
    const newErrors = [];

    files.forEach(file => {
      // Validar tipo de archivo
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        newErrors.push(`${file.name}: Tipo de archivo no permitido`);
        return;
      }

      // Validar tamaño
      if (file.size > maxFileSize) {
        newErrors.push(`${file.name}: Archivo demasiado grande (máx. ${(maxFileSize / 1024 / 1024).toFixed(1)}MB)`);
        return;
      }

      // Verificar si ya existe
      if (selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
        newErrors.push(`${file.name}: Archivo ya seleccionado`);
        return;
      }

      validFiles.push({
        file,
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type,
        status: 'pending' // pending, uploading, success, error
      });
    });

    // Verificar límite de archivos
    if (selectedFiles.length + validFiles.length > maxFiles) {
      newErrors.push(`Máximo ${maxFiles} archivos permitidos`);
    } else {
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }

    setErrors(newErrors);
    
    // Limpiar input
    event.target.value = '';
  };

  // ✅ FUNCIÓN PARA REMOVER ARCHIVO
  const handleRemoveFile = (fileId) => {
    setSelectedFiles(prev => prev.filter(f => f.id !== fileId));
    setErrors([]);
  };

  // ✅ FUNCIÓN PARA OBTENER ICONO DE ARCHIVO
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <PdfIcon sx={{ color: '#f44336' }} />;
      case 'doc':
      case 'docx':
        return <AttachFileIcon sx={{ color: '#2196f3' }} />;
      case 'xls':
      case 'xlsx':
        return <AttachFileIcon sx={{ color: '#4caf50' }} />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <AttachFileIcon sx={{ color: '#ff9800' }} />;
      default:
        return <AttachFileIcon sx={{ color: '#90a4ae' }} />;
    }
  };

  // ✅ FUNCIÓN PARA FORMATEAR TAMAÑO DE ARCHIVO
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // ✅ FUNCIÓN PARA SUBIR ARCHIVOS
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const uploadPromises = selectedFiles.map(async (fileData) => {
      try {
        // Actualizar estado a uploading
        setSelectedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { ...f, status: 'uploading' } : f)
        );

        // Simular progreso de subida
        for (let progress = 0; progress <= 100; progress += 10) {
          setUploadProgress(prev => ({ ...prev, [fileData.id]: progress }));
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        // Crear FormData
        const formData = new FormData();
        formData.append('file', fileData.file);
        formData.append('task_id', taskId || '');
        formData.append('logtask_id', logtaskId || '');
        formData.append('file_type', 'attachment');

        // Aquí iría la llamada real a la API
        // const response = await axiosInstance.post('/upload_attachment', formData);
        
        // Simular respuesta exitosa
        await new Promise(resolve => setTimeout(resolve, 500));

        // Actualizar estado a success
        setSelectedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { ...f, status: 'success' } : f)
        );

        return { success: true, fileId: fileData.id, fileName: fileData.name };
      } catch (error) {
        console.error('Error uploading file:', error);
        
        // Actualizar estado a error
        setSelectedFiles(prev => 
          prev.map(f => f.id === fileData.id ? { ...f, status: 'error' } : f)
        );

        return { success: false, fileId: fileData.id, fileName: fileData.name, error: error.message };
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;

      console.log(`✅ Archivos subidos: ${successCount}, Errores: ${errorCount}`);

      // Llamar callback con resultados
      if (onUpload) {
        onUpload(results);
      }

      // Si todos fueron exitosos, cerrar dialog después de un momento
      if (errorCount === 0) {
        setTimeout(() => {
          handleClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error en proceso de subida:', error);
    } finally {
      setUploading(false);
    }
  };

  // ✅ FUNCIÓN PARA CERRAR DIALOG
  const handleClose = () => {
    if (!uploading) {
      setSelectedFiles([]);
      setUploadProgress({});
      setErrors([]);
      onClose();
    }
  };

  // ✅ FUNCIÓN PARA DRAG & DROP
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    
    // Simular evento de input para reutilizar lógica
    const mockEvent = {
      target: { files, value: '' }
    };
    handleFileChange(mockEvent);
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AttachFileIcon sx={{ color: '#1a90ff' }} />
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        </Box>
        {(taskId || logtaskId) && (
          <Typography variant="caption" sx={{ color: '#90a4ae', display: 'block', mt: 0.5 }}>
            {taskId ? `Tarea #${taskId}` : `Ciclo #${logtaskId}`}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        {/* ✅ ZONA DE DRAG & DROP */}
        <Box
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleFileSelect}
          sx={{
            border: '2px dashed #e0e6ed',
            borderRadius: 3,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            bgcolor: '#fafbfc',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#1a90ff',
              bgcolor: '#f5f9ff'
            }
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: '#90a4ae', mb: 2 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#263238', mb: 1 }}>
            Arrastra archivos aquí o haz clic para seleccionar
          </Typography>
          <Typography variant="body2" sx={{ color: '#90a4ae', mb: 2 }}>
            Formatos permitidos: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
          </Typography>
          <Typography variant="caption" sx={{ color: '#90a4ae' }}>
            Máximo {maxFiles} archivos, {(maxFileSize / 1024 / 1024).toFixed(1)}MB por archivo
          </Typography>
        </Box>

        {/* ✅ INPUT OCULTO */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* ✅ ERRORES */}
        {errors.length > 0 && (
          <Box sx={{ mt: 2 }}>
            {errors.map((error, index) => (
              <Alert key={index} severity="error" sx={{ mb: 1, fontSize: '0.8rem' }}>
                {error}
              </Alert>
            ))}
          </Box>
        )}

        {/* ✅ LISTA DE ARCHIVOS SELECCIONADOS */}
        {selectedFiles.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#263238' }}>
              Archivos Seleccionados ({selectedFiles.length})
            </Typography>
            
            <List dense sx={{ bgcolor: '#fafbfc', borderRadius: 2, border: '1px solid #edf2f4' }}>
              {selectedFiles.map((fileData, index) => (
                <React.Fragment key={fileData.id}>
                  <ListItem sx={{ py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {fileData.status === 'success' ? (
                        <CheckCircleIcon sx={{ color: '#4caf50' }} />
                      ) : fileData.status === 'error' ? (
                        <ErrorIcon sx={{ color: '#f44336' }} />
                      ) : (
                        getFileIcon(fileData.name)
                      )}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Typography sx={{ 
                          fontSize: '0.9rem', 
                          fontWeight: 600,
                          color: fileData.status === 'error' ? '#f44336' : '#263238'
                        }}>
                          {fileData.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography sx={{ fontSize: '0.75rem', color: '#90a4ae' }}>
                            {formatFileSize(fileData.size)}
                          </Typography>
                          
                          {/* Progress bar durante subida */}
                          {fileData.status === 'uploading' && (
                            <LinearProgress 
                              variant="determinate" 
                              value={uploadProgress[fileData.id] || 0}
                              sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                            />
                          )}
                          
                          {/* Estado */}
                          {fileData.status !== 'pending' && fileData.status !== 'uploading' && (
                            <Chip
                              label={
                                fileData.status === 'success' ? 'Subido' :
                                fileData.status === 'error' ? 'Error' : 'Pendiente'
                              }
                              size="small"
                              sx={{
                                mt: 0.5,
                                height: 20,
                                fontSize: '0.65rem',
                                bgcolor: 
                                  fileData.status === 'success' ? '#e8f5e9' :
                                  fileData.status === 'error' ? '#ffebee' : '#f5f5f5',
                                color:
                                  fileData.status === 'success' ? '#4caf50' :
                                  fileData.status === 'error' ? '#f44336' : '#90a4ae'
                              }}
                            />
                          )}
                        </Box>
                      }
                    />
                    
                    {fileData.status === 'pending' && (
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          size="small"
                          onClick={() => handleRemoveFile(fileData.id)}
                          disabled={uploading}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    )}
                  </ListItem>
                  
                  {index < selectedFiles.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose}
          disabled={uploading}
          sx={{ textTransform: 'none' }}
        >
          Cancelar
        </Button>
        
        <Button
          onClick={handleUpload}
          disabled={selectedFiles.length === 0 || uploading}
          variant="contained"
          sx={{
            bgcolor: '#1a90ff',
            '&:hover': { bgcolor: '#1976d2' },
            textTransform: 'none',
            fontWeight: 700,
            px: 3
          }}
        >
          {uploading ? 'Subiendo...' : `Subir ${selectedFiles.length} archivo${selectedFiles.length !== 1 ? 's' : ''}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileUploadDialog;