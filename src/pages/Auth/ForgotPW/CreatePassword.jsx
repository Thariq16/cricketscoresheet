import React, { useState } from "react";
import { toast } from "react-toastify";
import { PrimaryButton } from "../../../components/CustomMUI/CustomButtons";
import { txt } from "../../../common/context";
import lock from "../../../assets/images/svg/lock.svg";
import { CircularProgress, Container, Typography } from "@mui/material";
import CustomPasswordField from "../../../components/CustomMUI/CustomPasswordField";
import { useNavigate } from "react-router-dom";
import { isPasswordValid, sendHttpRequest } from "../../../common/Common";

const CreatePassword = ({ playerId }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passMatchError, setPassMatchError] = useState("");

  const handleSave = (e) => {
    e.preventDefault();

    if (!isPasswordValid(password)) {
      setPasswordError(txt.password_invalid_format);
      return;
    }
    if (password !== confirmPassword) {
      setPassMatchError(txt.passwords_does_not_match);
      return;
    }

    setIsLoading(true);

    const data = {
      playerId,
      password
    };

    sendHttpRequest("POST", "/auth/forgot-password-create-password", null, JSON.stringify(data)).then(() => {
      toast.success(txt.new_password_set_successfully);
      navigate("/");
    }).catch((error) => {
      toast.error(error.response.data.message);
    }).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <Container>
      <form onSubmit={handleSave}>
        <img alt="lock" src={lock} width="100px" className="mb-15" />
        <Typography variant="h5">{txt.create_new_password}</Typography>
        <Typography variant="body2" className="my-15" gutterBottom>{txt.enter_new_password}</Typography>
        <CustomPasswordField
          label={txt.password} value={password}
          onChange={(e) => { setPassword(e.target.value); setPasswordError("") }}
          helperText={passwordError} error={!!passwordError}
        />
        <CustomPasswordField
          label={txt.c_password} value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setConfirmPasswordError("");
            setPassMatchError("")
          }}
          helperText={confirmPasswordError || passMatchError}
          error={!!confirmPasswordError || !!passMatchError}
        />
        <div id="recaptcha-container"></div>
        <PrimaryButton
          type="submit" className="my-15" disabled={isLoading}
          endIcon={isLoading && <CircularProgress color='inherit' size={'1.5rem'} />}
        >
          {txt.save}
        </PrimaryButton>
      </form>
    </Container>
  );
};

export default CreatePassword;