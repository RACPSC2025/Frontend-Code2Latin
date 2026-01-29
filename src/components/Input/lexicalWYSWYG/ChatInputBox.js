import React, { useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import {
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  SendRounded,
  AttachFileRounded,
  AutoFixHighRounded,
  SummarizeRounded,
  AutoAwesome,
} from "@mui/icons-material";

export default function ChatInputBox({
  value,
  onChange,
  onSend,
  onAttachFile,
  onCorrectText,
  onSummarizeText,
  onRuleAnalysisText,
  onCreateTask,
  loading = false
}) {
  const [internalText, setInternalText] = useState("");
  const text = value !== undefined ? value : internalText;
  const setText = onChange !== undefined ? onChange : setInternalText;

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files?.length > 0) {
      onAttachFile(e.target.files[0]);
    }
  };

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text);
  };

  const handleKeyPress = (e) => {
    /*
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    */
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-row gap-3 relative">
      {/* Columna 1: Textarea - ocupa todo el espacio disponible */}
      <div className="flex-grow flex flex-col">
        <TextareaAutosize
          minRows={20}
          maxRows={20}
          className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 p-3 text-gray-800 placeholder-gray-400 bg-white resize-none w-full"
          placeholder=""
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyPress}
        />
      </div>

      {/* Columna 2: Botones verticales - ancho fijo 150px */}
      <div className="w-[60px] flex flex-col items-center justify-start space-y-2">
        {/* Botón Adjuntar archivo */}
        <Tooltip title="Adjuntar archivo" 
        sx={{
          '& .MuiTooltip-tooltip': {
            marginBottom: '8px', // Ajusta la posición vertical
            paddingTop: '60px',
          }
        }}>
          <IconButton
            size="medium"
            //fontSize="2xl"
            className="text-gray-600 hover:text-blue-600 !text-2xl"
            onClick={() => fileInputRef.current?.click()}
          >
            <AttachFileRounded fontSize="105px" />
          </IconButton>
        </Tooltip>

        {/* Botón Corregir texto */}
        <Tooltip title="Corregir texto">
          <IconButton
            size="medium"
            className="text-gray-600 hover:text-blue-600 !text-2xl"
            onClick={() => onCorrectText?.(text)}
          >
            <AutoFixHighRounded fontSize="medium" />
          </IconButton>
        </Tooltip>

        {/* Botón Resumir texto */}
        <Tooltip title="Resumir texto">
          <IconButton
            size="medium"
            className="text-gray-600 hover:text-blue-600 !text-2xl"
            onClick={() => onSummarizeText?.(text)}
          >
            <SummarizeRounded fontSize="medium" />
          </IconButton>
        </Tooltip>

        {/* Botón Análisis de norma */}
        <Tooltip title="Análisis de norma">
          <IconButton
            size="medium"
            className="text-gray-600 hover:text-blue-600 !text-2xl"
            //onClick={() => onRuleAnalysisText?.(text)}
            onClick={onRuleAnalysisText}
          >
            <AutoAwesome fontSize="medium" />
          </IconButton>
        </Tooltip>

        {/* Botón crear tarea */}
        <Tooltip title="Análisis Asíncrono">
          <IconButton
            size="medium"
            className="text-gray-600 hover:text-blue-600 !text-2xl"
            //onClick={''}
            //onClick={() => onCreateTask?.(text)}
            onClick={onCreateTask}
          >
            <AutoAwesome fontSize="medium" />
          </IconButton>
        </Tooltip>

        {/* Botón Enviar */}
        <Tooltip title="Enviar">
          <IconButton
            onClick={handleSend}
            disabled={loading}
            size="medium"
            className="bg-blue-600 text-white hover:bg-blue-700 rounded-full active:scale-95 transition-transform mt-2 !text-2xl"
          >
            {loading ? <CircularProgress size={28} color="inherit" /> : <SendRounded fontSize="medium" />}
          </IconButton>
        </Tooltip>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}