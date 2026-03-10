import { Button, Grid, Typography } from '@mui/material'
import React from 'react'
import { txt } from '../../../common/context'
import CustomTextField from '../../../components/CustomMUI/CustomTextField'
import CustomPasswordField from '../../../components/CustomMUI/CustomPasswordField'
import { PrimaryButton } from '../../../components/CustomMUI/CustomButtons'
import { useNavigate } from 'react-router-dom'
import logo from '../../../assets/images/FieldR_Logo_Blue.png'
import { isContactNo, isPasswordValid } from '../../../common/Common'
import CustomPhoneInput from '../../../components/CustomPhoneInput/CustomPhoneInput'

function KYC({ formdata, setFormData, goToNextStep, isSubmitting }) {
  const navigate = useNavigate()

  function handleNext(e) {
    e.preventDefault();

    let valid = true;

    if (formdata.countryCode === "94") {
      if (!isContactNo(formdata.contactNo)) {
        setFormData("contactNoError", txt.please_enter_valid_contact_number);
        valid = false;
      }
    } else {
      if (!formdata.contactNo) {
        setFormData("contactNoError", txt.please_enter_valid_contact_number);
        valid = false;
      }
    }

    if (!isPasswordValid(formdata.password)) {
      setFormData("passwordError", txt.password_invalid_format);
      valid = false;
    }

    if (formdata.password !== formdata.confirmPassword) {
      setFormData("passMatchError", txt.passwords_does_not_match);
      valid = false;
    }

    if (valid) goToNextStep();
  }

  return (
    <form onSubmit={handleNext}>
      <img width="150px" alt="FieldR Logo" className='mb-15' src={logo} />
      <Typography variant="h4" align="left" className="text-primary">
        {txt.register}
      </Typography>
      <Typography variant="body1" align="left" className="text-primary" gutterBottom>
        {txt.register_below_txt}
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            label={txt.first_name}
            type="text"
            value={formdata.firstname}
            onChange={(e) => { setFormData("firstname", e.target.value); setFormData("firstnameError", "") }}
            helperText={formdata.firstnameError}
            error={!!formdata.firstnameError}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CustomTextField
            label={txt.last_name}
            type="text"
            value={formdata.lastname}
            onChange={(e) => { setFormData("lastname", e.target.value); setFormData("lastnameError", "") }}
            helperText={formdata.lastnameError}
            error={!!formdata.lastnameError}
          />
        </Grid>
      </Grid>
      <CustomTextField
        label={txt.email_address}
        type="email"
        value={formdata.email}
        onChange={(e) => { setFormData("email", e.target.value); setFormData("emailError", "") }}
        helperText={formdata.emailError}
        error={!!formdata.emailError}
      />
      <CustomPhoneInput
        label={txt.phone_number}
        countryCode={formdata.countryCode}
        phone={formdata.contactNo}
        onCountryChange={(value) => setFormData("countryCode", value)}
        onPhoneChange={(value) => setFormData("contactNo", value)}
      />
      {formdata.contactNoError && <Typography variant="body2" color="error">{formdata.contactNoError}</Typography>}
      <CustomPasswordField
        label={txt.password}
        value={formdata.password}
        onChange={(e) => { setFormData("password", e.target.value); setFormData("passwordError", "") }}
        helperText={formdata.passwordError}
        error={!!formdata.passwordError}
      />
      <CustomPasswordField
        label={txt.c_password}
        value={formdata.confirmPassword}
        onChange={(e) => {
          setFormData("confirmPassword", e.target.value);
          setFormData("confirmPasswordError", "");
          setFormData("passMatchError", "");
        }}
        helperText={formdata.confirmPasswordError || formdata.passMatchError}
        error={!!formdata.confirmPasswordError || !!formdata.passMatchError}
      />
      <PrimaryButton type="submit" className="my-15" disabled={isSubmitting}>
        {isSubmitting ? txt.sending_otp : txt.register}
      </PrimaryButton>
      <Button
        variant="text"
        fullWidth
        style={{ textTransform: 'none' }}
        className="text-info"
        onClick={() => navigate("/")}
        size="small"
      >
        <b>{txt.already_register}</b>
      </Button>
    </form>
  )
}

export default KYC