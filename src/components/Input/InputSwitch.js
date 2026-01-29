import Switch from '@mui/material/Switch';

const InputSwitch = ({ field, value, onChange, error, ...rest }) => {
  return (
    <Switch
      key={field.id}
      sx={{ margin: '10px' }}
      size="medium"
      checked={value}
      onChange={(e) => onChange(field.id, e.target.checked)}
      {...rest}
    />
  );
};

export default InputSwitch;
