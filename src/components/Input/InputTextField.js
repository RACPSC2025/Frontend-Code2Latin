import { TextField } from '@mui/material';

const InputTextField = ({ field = {}, value, onChange = () => {}, error, ...rest }) => (
  <TextField
    key={field.id}
    label={field.label}
    fullWidth
    value={value}
    error={Boolean(error)}
    helperText={error}
    onChange={(e) => onChange(field.id, e.target.value)}
    {...rest}
  />
);

export default InputTextField;
