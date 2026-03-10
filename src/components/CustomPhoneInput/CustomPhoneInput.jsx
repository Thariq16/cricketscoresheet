import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import './CustomPhoneInput.css';

const CustomPhoneInput = ({ countryCode, phone, disabled, onCountryChange, onPhoneChange }) => {
  return (
    <div className="custom-mobile-input-container">
      <PhoneInput
        value={phone} country={countryCode}
        countryCodeEditable={true} disabled={disabled}
        autoFormat={true}
        enableSearch={true}
        onChange={(value, country) => { onPhoneChange(value); onCountryChange(country.dialCode) }}
        containerClass="custom-phone-input"
      />
    </div>
  );
};

export default CustomPhoneInput;