import React, { useContext, useState } from "react";
import { CircularProgress, Typography, Box, Divider, Container } from "@mui/material";
import { isContactNo, sendHttpRequest } from "../../common/Common";
import logo from "../../assets/images/FieldR_Logo_Blue.png";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import CustomTextField from "../../components/CustomMUI/CustomTextField";
import CustomPasswordField from "../../components/CustomMUI/CustomPasswordField";
import { PrimaryButton } from "../../components/CustomMUI/CustomButtons";
import { txt } from "../../common/context";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login, updateUserInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  const [emailOrContactNo, setEmailOrContactNo] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailOrContactNoError, setEmailOrContactNoError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleGoogleLoginSuccess = async (res) => {
    setIsLoading(true);

    const data = { googleToken: await res.credential };

    sendHttpRequest("POST", "/auth/google-login", null, JSON.stringify(data)).then((res) => {
      updateUserInfo(res.data.data);
      login(res.data.data.token, res.data.data._id, res.data.data);
      navigate('/home');
    }).catch((error) => {
      toast.error(error.response.data.message);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const handleGoogleLoginFailure = (res) => {
    toast.error(res.error);
  };

  function isEmail(email) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const handleLogin = async () => {
    setEmailOrContactNoError("");
    setPasswordError("");

    if (!emailOrContactNo) {
      setEmailOrContactNoError(txt.enter_your_email_or_your_phone_number);
      return;
    }
    if (!password) {
      setPasswordError(txt.enter_password);
      return;
    }

    let params = {};
    if (emailOrContactNo.includes("@")) {
      if (!isEmail(emailOrContactNo)) {
        setEmailOrContactNoError(txt.please_enter_valid_email_address);
        return;
      } else {
        params = {
          email: emailOrContactNo,
          password: password,
        };
      }
    } else {
      if (!isContactNo(emailOrContactNo)) {
        setEmailOrContactNoError(txt.please_enter_valid_contact_number);
        return;
      } else {
        params = {
          contactNo: emailOrContactNo,
          password: password,
        };
      }
    }

    setIsLoading(true);

    try {
      const res = await sendHttpRequest("POST", "/auth/login", null, JSON.stringify(params));
      login(res.data.data.token, res.data.data._id, res.data.data);
      navigate("/home");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error.response);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box py={2} className="flex-center" style={{ minHeight: '100vh' }}>
      <Container>
        <img alt="FieldR Logo" width='200px' src={logo} />
        <h1 className="text-left">{txt.log_in}</h1>
        <p className="text-left">{txt.login_below_text}</p>
        <CustomTextField
          label={txt.email_contact} type="text"
          value={emailOrContactNo}
          onChange={(e) => { setEmailOrContactNo(e.target.value); setEmailOrContactNoError("") }}
          helperText={emailOrContactNoError}
          error={!!emailOrContactNoError}
        />
        <CustomPasswordField
          label={txt.password}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setPasswordError("") }}
          helperText={passwordError}
          error={!!passwordError}
        />
        <Typography
          variant="body2" align="left" className="text-info cursor-pointer" gutterBottom
          onClick={() => navigate("/forgotPassword")}
        >
          <b>{txt.forgot_password}</b>
        </Typography>
        <PrimaryButton
          onClick={handleLogin} disabled={isLoading} className="mt-15"
          endIcon={isLoading && <CircularProgress color='inherit' size={'1.5rem'} />}
        >
          {txt.login}
        </PrimaryButton>
        <Box my={2} className="flex-between">
          <div style={{ width: '100%' }}><Divider orientation="horizontal" /></div>
          <div style={{ width: '100%' }}><Typography variant="body1" align="center" noWrap style={{ width: '100%' }} >{txt.or_continue_with}</Typography></div>
          <div style={{ width: '100%' }}><Divider orientation="horizontal" /></div>
        </Box>
        <center>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginFailure}
            useOneTap
            shape="circle"
            logo_alignment="center"
            theme="outline"
            locale="en"
          />
        </center>
        <Typography
          variant="body2" align="center" onClick={() => navigate("/signup")}
          className="text-info mt-15 cursor-pointer"
        >
          <b>{txt.new_user_register}</b>
        </Typography>
      </Container>
    </Box>
  )
};

export default Login;