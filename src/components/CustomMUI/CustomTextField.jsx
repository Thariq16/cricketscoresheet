import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import React from 'react';

const StyledTextField = styled(TextField)({
  backgroundColor: "var(--placeholder-bg)",
  borderRadius: "4px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "var(--primary-color-500)",
    },
    "&:hover fieldset": {
      borderColor: "var(--primary-color-500)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "var(--primary-color-500)",
    },
  },
  "& label": {
    color: "var(--primary-color-700)",
  },

});

const CustomTextField = (props) => {
  const { readOnly, ...otherProps } = props;
  return (
    <StyledTextField
      fullWidth
      required
      variant='outlined'
      margin='normal'
      InputProps={{ ...props.InputProps, readOnly }}
      {...otherProps}
    />
  );
};

export default CustomTextField;