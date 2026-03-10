import React, { useContext, useState } from "react";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import { Menu } from "@mui/icons-material";
import Logo from "../assets/images/FieldR_Logo_Blue.png";
// import MessageIcon from "../../assets/images/svg/message.svg";
// import NotificationIcon from "../../assets/images/svg/notification.svg";
import { AuthContext } from "../context/AuthContext";
import PlayerIcon from "../assets/images/svg/player.svg";
import TeamIcon from "../assets/images/svg/team.svg";
import MatchIcon from "../assets/images/svg/match.svg";
import TournamentIcon from "../assets/images/svg/tournament.svg";
import { txt } from "../common/context";
import { PrimaryButton } from "./CustomMUI/CustomButtons";
import PlayerProfileInfoCard from "./Player/PlayerProfileInfoCard";
import { Box, Typography } from "@mui/material";

export default function Navbar() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { logout, userInfo } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <AppBar
        elevation={0} component="nav"
        style={{ backgroundColor: "var(--primary-color-white)" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            style={{ display: 'flex', alignItems: 'center' }} onClick={() => setOpen(true)}
          >
            <Menu color="action" />
          </IconButton>
          <div className="flex-between">
            <img src={Logo} alt="FieldR Logo" width={50} />
            {/* Uncomment if needed */}
            {/* <div>
              <IconButton edge="end" color="inherit">
                <img src={MessageIcon} alt="Messages Icon" />
              </IconButton>
              <IconButton edge="end" color="inherit">
                <img src={NotificationIcon} alt="Notifications Icon" />
              </IconButton>
            </div> */}
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        ModalProps={{ keepMounted: true }} variant="temporary"
        open={open} onClose={() => setOpen(false)}
      >
        <Box className="px-15 py-15 flex-between" height="100%" flexDirection="column">
          <Box>
            <PlayerProfileInfoCard userInfo={userInfo} showCricketInfo={false} onClick={() => navigate("/profile")} />
            <Divider className="my-15" />
            <div className="d-flex flex-column">
              <div className="d-flex w-100 cursor-pointer" onClick={() => navigate("/player/all")}>
                <img src={PlayerIcon} alt="player icon" />
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>{txt.view_all_player}</Typography>
              </div>
              <div className="d-flex w-100 cursor-pointer" onClick={() => navigate('/team/all')}>
                <img src={TeamIcon} alt="team icon" />
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>{txt.view_all_teams}</Typography>
              </div>
              <div className="d-flex w-100 cursor-pointer" onClick={() => navigate('/match/all')}>
                <img src={MatchIcon} alt="match icon" />
                <Typography variant="body1" style={{ fontWeight: 'bold' }}>{txt.view_all_matches}</Typography>
              </div>
              <div className="d-flex w-100 cursor-pointer" onClick={() => navigate('/tournament/all')}>
              <img src={TournamentIcon} alt="tournament icon" />
              <Typography variant="body1" style={{ fontWeight: 'bold' }}>{txt.view_all_tournaments}</Typography>
            </div>
            </div>
          </Box>
          <PrimaryButton onClick={() => handleLogout()}>{txt.Logout}</PrimaryButton>
        </Box>
      </Drawer>
    </>
  );
}
