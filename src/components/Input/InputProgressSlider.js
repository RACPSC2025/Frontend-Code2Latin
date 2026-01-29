import { Box, Typography, Slider } from "@mui/material";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function InputProgressSlider({ value, defaultValue = 0, onChange, disabled = false }) {
  const { t } = useTranslation();

  const normalize = (val) => {
    const num = parseInt(val) || 0;
    return Math.min(100, Math.max(0, num));
  };

  // Usa `value` si lo recibe, si no, toma `defaultValue`
  const [localValue, setLocalValue] = useState(
    value !== undefined ? normalize(value) : normalize(defaultValue)
  );

  // Si cambia la prop `value`, sincroniza el estado local
  useEffect(() => {
    if (value !== undefined) {
      setLocalValue(normalize(value));
    }
  }, [value]);

  return (
    <Box sx={{ width: "100%" }}>
      
      <Slider
        value={localValue}
        min={0}
        max={100}
        step={1}
        //disabled={(defaultValue) === 100}
        disabled={disabled || (defaultValue) === 100} 
        onChange={(e, newValue) => setLocalValue(normalize(newValue))}
        onChangeCommitted={(e, newValue) => {
          const safeValue = normalize(newValue);
          setLocalValue(safeValue);
          if (onChange) onChange(safeValue);
        }}
      />
      {/*
      <Slider
        value={(localValue)}
        min={0}
        max={100}
        step={1}
        disabled={(localValue) === 100}  // 🔒 si está en 100, no se puede mover
        onChange={(e, newValue) => setLocalValue(newValue)}
        onChangeCommitted={(e, newValue) => onCommit(field.id, newValue)} 
      />
      */}

      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="body2" color="textSecondary">
          {localValue}% {t("of")} 100%
        </Typography>
      </Box>
    </Box>
  );
}