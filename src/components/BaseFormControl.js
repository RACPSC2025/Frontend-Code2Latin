import { FormControl, FormHelperText } from '@mui/material';

const BaseFormControl = ({ field, value, error, children, ...rest }) => {
  const isErrorOccurred = Boolean(error);
  return (
    <FormControl fullWidth key={field.id} error={isErrorOccurred} {...rest}>
      {children}
      {isErrorOccurred ? <FormHelperText>{error}</FormHelperText> : null}
    </FormControl>
  );
};

export default BaseFormControl;
