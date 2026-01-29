import React, { useState, useRef } from 'react';
import { 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemText, 
  IconButton,
  Divider,
  Tooltip,
  Paper,
  Snackbar
} from '@mui/material';
import { 
  AddRounded, 
  ChatRounded, 
  DeleteOutlineRounded,
  EditRounded,
  CheckRounded,
  ContentCopyRounded
} from '@mui/icons-material';

function ChatInterface({ 
  children,
  historicTextIA,
  setHistoricTextIA,
  currentHistoricIAPosition,
  setCurrentHistoricIAPosition
}) {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [hoveredMessageIndex, setHoveredMessageIndex] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ y: 0 }); // 🔧 Cambiado a Y
  const chatEndRef = useRef(null);
  const chatAreaRef = useRef(null);

  // Función para scroll manual
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Crear nueva conversación
  const handleNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      label: `Conversación ${historicTextIA.length + 1}`,
      contenido: []
    };
    setHistoricTextIA([...historicTextIA, newConversation]);
    setCurrentHistoricIAPosition(historicTextIA.length);
  };

  // Eliminar conversación
  const handleDeleteConversation = (index) => {
    if (historicTextIA.length > 1) {
      const newHistoric = historicTextIA.filter((_, i) => i !== index);
      setHistoricTextIA(newHistoric);
      if (currentHistoricIAPosition >= newHistoric.length) {
        setCurrentHistoricIAPosition(newHistoric.length - 1);
      }
    }
  };

  // Iniciar edición de título
  const handleStartEditTitle = (index, currentTitle) => {
    setEditingIndex(index);
    setEditingTitle(currentTitle);
  };

  // Guardar título editado
  const handleSaveTitle = (index) => {
    if (editingTitle.trim()) {
      const updatedHistoric = [...historicTextIA];
      updatedHistoric[index].label = editingTitle.trim();
      setHistoricTextIA(updatedHistoric);
    }
    setEditingIndex(null);
    setEditingTitle('');
  };

  // Cancelar edición de título
  const handleCancelEditTitle = () => {
    setEditingIndex(null);
    setEditingTitle('');
  };

  // Manejar cambios en el texto editable
  const handleContentChange = (messageIndex, e) => {
    const newText = e.currentTarget.textContent || '';
    
    // Actualizar solo si hay cambios reales
    if (newText !== historicTextIA[currentHistoricIAPosition].contenido[messageIndex].text) {
      const updatedHistoric = [...historicTextIA];
      updatedHistoric[currentHistoricIAPosition].contenido[messageIndex].text = newText;
      setHistoricTextIA(updatedHistoric);
    }
  };

  // Prevenir salto de línea con Enter (opcional)
  const handleKeyDown = (e) => {
    // Si quieres que Enter inserte salto de línea, comenta estas líneas
    // if (e.key === 'Enter' && !e.shiftKey) {
    //   e.preventDefault();
    // }
  };

  // Función para copiar texto al portapapeles
  const handleCopyText = async (messageIndex) => {
    try {
      const textToCopy = historicTextIA[currentHistoricIAPosition].contenido[messageIndex].text;
      await navigator.clipboard.writeText(textToCopy);
      setSnackbarOpen(true);
      console.log('✅ Texto copiado al portapapeles');
    } catch (error) {
      console.error('❌ Error al copiar texto:', error);
      alert('No se pudo copiar el texto. Por favor, inténtalo nuevamente.');
    }
  };

  // Cerrar notificación
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // 🔧 Manejar movimiento del mouse - seguir posición Y
  const handleMouseMove = (e, messageIndex) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top; // Posición Y relativa al contenedor
    
    // Limitar la posición para que los botones no se salgan del contenedor
    const buttonHeight = 32; // Altura de los botones
    const maxY = rect.height - buttonHeight;
    const constrainedY = Math.min(Math.max(y - buttonHeight / 2, 0), maxY);
    
    setCursorPosition({ y: constrainedY });
    setHoveredMessageIndex(messageIndex);
  };

  // Manejar cuando el mouse sale del mensaje
  const handleMouseLeave = () => {
    setHoveredMessageIndex(null);
  };

  const currentConversation = historicTextIA[currentHistoricIAPosition];

  return (
    <div className="flex h-screen">
      {/* Sidebar izquierdo - Lista de conversaciones */}
      <div className="w-64 bg-gray-100 border-r border-gray-300 flex flex-col">
        {/* Header del sidebar */}
        <div className="p-4 border-b border-gray-300 bg-white">
          <Tooltip title="Nueva conversación">
            <IconButton
              onClick={handleNewConversation}
              size="small"
              sx={{ 
                backgroundColor: '#2196f3', 
                color: 'white',
                '&:hover': { backgroundColor: '#1976d2' },
                width: '40px',
                height: '40px'
              }}
            >
              <AddRounded />
            </IconButton>
          </Tooltip>
        </div>

        {/* Lista de conversaciones */}
        <List className="flex-grow overflow-y-auto p-2">
          {historicTextIA.map((conversation, index) => (
            <ListItem
              key={conversation.id}
              disablePadding
              className="mb-2"
              secondaryAction={
                <div className="flex gap-1">
                  {editingIndex === index ? (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => handleSaveTitle(index)}
                      sx={{ color: '#4caf50' }}
                    >
                      <CheckRounded fontSize="small" />
                    </IconButton>
                  ) : (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStartEditTitle(index, conversation.label);
                      }}
                    >
                      <EditRounded fontSize="small" />
                    </IconButton>
                  )}
                  {historicTextIA.length > 1 && (
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(index);
                      }}
                    >
                      <DeleteOutlineRounded fontSize="small" />
                    </IconButton>
                  )}
                </div>
              }
            >
              {editingIndex === index ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => handleSaveTitle(index)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSaveTitle(index);
                    } else if (e.key === 'Escape') {
                      handleCancelEditTitle();
                    }
                  }}
                  autoFocus
                  className="w-full px-2 py-1 border rounded"
                />
              ) : (
                <ListItemButton
                  selected={currentHistoricIAPosition === index}
                  onClick={() => setCurrentHistoricIAPosition(index)}
                  sx={{
                    borderRadius: '8px',
                    borderLeft: currentHistoricIAPosition === index ? '4px solid #2196f3' : '4px solid transparent',
                    '&.Mui-selected': {
                      backgroundColor: '#e3f2fd',
                      '&:hover': { backgroundColor: '#bbdefb' }
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <ChatRounded 
                    className="mr-3" 
                    fontSize="small"
                    sx={{
                      color: currentHistoricIAPosition === index ? '#2196f3' : '#757575'
                    }}
                  />
                  <ListItemText
                    primary={conversation.label}
                    secondary={`${conversation.contenido.length} mensajes`}
                    primaryTypographyProps={{ 
                      fontSize: '14px',
                      fontWeight: 400,
                      color: currentHistoricIAPosition === index ? '#1976d2' : 'inherit',
                      sx: { 
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        pr: 6,
                        textDecoration: currentHistoricIAPosition === index ? 'underline' : 'none',
                        textDecorationColor: currentHistoricIAPosition === index ? '#2196f3' : 'transparent',
                        textDecorationThickness: '2px',
                        textUnderlineOffset: '3px'
                      }
                    }}
                    secondaryTypographyProps={{ 
                      fontSize: '12px',
                      color: currentHistoricIAPosition === index ? '#1976d2' : 'inherit'
                    }}
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
      </div>

      {/* Área principal - Chat e Input */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Área de historial de chat */}
        <div 
          ref={chatAreaRef}
          className="flex-grow overflow-y-auto bg-gray-50 p-6"
          style={{
            maxHeight: '400px'
          }}
        >
          <div className="w-full">
            {/* Header de la conversación actual */}
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                {currentConversation?.label}
              </h2>
            </div>

            {/* Mensajes del chat */}
            {currentConversation?.contenido.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">
                <ChatRounded sx={{ fontSize: 60, opacity: 0.3 }} />
                <p className="mt-4 text-lg">Inicia una conversación</p>
              </div>
            ) : (
              currentConversation?.contenido.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div 
                    className="relative  group max-w-[90%]"
                    //className="relative w-[620px] group max-w-[75%]"
                    onMouseMove={(e) => handleMouseMove(e, index)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Paper
                      elevation={1}
                      className={`p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {/* Div editable directamente */}
                      <div
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => handleContentChange(index, e)}
                        onKeyDown={handleKeyDown}
                        className="text-sm focus:outline-none"
                        style={{ 
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          overflowWrap: 'break-word',
                          fontSize: '0.875rem',
                          lineHeight: '1.5',
                          minHeight: '20px'
                        }}
                      >
                        {message.text}
                      </div>
                      
                      <p
                        className={`text-xs mt-2 ${
                          message.role === 'user'
                            ? 'text-blue-100'
                            : 'text-gray-500'
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </Paper>
                    
                    {/* 🔧 Botones de acción que siguen el cursor en Y */}
                    {hoveredMessageIndex === index && (
                      <div 
                        style={{
                          position: 'absolute',
                          top: `${cursorPosition.y}px`,
                          right: '-10px', // Posición X fija a la derecha
                          transition: 'top 0.1s ease-out',
                          display: 'flex',
                          gap: '4px',
                          zIndex: 10
                        }}
                      >
                        {/* Botón Copiar */}
                        <Tooltip title="Copiar">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyText(index);
                            }}
                            sx={{
                              backgroundColor: 'white',
                              boxShadow: 2,
                              width: '32px',
                              height: '32px',
                              '&:hover': { 
                                backgroundColor: '#e3f2fd',
                                color: '#2196f3',
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <ContentCopyRounded sx={{ fontSize: '16px' }} />
                          </IconButton>
                        </Tooltip>
                        
                        {/* Botón Editar */}
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            sx={{
                              backgroundColor: 'white',
                              boxShadow: 2,
                              width: '32px',
                              height: '32px',
                              '&:hover': { 
                                backgroundColor: '#fff3e0',
                                color: '#ff9800',
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <EditRounded sx={{ fontSize: '16px' }} />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        <Divider />

        {/* Área de input - Tu contenido existente */}
        <div className="p-4 bg-white border-t border-gray-200">
          {children}
        </div>
      </div>

      {/* Snackbar para notificación de copiado */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        message="✅ Texto copiado al portapapeles"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
}

export default ChatInterface;