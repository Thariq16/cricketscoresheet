import { AppBar, CssBaseline, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { KeyboardArrowLeft } from "@mui/icons-material";

const Header = ({ title, isModal, closeModal }) => {
  const navigate = useNavigate();

  return (
    <>
      <CssBaseline />
      <AppBar
        elevation={0} component="nav"
        style={{ backgroundColor: "var(--primary-color-white)" }}
      >
        <Toolbar>
          <IconButton onClick={() => { isModal ? closeModal("") : navigate(-1) }}>
            <KeyboardArrowLeft color="action" />
          </IconButton>
          <Typography variant="h6" noWrap>{title}</Typography>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;
