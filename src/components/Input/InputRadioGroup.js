import { RadioGroup, FormControlLabel, Radio } from '@mui/material';
import BaseFormControl from '../BaseFormControl';

const InputRadioGroup = ({ field, value, onChange, error, ...rest }) => {
  return (
    <BaseFormControl field={field} value={value} error={error} {...rest}>
      <RadioGroup value={value} onChange={(e) => onChange(field.id, e.target.value)}>
        {field.options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </BaseFormControl>
  );
};

export default InputRadioGroup;
