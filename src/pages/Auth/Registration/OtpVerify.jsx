import React, { useState, useEffect, useRef } from "react";
import { PrimaryButton } from "../../../components/CustomMUI/CustomButtons";
import lock from "../../../assets/images/svg/lock.svg";
import { CircularProgress, Typography, Container } from "@mui/material";
import CustomMobileInput from "../../../components/CustomPhoneInput/CustomPhoneInput";
import CustomOtpInput from "../../../components/CustomMUI/CustomOtpInput";
import { sendHttpRequest } from "../../../common/Common";
import { txt } from "../../../common/context";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../../config/firebase";
import { toast } from "react-toastify";
import Header from "../../../components/Header";

const OtpVerify = ({ formdata, handleRegister, goBack }) => {
  const [otp, setOtp] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isValidatingOTP, setIsValidatingOTP] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const recaptchaVerifierRef = useRef(null);
  const interval = useRef(null);

  //useEffect(() => {
  //  handleSendOtp();
  //  return () => clearInterval(interval.current);//
  //}, []);

  useEffect(() => {
    if (isOtpSent && timer > 0) {
      interval.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval.current);
    }
  }, [isOtpSent, timer]);

  const initializeRecaptcha = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier("recaptcha-container", {
        size: "invisible",
        callback: () => console.log("reCAPTCHA solved"),
        "expired-callback": () => console.error("reCAPTCHA expired"),
      }, auth);
      recaptchaVerifierRef.current.render();
    }
  };

  const handleSendOtp = async () => {
    if (isSendingOTP) return;

    setIsSendingOTP(true);
    setIsOtpSent(false);

    try {
      if (formdata.countryCode === '94') {
        const response = await sendHttpRequest("POST", "/auth/send-otp", null, JSON.stringify({ contactNo: formdata.contactNo }));
        
        if (response.data?.success || response.status === 200) {
          toast.success("OTP sent successfully");
          setIsOtpSent(true);
          setTimer(60);
        } else {
          toast.error(response.data?.message || "Failed to send OTP");
        }
      } else {
        initializeRecaptcha();
        const confirmation = await signInWithPhoneNumber(auth, `+${formdata.contactNo}`, recaptchaVerifierRef.current);
        setConfirmationResult(confirmation);
        toast.success("OTP sent successfully");
        setIsOtpSent(true);
        setTimer(60);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (error.response?.status === 429) {
        toast.error(error.response.data.message || "Please wait before requesting another OTP");
      } else {
        toast.error(error.response?.data?.message || "Failed to send OTP");
      }
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsValidatingOTP(true);

    try {
      if (formdata.countryCode === '94') {
        const data = { contactNo: formdata.contactNo, otp };
        const response = await sendHttpRequest("POST", "/auth/verify-otp", null, JSON.stringify(data));
        
        if (response.data?.success || response.status === 200) {
          toast.success("OTP verified successfully");
          handleRegister();
        } else {
          toast.error(response.data?.message || txt.invalid_otp);
        }
      } else {
        await confirmationResult.confirm(otp);
        toast.success("Phone number verified successfully");
        handleRegister();
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error(error.response?.data?.message || txt.invalid_otp);
    } finally {
      setIsValidatingOTP(false);
    }
  };

  const handleResendOtp = () => {
    if (timer > 0) {
      toast.warning(`Please wait ${timer} seconds before requesting another OTP`);
      return;
    }
    handleSendOtp();
  };

  return (
    <Container>
      <Header isModal={true} closeModal={goBack} title={txt.number_verification} />
      <img alt="lock" src={lock} width="100px" className="mb-15" />
      <Typography variant="h5">{txt.number_verification}</Typography>
      <CustomMobileInput
        label={txt.phone_number}
        countryCode={formdata.countryCode}
        phone={formdata.contactNo}
        disabled
      />
      <Typography variant="body2" className="my-15" gutterBottom>
        {txt.enter_otp}
      </Typography>
      <CustomOtpInput
        numInputs={6}
        onChange={setOtp}
        value={otp}
      />
      <Typography
        variant="body2"
        gutterBottom
        className="my-15"
        onClick={timer === 0 ? handleResendOtp : undefined}
        style={{
          color: timer > 0 ? "var(--status-info)" : "var(--primary-color)",
          cursor: timer === 0 ? "pointer" : "default",
          textDecoration: timer === 0 ? "underline" : "none",
        }}
      >
        {isOtpSent
          ? timer > 0
            ? `${txt.did_not_receive_code} in ${timer}s`
            : txt.did_not_receive_code
          : txt.did_not_receive_code}
      </Typography>
      <div id="recaptcha-container"></div>
      <PrimaryButton
        onClick={handleVerify}
        disabled={isValidatingOTP || isSendingOTP || !otp || otp.length !== 6}
        endIcon={(isValidatingOTP || isSendingOTP) && <CircularProgress color='inherit' size={'1.5rem'} />}
        fullWidth
      >
        {isSendingOTP
          ? "Sending OTP..."
          : isValidatingOTP
            ? "Verifying..."
            : txt.register}
      </PrimaryButton>
    </Container>
  );
};

export default OtpVerify;