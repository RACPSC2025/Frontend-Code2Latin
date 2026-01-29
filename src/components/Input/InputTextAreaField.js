import { TextField } from '@mui/material';

const InputTextAreaField = ({ field, value, onChange, error, ...rest }) => (
  <TextField
    key={field.id}
    label={field.label}
    multiline
    rows={4}
    fullWidth
    value={value}
    error={Boolean(error)}
    helperText={error}
    onChange={(e) => onChange(field.id, e.target.value)}
    {...rest}
  />
);

export default InputTextAreaField;
