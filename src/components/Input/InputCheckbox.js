import { Checkbox } from '@mui/material';
import BaseFormControl from '../BaseFormControl';

const InputCheckbox = ({ field, value, onChange, error, ...rest }) => {
  const handleChange = (event) => {
    // Para campos ENUM que esperan 'Apply' o NULL
    const newValue = event.target.checked ? 'Apply' : null;
    onChange(field.id, newValue);
  };

  return (
    <BaseFormControl field={field} value={value} error={error} {...rest}>
      <Checkbox
        id={field.id}
        checked={value === 'Apply'}
        onChange={handleChange}
        {...rest}
      />
    </BaseFormControl>
  );
};

export default InputCheckbox;