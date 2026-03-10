import React from "react";
import { BottomNavigation, BottomNavigationAction, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { SignalCellularAltRounded, SportsCricketOutlined, Home, } from '@mui/icons-material';

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (event, newValue) => {
    navigate(newValue);
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels value={location.pathname} onChange={handleChange} >
        <BottomNavigationAction
          label="Home"
          value="/home"
          icon={<Home />}
        />
        <BottomNavigationAction
          label="My Stats"
          value="/my-stats"
          icon={<SignalCellularAltRounded />}
        />
        <BottomNavigationAction
          label="My Matches"
          value="/match/all"
          icon={<SportsCricketOutlined />}
        />
      </BottomNavigation>
    </Box>
  );
}

export default BottomNav;