import React, { useState, useEffect, useRef } from 'react';
import { debounce } from 'radash';

import InputTextField from './Input/InputTextField';

const DebouncedTextField = ({ value, onChange, delay = 300, ...rest }) => {
  const [model, setModel] = useState('');

  const debouncedEmitOnChange = useRef(
    debounce({ delay }, (...args) => {
      onChange(...args);
    })
  ).current; // Adjust the 300ms debounce time as needed

  useEffect(() => {
    if (value !== model) {
      setModel(value);
    }
  }, [value]);

  const handleChangeInput = (fieldID, value) => {
    setModel(value);
    debouncedEmitOnChange(fieldID, value);
  };

  return <InputTextField value={model} onChange={handleChangeInput} {...rest} />;
};

export default DebouncedTextField;
