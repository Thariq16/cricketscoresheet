import React, { useRef } from 'react';
import CustomTextField from './CustomTextField';

const CustomOtpInput = ({ numInputs, onChange }) => {
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    if (value && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    const otpValue = inputRefs.current.map(input => input?.value || '').join('');
    onChange(otpValue);
  };

  return (
    <div className="flex-center">
      {Array.from({ length: numInputs }, (_, index) => (
        <CustomTextField
          key={index}
          inputRef={(el) => {
            if (inputRefs.current) {
              inputRefs.current[index] = el
            }
          }}
          inputProps={{ maxLength: 1 }}
          value={inputRefs.current[index]?.value || ''}
          onChange={(e) => handleChange(e, index)}
        />
      ))}
    </div>
  );
};

export default CustomOtpInput;