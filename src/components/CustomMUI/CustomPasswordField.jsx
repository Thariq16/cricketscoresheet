import { IconButton, InputAdornment } from "@mui/material";
import React, { useState } from "react";
import EyeShow from "../../assets/images/svg/eye-show.svg";
import EyeHide from "../../assets/images/svg/eye-hide.svg";
import CustomTextField from "./CustomTextField";

const CustomPasswordField = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <CustomTextField
      {...props}
      type={showPassword ? "text" : "password"}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={handleTogglePasswordVisibility}
              onMouseDown={(e) => e.preventDefault()}
              edge="end"
            >
              {showPassword ? (
                <img src={EyeShow} alt="" style={{ width: 24, height: 24 }} />
              ) : (
                <img src={EyeHide} alt="" style={{ width: 24, height: 24 }} />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomPasswordField;
