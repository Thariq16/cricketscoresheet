import React, { useContext, useState } from "react";
import { Container, Box } from "@mui/material";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import OtpVerify from "./OtpVerify";
import KYC from "./KYC";
import { sendHttpRequest } from "../../../common/Common";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";

function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formdata, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "94",
    contactNo: "94",
    password: "",
    confirmPassword: "",
  });

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormDataChange = (key, value) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: value,
    }));
  };

  // Function to handle sending OTP and moving to OTP step
  const handleSendOtp = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const otpData = {
        contactNo: formdata.contactNo,
      };
      await sendHttpRequest("POST", "/auth/send-otp", null, JSON.stringify(otpData));
      toast.success("OTP sent successfully");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      console.log(error.response);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle final registration after OTP verification
  const handleRegister = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const data = {
      firstName: formdata.firstname,
      lastName: formdata.lastame,
      email: formdata.email,
      contactNo: formdata.contactNo,
      country: formdata.countryCode,
      password: formdata.password,
    };

    try {
      const res = await sendHttpRequest("POST", "/auth/register", null, JSON.stringify(data));
      localStorage.setItem('newRegister', 'true');
      login(res.data.data.token, res.data.data._id, res.data.data);
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      console.log(error.response);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box py={2} className="flex-center" style={{ minHeight: '100vh' }}>
      <Container>
        {step === 1 ? (
          <KYC
            formdata={formdata}
            setFormData={handleFormDataChange}
            goToNextStep={handleSendOtp}
            isSubmitting={isSubmitting}
          />
        ) : (
          <OtpVerify
            formdata={formdata}
            handleRegister={handleRegister}
            goBack={() => setStep(1)}
            isSubmitting={isSubmitting}
          />
        )}
      </Container>
    </Box>
  );
}

export default Register;