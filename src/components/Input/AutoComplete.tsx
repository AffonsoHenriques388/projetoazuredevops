/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-types */
import React, { forwardRef, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { ChangeEvent } from 'react';

type AutoCompleteTypes = {
  label?: string;
  options: Array<{
    id: string;
    name: string;
  }>;

  value?: string | null;
  onChange: (id: string | null, name: string | null) => void;
};

const AutoCompleteComponentNameString = forwardRef<
  HTMLInputElement,
  AutoCompleteTypes
>(({ label, options, value, onChange }, ref) => {
  const handleChange = (
    _event: ChangeEvent<{}>,
    newValue: { id: string; name: string } | null,
  ) => {
    if (newValue) {
      onChange(newValue.id, newValue.name);
    } else {
      onChange(null, null);
    }
  };

  useEffect(() => {
    if (value !== null && value !== undefined) {
      const selectedOption = options.find((option) => option.id === value);
      if (!selectedOption) {
        onChange(null, null);
      }
    }
  }, [value, options]);

  return (
    <div style={{ width: '100%' }}>
      <Autocomplete
        id="autoComplete"
        options={options}
        onChange={handleChange}
        value={
          value !== null ? options.find((option) => option.id === value) : null
        }
        ListboxProps={{ style: { overflow: 'auto' } }}
        getOptionLabel={(option) => option.name}
        sx={{
          width: '100%',
          fontFamily: 'inter',
        }}
        className="font-inter mt-2"
        renderInput={(params) => (
          <TextField
            {...params}
            ref={ref}
            label={label}
            size="small"
            className="font-inter"
            fullWidth
            value={value || ''}
            onChange={(e) => {
              const newValue = options.find(
                (option) =>
                  option.id === e.target.value ||
                  option.name === e.target.value,
              );
              if (onChange && newValue) {
                onChange(newValue.id, newValue.name);
              } else {
                onChange(null, null);
              }
            }}
          />
        )}
      />
    </div>
  );
});

export { AutoCompleteComponentNameString };
