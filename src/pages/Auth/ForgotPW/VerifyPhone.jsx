import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PrimaryButton } from "../../../components/CustomMUI/CustomButtons";
import lock from "../../../assets/images/svg/lock.svg";
import { CircularProgress, Container, Typography } from "@mui/material";
import CustomMobileInput from "../../../components/CustomPhoneInput/CustomPhoneInput";
import CustomOtpInput from "../../../components/CustomMUI/CustomOtpInput";
import { txt } from "../../../common/context";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../../config/firebase";
import { isContactNo, sendHttpRequest } from "../../../common/Common";
import Header from "../../../components/Header";

const VerifyPhone = ({ setPlayerId, goToNextStep }) => {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [contactNoError, setContactNoError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOTPError] = useState("");
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isValidatingOTP, setIsValidatingOTP] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const recaptchaVerifierRef = useRef(null);

  useEffect(() => {
    if (isOtpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
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

  const handleSendOtp = () => {
    if (countryCode === "94") {
      if (!isContactNo(contactNo)) {
        setContactNoError(txt.please_enter_valid_contact_number);
        return;
      }
    } else {
      if (!contactNo) {
        setContactNoError("contactNoError", txt.please_enter_valid_contact_number);
        return;
      }
    }

    setIsSendingOTP(true);
    setIsOtpSent(false);

    if (countryCode === '94') {
      sendHttpRequest("POST", "/auth/send-otp", null, JSON.stringify({ contactNo })).then((res) => {
        setIsOtpSent(true);
        setTimer(60);
      }).catch((error) => {
        toast.error(error.response.data.message);
        console.log(error.response);
      }).finally(() => {
        setIsSendingOTP(false);
      });
    } else {
      initializeRecaptcha();
      signInWithPhoneNumber(auth, `+${contactNo}`, recaptchaVerifierRef.current).then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        setIsOtpSent(true);
        setTimer(60);
      }).catch((error) => {
        toast.error(error.message);
        console.log(error);
      }).finally(() => {
        setIsSendingOTP(false);
      });
    }
  };

  const verifyOTP = () => {
    if (otp.length !== 6) {
      setOTPError("Complete all the fields");
      return;
    }

    let playerId = "";

    setIsValidatingOTP(true);
    try {
      const response = sendHttpRequest("GET", `/auth/get-user-for-forgot/${contactNo}`);
      playerId = response.data.playerId;
      setPlayerId(playerId);
    } catch (error) {
      toast.error(txt.please_enter_valid_contact_number);
      console.error(error.response);
      return;
    }

    if (countryCode === '94') {
      const data = {
        contactNo: contactNo,
        otp: otp,
      }

      sendHttpRequest("POST", "/auth/verify-otp", null, JSON.stringify(data)).then(() => {
        goToNextStep();
      }).catch((error) => {
        toast.error(txt.invalid_otp);
        console.error(error.response);
      }).finally(() => {
        setIsValidatingOTP(false);
      });
    } else {
      confirmationResult.confirm(otp).then(() => {
        navigate("/createPassword", { playerId });
      }).catch((error) => {
        toast.error(txt.invalid_otp);
        console.error(error);
      }).finally(() => {
        setIsValidatingOTP(false);
      });
    }
  };

  return (
    <div>
      <Header title={txt.forgot_password} />
      <Container>
        <img alt="lock" src={lock} width="100px" className="mb-15" />
        <Typography variant="h5">{txt.forgot_password}</Typography>
        <Typography variant="body2" className="my-15" gutterBottom>{txt.enter_phone_number_to_get_new_password}</Typography>
        <CustomMobileInput
          countryCode={countryCode}
          phone={contactNo}
          onCountryChange={setCountryCode}
          onPhoneChange={setContactNo}
          label={txt.phone_number}
          disabled={timer === 0}
        />
        {contactNoError && <Typography variant="body2" color="error">{contactNoError}</Typography>}
        <Typography variant="body2" className="my-15" gutterBottom>{txt.enter_otp}</Typography>
        <CustomOtpInput
          numInputs={6}
          onChange={(value) => setOtp(value)}
        />
        {otpError && <Typography variant="body2" color="error">{otpError}</Typography>}
        <Typography variant="body2" gutterBottom className="my-15"
          onClick={timer === 0 ? handleSendOtp : null}
          style={{
            color: isOtpSent ? timer > 0 ? "var(--status-info)" : "var(--status-info)" : "gray",
            cursor: timer === 0 ? "pointer" : "default",
          }}
        >
          {isOtpSent ? timer > 0 ? `${txt.did_not_receive_code} in ${timer}s` : txt.did_not_receive_code : txt.did_not_receive_code}
        </Typography>
        <div id="recaptcha-container"></div>
        <PrimaryButton
          onClick={isOtpSent ? verifyOTP : handleSendOtp}
          disabled={isValidatingOTP || isSendingOTP}
          endIcon={(isValidatingOTP || isSendingOTP) && <CircularProgress color='inherit' size={'1.5rem'} />}
        >
          {isOtpSent ? txt.change_password : "Send OTP"}
        </PrimaryButton>
      </Container>
    </div>
  );
};

export default VerifyPhone;